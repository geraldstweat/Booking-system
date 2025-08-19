import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResource extends Document {
  name: string;
  type: "room" | "service";
  capacity?: number; // for rooms
  duration?: number; // for services (in minutes)
  slots: Date[]; // array of available slots
}

const ResourceSchema: Schema<IResource> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String, enum: ["room", "service"], required: true },

    // Room-specific
    capacity: { type: Number },

    // Service-specific
    duration: { type: Number }, // duration in minutes

    slots: [{ type: Date }],
  },
  { timestamps: true }
);

// Avoid recompilation error in Next.js hot reload
const Resource: Model<IResource> =
  mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);

export default Resource;