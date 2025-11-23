const serviceRepository = require('../repositories/ServiceRepository');

class ServiceService {
  async getServices(clinicId) {
    return serviceRepository.findByClinicId(clinicId, {
      order: [['name', 'ASC']]
    });
  }

  async getServiceById(id, clinicId) {
    const service = await serviceRepository.findById(id);
    if (!service) {
      throw new Error('Service not found');
    }
    if (service.clinicId !== clinicId) {
      throw new Error('Unauthorized access to service');
    }
    return service;
  }

  async createService(data) {
    return serviceRepository.create(data);
  }

  async updateService(id, data, clinicId) {
    const service = await this.getServiceById(id, clinicId);
    return serviceRepository.update(id, data);
  }

  async deleteService(id, clinicId) {
    const service = await this.getServiceById(id, clinicId);
    return serviceRepository.delete(id);
  }
}

module.exports = new ServiceService();

