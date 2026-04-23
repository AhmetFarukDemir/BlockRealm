import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  gold: { type: Number, default: 100 },
  hp: { type: Number, default: 100 },
  xp: { type: Number, default: 0 },
  inventory: [
    {
      itemId: { type: Number, required: true },
      quantity: { type: Number, default: 1, required: true }
    }
  ]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
