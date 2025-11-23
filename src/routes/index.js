const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const patientRoutes = require('./patients');
const serviceRoutes = require('./services');
const appointmentRoutes = require('./appointments');
const invoiceRoutes = require('./invoices');

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/invoices', invoiceRoutes);

module.exports = router;

