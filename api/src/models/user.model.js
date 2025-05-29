import mongoose from 'mongoose';
import { ROLES } from '../constants.js';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ROLES, 
    required: true 
  },
  email: {
    type: String,
    required:  true,
    unique: true
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
