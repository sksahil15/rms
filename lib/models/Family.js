import mongoose from "mongoose";

const familySchema = new mongoose.Schema(
  {
    familyId: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    headName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["AAY", "PHH", "SPHH", "RKSY I", "RKSY II"],
      required: true,
    },
    memberCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    members: [
      {
        name: String,
        cardNumber: Number,
        age: Number,
        cnic: String,
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "pending", "suspended", "complete"], // ← complete যোগ
      default: "pending",
    },
    lifted: {
      type: Boolean,
      default: null, // null = not selected yet
    },
    notes: String,
  },
  { timestamps: true },
);

export default mongoose.models.Family || mongoose.model("Family", familySchema);
