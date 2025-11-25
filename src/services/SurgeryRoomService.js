const surgeryRoomRepository = require('../repositories/SurgeryRoomRepository');

class SurgeryRoomService {
  async getSurgeryRooms(clinicId) {
    return surgeryRoomRepository.findByClinicId(clinicId, {
      order: [['createdAt', 'DESC']]
    });
  }

  async getSurgeryRoomById(id, clinicId) {
    const room = await surgeryRoomRepository.findById(id);
    if (!room) {
      throw new Error('Surgery room not found');
    }
    if (room.clinicId !== clinicId) {
      throw new Error('Unauthorized access to surgery room');
    }
    return room;
  }

  async createSurgeryRoom(data) {
    return surgeryRoomRepository.create(data);
  }

  async updateSurgeryRoom(id, data, clinicId) {
    const room = await this.getSurgeryRoomById(id, clinicId);
    return surgeryRoomRepository.update(id, data);
  }

  async deleteSurgeryRoom(id, clinicId) {
    const room = await this.getSurgeryRoomById(id, clinicId);
    return surgeryRoomRepository.delete(id);
  }
}

module.exports = new SurgeryRoomService();

