const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/UserRepository');
const clinicRepository = require('../repositories/ClinicRepository');

class AuthService {
  generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, clinicId: user.clinicId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  async register(data) {
    const { email, password, name, clinicName, address, phone, licenseNumber } = data;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create clinic first
    const clinic = await clinicRepository.create({
      name: clinicName,
      address,
      phone,
      email,
      licenseNumber
    });

    // Create user
    const user = await userRepository.create({
      email,
      password,
      name,
      role: 'clinic',
      clinicId: clinic.id
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      clinic: {
        id: clinic.id,
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
        email: clinic.email
      },
      token
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const clinic = await clinicRepository.findById(user.clinicId);
    if (!clinic) {
      throw new Error('Clinic not found');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      clinic: {
        id: clinic.id,
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
        email: clinic.email
      },
      token
    };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = new AuthService();

