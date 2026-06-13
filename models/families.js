import mongoose from "mongoose";
const familiesSchema = new mongoose.Schema({
  familyId: Number,
  headName: String,
  phone: String,
  category: String,
  memberCount: Number,
  members: [
    {
      name: String,
      cardNumber: String,
    }
  ],
  status: String,
  lifted: mongoose.Schema.Types.Mixed,
  notes: String,
}, { timestamps: true });

export default mongoose.models.Family || mongoose.model("Family", familiesSchema);