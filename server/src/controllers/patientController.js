const patientService = require('../services/patientService');

const patientController = {
  async getAll(req, res, next) {
    try {
      const filters = { doctor_id: req.query.doctor_id, status: req.query.status };
      const patients = await patientService.getAll(filters);
      res.status(200).json({ success: true, data: patients });
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const patient = await patientService.getById(req.params.id);
      res.status(200).json({ success: true, data: patient });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const patient = await patientService.create(req.body);
      res.status(201).json({ success: true, data: patient });
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const patient = await patientService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: patient });
    } catch (err) {
      next(err);
    }
  },

  async delete(req, res, next) {
    try {
      await patientService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Patient deleted.' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = patientController;
