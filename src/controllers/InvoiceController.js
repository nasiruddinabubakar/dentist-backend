const invoiceService = require('../services/InvoiceService');

class InvoiceController {
  async getInvoices(req, res, next) {
    try {
      const clinicId = req.user.clinicId || req.query.clinicId;
      if (!clinicId) {
        return res.status(400).json({ error: 'clinicId is required' });
      }
      const invoices = await invoiceService.getInvoices(clinicId);
      res.json(invoices);
    } catch (error) {
      next(error);
    }
  }

  async createInvoice(req, res, next) {
    try {
      const invoice = await invoiceService.createInvoice(req.body);
      res.status(201).json(invoice);
    } catch (error) {
      next(error);
    }
  }

  async updateInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      const invoice = await invoiceService.updateInvoice(id, req.body, clinicId);
      res.json(invoice);
    } catch (error) {
      next(error);
    }
  }

  async createFromAppointment(req, res, next) {
    try {
      const { appointmentId } = req.params;
      const { tax } = req.body;
      const clinicId = req.user.clinicId;
      const invoice = await invoiceService.createInvoiceFromAppointment(
        appointmentId,
        clinicId,
        tax || 0
      );
      res.status(201).json(invoice);
    } catch (error) {
      next(error);
    }
  }

  async sendInvoice(req, res, next) {
    try {
      const { id } = req.params;
      const { email } = req.body;
      const clinicId = req.user.clinicId;
      const invoice = await invoiceService.sendInvoice(id, clinicId, email);
      res.json({ 
        message: 'Invoice sent successfully',
        invoice 
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InvoiceController();

