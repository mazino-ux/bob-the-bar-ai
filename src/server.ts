import mongoose from 'mongoose';
import app from './app';
import connectDB from './config/db';
import { config } from './config/env';
import { logger } from './utils/logger';

const PORT = config.PORT;

// Graceful shutdown handler
const shutdown = async (signal: string) => {
  logger.warn(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  try {
    await mongoose.connection.close();
    logger.info('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Start server with improved console output
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      const lines = [
        '─────────────────────────────────────────────',
        `🚀 ${config.APP_NAME} is running!`,
        '',
        `🌍 Environment : ${config.NODE_ENV}`,
        `📡 API        : http://localhost:${PORT}`,
        '─────────────────────────────────────────────'
      ];
      // Print startup banner directly to console for better readability
      // eslint-disable-next-line no-console
      console.log('\n' + lines.join('\n'));
      logger.info(`${config.APP_NAME} started on port ${PORT} (${config.NODE_ENV})`);
    });

    // Server error handling
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`❌ Port ${PORT} is already in use`);
      } else {
        logger.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();