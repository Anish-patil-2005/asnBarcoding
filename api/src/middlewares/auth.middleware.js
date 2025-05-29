import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res
      .status(401)
      .json({ 
        message: 'Not authenticated' 
      });
    }

    const token = header.split(' ')[1];
    
    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(id).select('-passwordHash');
      next();
    } catch (err) {
      res
      .status(401)
      .json({ 
        message: 'Token invalid'
      });
    }
};

export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res
    .status(403)
    .json({ 
      message: 'Access forbidden' 
    });
  }
  next();
};