require('dotenv').config();
const app = require('./src/app');
const { supabase } = require('./src/config/supabase');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║  Hospital Management System API          ║
  ║  Server running on port ${PORT}              ║
  ║  Environment: ${process.env.NODE_ENV || 'development'}              ║
  ║  Health Check: http://localhost:${PORT}/api/health ║
  ╚══════════════════════════════════════════╝
  `);
});

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Server shutting down...', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Server shutting down...', err);
  server.close(() => process.exit(1));
});

// Force restart nodemon
