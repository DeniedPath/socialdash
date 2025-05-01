import mongoose, { Schema, models } from 'mongoose';

const userSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Check if the model already exists before creating a new one
// This prevents model redefinition errors when using Next.js hot reload
const User = models.User || mongoose.model('User', userSchema);

export default User;
