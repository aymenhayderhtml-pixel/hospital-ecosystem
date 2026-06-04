const appointmentService = require('../services/appointmentService');

const appointmentController = {
  async getAll(req, res, next) {
    try {
      const appointments = await appointmentService.getAll(req.query);
      res.status(200).json({ success: true, data: appointments });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const appointment = await appointmentService.create(req.body);
      res.status(201).json({ success: true, data: appointment });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = appointmentController;
