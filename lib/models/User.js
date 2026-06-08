import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'officer', 'distributor', 'viewer'],
      default: 'viewer',
    },
    department: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    permissions: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
