const serviceService = require('../services/ServiceService');

class ServiceController {
  async getServices(req, res, next) {
    try {
      const clinicId = req.user.clinicId || req.query.clinicId;
      if (!clinicId) {
        return res.status(400).json({ error: 'clinicId is required' });
      }
      const services = await serviceService.getServices(clinicId);
      res.json(services);
    } catch (error) {
      next(error);
    }
  }

  async createService(req, res, next) {
    try {
      const service = await serviceService.createService(req.body);
      res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }

  async updateService(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      const service = await serviceService.updateService(id, req.body, clinicId);
      res.json(service);
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      await serviceService.deleteService(id, clinicId);
      res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ServiceController();

