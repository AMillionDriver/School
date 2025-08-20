const config = {
  // Database configuration
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/aihs',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development'
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: '1d'
  },

  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://aihs.id' 
      : 'http://localhost:5000',
    credentials: true
  }
};

module.exports = config;
