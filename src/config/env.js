const requiredInProduction = [
  'JWT_ACCESS_SECRET',
  'CORS_ORIGIN',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

const validateEnvironment = () => {
  if (process.env.NODE_ENV !== 'production') return;

  const missing = requiredInProduction.filter((key) => !process.env[key]);
  const hasDatabaseConfig = process.env.DATABASE_URL
    || (process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST);

  if (!hasDatabaseConfig) missing.push('DATABASE_URL or DB_NAME, DB_USER, DB_PASSWORD, DB_HOST');
  if (missing.length) throw new Error('Missing required production environment variables: ' + missing.join(', '));
};

module.exports = { validateEnvironment };
