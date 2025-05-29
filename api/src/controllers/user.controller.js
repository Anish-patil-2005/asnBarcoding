import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ROLES } from '../constants.js';
import User from '../models/user.model.js';

export const register = async (req, res, next) => {
  try {
    const { username, password, role, email } = req.body;

    const user = await User.findOne({username});
    
    if(user){
      return res
      .status(401)
      .json({ 
        message: 'Already Exist' 
      });
    }

    if (!Object.values(ROLES).includes(role)) {
      return res
      .status(400)
      .json({
        message: 'Invalid role' 
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, passwordHash, role, email });
    
    res
    .status(201)
    .json({ 
      userId: newUser._id 
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res
    .status(401)
      .json({ 
      message: 'Invalid credentials' 
    });
    const valid = await bcrypt.compare(password, user.passwordHash);
    
    if (!valid) return res
    .status(401)
      .json({ 
      message: 'Invalid credentials' 
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    res
    .json({ 
      token, 
      role: user.role 
    });
  } catch (err) {
    next(err);
  }
};