const BaseRepository = require('./BaseRepository');
const { SurgeryRoom } = require('../models');

class SurgeryRoomRepository extends BaseRepository {
  constructor() {
    super(SurgeryRoom);
  }

  async findByClinicId(clinicId, options = {}) {
    return this.findAll({
      ...options,
      where: { ...options.where, clinicId }
    });
  }
}

module.exports = new SurgeryRoomRepository();

