import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * That long string for database access
   */
  databaseURL: process.env.DATABASE_URL,

  /**
   * If the database requires SSL Connection
   */
  databaseSSL: process.env.DATABASE_SSL,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/',
  },
  /**
   * Mailgun email credentials
   */
  emails: {
    apiKey: 'API key from mailgun',
    domain: 'Domain Name from mailgun',
  },
};
