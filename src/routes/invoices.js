const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/InvoiceController');
const { authenticate } = require('../middlewares/auth');

router.get('/', authenticate, invoiceController.getInvoices);
router.post('/', authenticate, invoiceController.createInvoice);
router.post('/from-appointment/:appointmentId', authenticate, invoiceController.createFromAppointment);
router.put('/:id', authenticate, invoiceController.updateInvoice);
router.post('/:id/send', authenticate, invoiceController.sendInvoice);

module.exports = router;

