const { auth } = require('express-oauth2-jwt-bearer');
const userModel = require('../models/user.model');

const validateToken = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

/**
 * @description Middleware to verify Auth0 JWT and sync the user with our database
 */
const auth0Middleware = (req, res, next) => {
  validateToken(req, res, async (err) => {
    if (err) {
      console.error('Auth0 middleware error:', err);
      return res.status(401).json({ message: 'Unauthorized', error: err.message });
    }

    try {
      const auth0Id = req.auth.payload.sub;
      // Sync user with local database
      let user = await userModel.findOne({ auth0Id });
      if (!user) {
        // If user doesn't exist, create one using claims from the token
        // Use fallbacks for required fields
        const email = req.auth.payload.email || `${auth0Id}@auth0.com`;
        const username = req.auth.payload.nickname || req.auth.payload.name || auth0Id;

        user = await userModel.create({
          auth0Id,
          username,
          email
        });
      }

      // Attach the local user's ObjectId to req.user.id for compatibility
      req.user = {
        id: user._id
      };
      
      next();
    } catch (dbError) {
      console.error('Database error in auth0 middleware:', dbError);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
};

module.exports = { auth0Middleware };
