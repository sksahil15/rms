const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_distribution';

const familySchema = new mongoose.Schema({
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

const Family = mongoose.model('Family', familySchema);

const seedData = [
  {
    familyId: 100001,
    headName: "Rahul Das",
    phone: "9800000001",
    category: "AAY",
    memberCount: 3,
    members: [
      { name: "Rahul Das", cardNumber: "WB-001" },
      { name: "Priya Das", cardNumber: "WB-002" },
      { name: "Raju Das", cardNumber: "WB-003" },
    ],
    status: "active",
    lifted: true,
    notes: "",
  },
  {
    familyId: 100002,
    headName: "Sufia Khatun",
    phone: "9800000002",
    category: "PHH",
    memberCount: 2,
    members: [
      { name: "Sufia Khatun", cardNumber: "WB-004" },
      { name: "Karim SK", cardNumber: "WB-005" },
    ],
    status: "pending",
    lifted: null,
    notes: "",
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Family.deleteMany({}); // আগেরটা clear করবে
  await Family.insertMany(seedData);
  console.log('Seed complete!');
  await mongoose.disconnect();
}

seed().catch(console.error);