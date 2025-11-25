const surgeryRoomService = require('../services/SurgeryRoomService');

class SurgeryRoomController {
  async getSurgeryRooms(req, res, next) {
    try {
      const clinicId = req.user.clinicId || req.query.clinicId;
      if (!clinicId) {
        return res.status(400).json({ error: 'clinicId is required' });
      }
      const rooms = await surgeryRoomService.getSurgeryRooms(clinicId);
      res.json(rooms);
    } catch (error) {
      next(error);
    }
  }

  async createSurgeryRoom(req, res, next) {
    try {
      const room = await surgeryRoomService.createSurgeryRoom(req.body);
      res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  }

  async updateSurgeryRoom(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      const room = await surgeryRoomService.updateSurgeryRoom(id, req.body, clinicId);
      res.json(room);
    } catch (error) {
      next(error);
    }
  }

  async deleteSurgeryRoom(req, res, next) {
    try {
      const { id } = req.params;
      const clinicId = req.user.clinicId;
      await surgeryRoomService.deleteSurgeryRoom(id, clinicId);
      res.json({ message: 'Surgery room deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SurgeryRoomController();

