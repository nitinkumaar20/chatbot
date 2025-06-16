import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  text: String,
  sender: { type: String, enum: ['user', 'ai'] },
  createdAt: { type: Date, default: Date.now }
});

export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
