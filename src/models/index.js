const User = require('./User');
const Clinic = require('./Clinic');
const Patient = require('./Patient');
const Service = require('./Service');
const Appointment = require('./Appointment');
const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');

// Define associations
User.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });
Clinic.hasMany(User, { foreignKey: 'clinicId', as: 'users' });

Clinic.hasMany(Patient, { foreignKey: 'clinicId', as: 'patients' });
Patient.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });

Clinic.hasMany(Service, { foreignKey: 'clinicId', as: 'services' });
Service.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });

Clinic.hasMany(Appointment, { foreignKey: 'clinicId', as: 'appointments' });
Appointment.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });

Patient.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

Service.hasMany(Appointment, { foreignKey: 'serviceId', as: 'appointments' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

Clinic.hasMany(Invoice, { foreignKey: 'clinicId', as: 'invoices' });
Invoice.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });

Patient.hasMany(Invoice, { foreignKey: 'patientId', as: 'invoices' });
Invoice.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

Appointment.hasOne(Invoice, { foreignKey: 'appointmentId', as: 'invoice' });
Invoice.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

Service.hasMany(InvoiceItem, { foreignKey: 'serviceId', as: 'invoiceItems' });
InvoiceItem.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

module.exports = {
  User,
  Clinic,
  Patient,
  Service,
  Appointment,
  Invoice,
  InvoiceItem
};

