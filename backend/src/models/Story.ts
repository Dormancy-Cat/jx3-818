import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
  characterId: string;
  characterUid: string;
  server: string;
  school: string;
  title: string;
  summary: string;
  timeline: string;
  createdAt: Date;
}

const StorySchema: Schema = new Schema({
  characterId: { type: String, required: true },
  characterUid: { type: String, required: false },
  server: { type: String, required: true },
  school: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  timeline: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IStory>('Story', StorySchema); 