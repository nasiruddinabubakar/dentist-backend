# Dentist System Backend

Backend API for the dentist management system built with Node.js, Express, MySQL, and Sequelize.

## Features

- RESTful API with domain entity repository pattern
- JWT-based authentication
- MySQL database with Sequelize ORM
- CORS enabled for all origins
- Structured architecture: Models, Repositories, Services, Controllers, Routes, Middlewares

## Project Structure

```
dentist-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Sequelize database configuration
│   │   └── config.js             # Sequelize CLI configuration
│   ├── migrations/              # Database migration files
│   ├── models/                  # Sequelize models
│   │   ├── User.js
│   │   ├── Clinic.js
│   │   ├── Patient.js
│   │   ├── Service.js
│   │   ├── Appointment.js
│   │   ├── Invoice.js
│   │   ├── InvoiceItem.js
│   │   └── index.js             # Model associations
│   ├── repositories/            # Data access layer
│   │   ├── BaseRepository.js
│   │   ├── UserRepository.js
│   │   ├── ClinicRepository.js
│   │   ├── PatientRepository.js
│   │   ├── ServiceRepository.js
│   │   ├── AppointmentRepository.js
│   │   └── InvoiceRepository.js
│   ├── services/                # Business logic layer
│   │   ├── AuthService.js
│   │   ├── PatientService.js
│   │   ├── ServiceService.js
│   │   ├── AppointmentService.js
│   │   └── InvoiceService.js
│   ├── controllers/             # Request handlers
│   │   ├── AuthController.js
│   │   ├── PatientController.js
│   │   ├── ServiceController.js
│   │   ├── AppointmentController.js
│   │   └── InvoiceController.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── services.js
│   │   ├── appointments.js
│   │   ├── invoices.js
│   │   └── index.js
│   ├── middlewares/             # Express middlewares
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Error handling
│   │   └── notFound.js          # 404 handler
│   └── server.js                # Main server file
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dentist_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key-change-this-in-production
```

4. Create the MySQL database:
```sql
CREATE DATABASE dentist_db;
```

5. Run the migrations to create tables:
```bash
npm run migrate
```

**Migration Commands:**
- `npm run migrate` - Run all pending migrations
- `npm run migrate:undo` - Undo the last migration
- `npm run migrate:undo:all` - Undo all migrations
- `npm run migrate:status` - Check migration status

## Running the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 3001 (or the port specified in `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new clinic and user
- `POST /api/auth/login` - Login and get JWT token

### Patients
- `GET /api/patients?clinicId={id}` - Get all patients for a clinic
- `POST /api/patients` - Create a new patient (requires auth)
- `PUT /api/patients/:id` - Update a patient (requires auth)
- `DELETE /api/patients/:id` - Delete a patient (requires auth)

### Services
- `GET /api/services?clinicId={id}` - Get all services for a clinic
- `POST /api/services` - Create a new service (requires auth)
- `PUT /api/services/:id` - Update a service (requires auth)
- `DELETE /api/services/:id` - Delete a service (requires auth)

### Appointments
- `GET /api/appointments?clinicId={id}` - Get all appointments for a clinic
- `POST /api/appointments` - Create a new appointment (requires auth)
- `PUT /api/appointments/:id` - Update an appointment (requires auth)
- `DELETE /api/appointments/:id` - Delete an appointment (requires auth)

### Invoices
- `GET /api/invoices?clinicId={id}` - Get all invoices for a clinic
- `POST /api/invoices` - Create a new invoice (requires auth)
- `PUT /api/invoices/:id` - Update an invoice (requires auth)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Database Models

- **User**: Clinic users with email, password, name, role
- **Clinic**: Clinic information (name, address, phone, email, licenseNumber)
- **Patient**: Patient records linked to clinics
- **Service**: Services offered by clinics
- **Appointment**: Appointments linking patients and services
- **Invoice**: Invoices for appointments/patients
- **InvoiceItem**: Line items in invoices

## Database Migrations

This project uses Sequelize migrations for database schema management. Migrations are version-controlled and allow for:
- Safe schema evolution
- Rollback capabilities
- Team collaboration
- Production-ready deployments

Migrations are located in `src/migrations/` and are executed in order based on their timestamps.

## Architecture

This backend follows the **Domain Entity Repository Pattern**:

1. **Models**: Sequelize ORM models defining database schema
2. **Migrations**: Database schema version control
3. **Repositories**: Data access layer abstracting database operations
4. **Services**: Business logic layer handling domain operations
5. **Controllers**: Request/response handling
6. **Routes**: API endpoint definitions
7. **Middlewares**: Cross-cutting concerns (auth, error handling, CORS)

## CORS

CORS is enabled for all origins (`*`) as requested. In production, you may want to restrict this to specific domains.

## License

ISC

