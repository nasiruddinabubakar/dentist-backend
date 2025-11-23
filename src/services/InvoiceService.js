const invoiceRepository = require('../repositories/InvoiceRepository');
const appointmentRepository = require('../repositories/AppointmentRepository');
const { Service } = require('../models');

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
      const processedItems = items.map(item => {
        const quantity = item.quantity || 1;
        const unitPrice = parseFloat(item.unitPrice);
        const total = quantity * unitPrice;
        return {
          ...item,
          quantity,
          unitPrice,
          total
        };
      });

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
      const processedItems = items.map(item => {
        const quantity = item.quantity || 1;
        const unitPrice = parseFloat(item.unitPrice);
        const total = quantity * unitPrice;
        return {
          ...item,
          quantity,
          unitPrice,
          total
        };
      });

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

    if (appointment.status !== 'completed') {
      throw new Error('Invoice can only be generated for completed appointments');
    }

    // Check if invoice already exists for this appointment
    const existingInvoice = await invoiceRepository.findOne({
      where: { appointmentId: appointmentId }
    });

    if (existingInvoice) {
      throw new Error('Invoice already exists for this appointment');
    }

    // Get service details
    const service = appointment.service;
    if (!service) {
      throw new Error('Service not found for this appointment');
    }

    // Create invoice items from appointment service
    const items = [{
      serviceId: service.id,
      description: service.name,
      quantity: 1,
      unitPrice: parseFloat(service.price),
      total: parseFloat(service.price)
    }];

    const subtotal = parseFloat(service.price);
    const total = subtotal + (tax || 0);

    // Generate invoice number
    const invoiceNumber = await invoiceRepository.generateInvoiceNumber();

    // Create invoice
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
}

module.exports = new InvoiceService();

