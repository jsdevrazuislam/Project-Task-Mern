import { Schema, model, Document, ObjectId } from "mongoose";

export interface IEvent extends Document {
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  attendeeCount: number;
  createdBy: ObjectId;
  joinedUsers: ObjectId[];
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    attendeeCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    joinedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export const Event = model<IEvent>("Event", EventSchema);
