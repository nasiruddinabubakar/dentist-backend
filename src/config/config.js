require('dotenv').config();

function getConfig(env) {
  if (process.env.DATABASE_URL) {
    // Use DATABASE_URL directly
    return {
      url: process.env.DATABASE_URL,
      dialect: 'mysql',
      logging: env === 'development' ? console.log : false
    };
  } else {
    // Fall back to individual environment variables
    return {
      username: process.env.DB_USER || (env === 'production' ? undefined : 'root'),
      password: process.env.DB_PASSWORD || (env === 'production' ? undefined : ''),
      database: env === 'test' 
        ? (process.env.DB_NAME ? process.env.DB_NAME + '_test' : 'dentist_db_test')
        : (process.env.DB_NAME || 'dentist_db'),
      host: process.env.DB_HOST || (env === 'production' ? undefined : 'localhost'),
      port: parseInt(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: env === 'development' ? console.log : false
    };
  }
}

module.exports = {
  development: getConfig('development'),
  test: getConfig('test'),
  production: getConfig('production')
};

