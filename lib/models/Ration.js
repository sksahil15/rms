import mongoose from 'mongoose';

const rationSchema = new mongoose.Schema(
  {
    rationId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    family: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Family',
      required: true,
    },
    month: {
      type: String,
      required: true,
      enum: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    },
    year: {
      type: Number,
      required: true,
    },
    
    totalCost: {
      type: Number,
      required: true,
    },
    distributionDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'distributed', 'cancelled'],
      default: 'pending',
    },
    distributedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.Ration || mongoose.model('Ration', rationSchema);
