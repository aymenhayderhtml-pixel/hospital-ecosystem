const authService = require('../services/authService');

const authController = {
  async register(req, res, next) {
    try {
      const { email, password, name, role } = req.body;
      const result = await authService.register({ email, password, name, role });
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
