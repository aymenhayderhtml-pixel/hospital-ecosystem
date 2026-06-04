const Patient = require('../models/Patient');

const patientService = {
  async getAll(filters) {
    return await Patient.findAll(filters);
  },

  async getById(id) {
    const patient = await Patient.findById(id);
    if (!patient) {
      const err = new Error('Patient not found.');
      err.statusCode = 404;
      throw err;
    }
    return patient;
  },

  async create(data) {
    return await Patient.create(data);
  },

  async update(id, data) {
    return await Patient.update(id, data);
  },

  async delete(id) {
    return await Patient.delete(id);
  },
};

module.exports = patientService;
