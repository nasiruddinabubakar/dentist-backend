const invoiceRepository = require('../repositories/InvoiceRepository');
const appointmentRepository = require('../repositories/AppointmentRepository');
const emailService = require('./EmailService');
const { Service, Clinic } = require('../models');

class InvoiceService {
  async getInvoices(clinicId) {
    return invoiceRepository.findByClinicId(clinicId, {
      order: [['issueDate', 'DESC']]
    });
  }

  async getInvoiceById(id, clinicId) {
    const invoice = await invoiceRepository.findById(id, {
      include: [
        { association: 'patient' },
        { association: 'appointment' },
        { association: 'items', include: [{ association: 'service' }] }
      ]
    });
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    if (invoice.clinicId !== clinicId) {
      throw new Error('Unauthorized access to invoice');
    }
    return invoice;
  }

  async createInvoice(data) {
    const { items, ...invoiceData } = data;

    // Generate invoice number if not provided
    if (!invoiceData.invoiceNumber) {
      invoiceData.invoiceNumber = await invoiceRepository.generateInvoiceNumber();
    }

    // Calculate totals if items are provided
    if (items && items.length > 0) {
      const { Service } = require('../models');
      
      const processedItems = await Promise.all(items.map(async (item) => {
        const quantity = item.quantity || 1;
        let unitPrice = parseFloat(item.unitPrice || item.price || 0);
        let serviceName = item.serviceName || item.description || 'Service';
        
        // If serviceId is provided, get current service details as snapshot
        if (item.serviceId) {
          try {
            const service = await Service.findByPk(item.serviceId);
            if (service) {
              // Use current service details but store them as snapshot
              serviceName = service.name;
              if (!unitPrice || unitPrice === 0) {
                unitPrice = parseFloat(service.price);
              }
            }
          } catch (error) {
            // Service might be deleted, use provided values
            console.warn('Service not found, using provided values:', error.message);
          }
        }
        
        const total = quantity * unitPrice;
        return {
          serviceId: item.serviceId || null, // Keep reference but don't rely on it
          serviceName: serviceName, // Store actual name as snapshot
          description: item.serviceName || item.description || serviceName,
          quantity,
          unitPrice,
          total
        };
      }));

      const subtotal = processedItems.reduce((sum, item) => sum + item.total, 0);
      
      invoiceData.subtotal = subtotal;
      invoiceData.tax = invoiceData.tax || 0;
      invoiceData.total = subtotal + (invoiceData.tax || 0);

      return invoiceRepository.createWithItems(invoiceData, processedItems);
    }

    return invoiceRepository.createWithItems(invoiceData, []);
  }

  async updateInvoice(id, data, clinicId) {
    await this.getInvoiceById(id, clinicId);
    const { items, ...invoiceData } = data;

    // Recalculate totals if items are provided
    if (items && items.length > 0) {
      const { Service } = require('../models');
      
      const processedItems = await Promise.all(items.map(async (item) => {
        const quantity = item.quantity || 1;
        let unitPrice = parseFloat(item.unitPrice || item.price || 0);
        let serviceName = item.serviceName || item.description || 'Service';
        
        // If serviceId is provided, get current service details as snapshot
        if (item.serviceId) {
          try {
            const service = await Service.findByPk(item.serviceId);
            if (service) {
              // Use current service details but store them as snapshot
              serviceName = service.name;
              if (!unitPrice || unitPrice === 0) {
                unitPrice = parseFloat(service.price);
              }
            }
          } catch (error) {
            // Service might be deleted, use provided values
            console.warn('Service not found, using provided values:', error.message);
          }
        }
        
        const total = quantity * unitPrice;
        return {
          serviceId: item.serviceId || null, // Keep reference but don't rely on it
          serviceName: serviceName, // Store actual name as snapshot
          description: item.serviceName || item.description || serviceName,
          quantity,
          unitPrice,
          total
        };
      }));

      const subtotal = processedItems.reduce((sum, item) => sum + item.total, 0);
      
      invoiceData.subtotal = subtotal;
      invoiceData.tax = invoiceData.tax || 0;
      invoiceData.total = subtotal + (invoiceData.tax || 0);

      return invoiceRepository.updateWithItems(id, invoiceData, processedItems);
    }

    return invoiceRepository.updateWithItems(id, invoiceData, []);
  }

  async createInvoiceFromAppointment(appointmentId, clinicId, tax = 0) {
    // Get appointment with related data
    const appointment = await appointmentRepository.findById(appointmentId, {
      include: [
        { association: 'patient' },
        { association: 'service' }
      ]
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.clinicId !== clinicId) {
      throw new Error('Unauthorized access to appointment');
    }

    // Check if invoice already exists for this appointment (will update if exists)
    const existingInvoice = await invoiceRepository.findOne({
      where: { appointmentId: appointmentId },
      include: [
        { association: 'items' }
      ]
    });

    // Get service details (snapshot at time of invoice creation)
    const service = appointment.service;
    if (!service) {
      throw new Error('Service not found for this appointment');
    }

    // Create invoice items with actual service details (snapshot)
    const items = [{
      serviceId: service.id, // Keep reference but don't rely on it
      serviceName: service.name, // Store actual name
      description: service.name,
      quantity: 1,
      unitPrice: parseFloat(service.price),
      total: parseFloat(service.price)
    }];

    const subtotal = parseFloat(service.price);
    const total = subtotal + (tax || 0);

    // If invoice exists, update it instead of creating new one
    if (existingInvoice) {
      const invoiceData = {
        subtotal,
        tax: tax || 0,
        total,
        // Don't change status if it's already sent/paid
        status: existingInvoice.status === 'draft' ? 'draft' : existingInvoice.status
      };

      return invoiceRepository.updateWithItems(existingInvoice.id, invoiceData, items);
    }

    // Generate invoice number for new invoice
    const invoiceNumber = await invoiceRepository.generateInvoiceNumber();

    // Create new invoice
    const invoiceData = {
      clinicId: appointment.clinicId,
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      invoiceNumber,
      subtotal,
      tax: tax || 0,
      total,
      status: 'draft'
    };

    return invoiceRepository.createWithItems(invoiceData, items);
  }

  async sendInvoice(id, clinicId, recipientEmail) {
    const invoice = await this.getInvoiceById(id, clinicId);
    
    if (!invoice.patient) {
      throw new Error('Patient information not found for invoice');
    }

    // Get clinic information
    const clinic = await Clinic.findByPk(clinicId);
    if (!clinic) {
      throw new Error('Clinic not found');
    }

    // Validate recipient email
    if (!recipientEmail) {
      // Use patient email if available, otherwise throw error
      if (!invoice.patient.email) {
        throw new Error('Recipient email is required. Patient email not found.');
      }
      recipientEmail = invoice.patient.email;
    }

    // Send email
    await emailService.sendInvoice(invoice, clinic, invoice.patient, recipientEmail);

    // Update invoice status to 'sent' if it's currently 'draft'
    if (invoice.status === 'draft') {
      await invoiceRepository.update(id, { status: 'sent' });
      return invoiceRepository.findById(id, {
        include: [
          { association: 'patient' },
          { association: 'appointment' },
          { association: 'items', include: [{ association: 'service' }] }
        ]
      });
    }

    return invoice;
  }

  async downloadInvoicePDF(id, clinicId) {
    const invoice = await this.getInvoiceById(id, clinicId);
    
    if (!invoice.patient) {
      throw new Error('Patient information not found for invoice');
    }

    // Get clinic information
    const clinic = await Clinic.findByPk(clinicId);
    if (!clinic) {
      throw new Error('Clinic not found');
    }

    // Generate PDF using EmailService
    const emailService = require('./EmailService');
    const pdfBuffer = await emailService.generateInvoicePDF(invoice, clinic, invoice.patient);

    return {
      buffer: pdfBuffer,
      filename: `Invoice-${invoice.invoiceNumber}-${new Date().toISOString().split('T')[0]}.pdf`
    };
  }
}

module.exports = new InvoiceService();

