const BaseRepository = require('./BaseRepository');
const { Invoice, InvoiceItem } = require('../models');

class InvoiceRepository extends BaseRepository {
  constructor() {
    super(Invoice);
  }

  async findByClinicId(clinicId, options = {}) {
    return this.findAll({
      ...options,
      where: { ...options.where, clinicId },
      include: options.include || [
        { association: 'patient' },
        { association: 'appointment' },
        { association: 'items', include: [{ association: 'service' }] }
      ]
    });
  }

  async findByPatientId(patientId, options = {}) {
    return this.findAll({
      ...options,
      where: { ...options.where, patientId }
    });
  }

  async createWithItems(invoiceData, items = []) {
    const invoice = await this.create(invoiceData);
    if (items.length > 0) {
      const invoiceItems = items.map(item => ({
        ...item,
        invoiceId: invoice.id
      }));
      await InvoiceItem.bulkCreate(invoiceItems);
    }
    return this.findById(invoice.id, {
      include: [
        { association: 'patient' },
        { association: 'appointment' },
        { association: 'items', include: [{ association: 'service' }] }
      ]
    });
  }

  async updateWithItems(id, invoiceData, items = []) {
    const invoice = await this.update(id, invoiceData);
    if (items.length > 0) {
      // Delete existing items
      await InvoiceItem.destroy({ where: { invoiceId: id } });
      // Create new items
      const invoiceItems = items.map(item => ({
        ...item,
        invoiceId: id
      }));
      await InvoiceItem.bulkCreate(invoiceItems);
    }
    return this.findById(id, {
      include: [
        { association: 'patient' },
        { association: 'appointment' },
        { association: 'items', include: [{ association: 'service' }] }
      ]
    });
  }

  async generateInvoiceNumber() {
    const count = await this.count();
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${timestamp}-${String(count + 1).padStart(4, '0')}`;
  }
}

module.exports = new InvoiceRepository();

