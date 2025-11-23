class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return this.model.findAll(options);
  }

  async findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  async findOne(options = {}) {
    return this.model.findOne(options);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    const instance = await this.findById(id);
    if (!instance) {
      throw new Error(`${this.model.name} not found`);
    }
    await instance.update(data);
    return instance.reload();
  }

  async delete(id) {
    const instance = await this.findById(id);
    if (!instance) {
      throw new Error(`${this.model.name} not found`);
    }
    await instance.destroy();
    return true;
  }

  async count(options = {}) {
    return this.model.count(options);
  }
}

module.exports = BaseRepository;

