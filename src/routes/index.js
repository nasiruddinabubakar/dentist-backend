const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const patientRoutes = require('./patients');
const serviceRoutes = require('./services');
const appointmentRoutes = require('./appointments');
const invoiceRoutes = require('./invoices');
const doctorRoutes = require('./doctors');
const surgeryRoomRoutes = require('./surgery-rooms');

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/services', serviceRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/doctors', doctorRoutes);
router.use('/surgery-rooms', surgeryRoomRoutes);

module.exports = router;

