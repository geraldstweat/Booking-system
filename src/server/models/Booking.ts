import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  resource: mongoose.Types.ObjectId; // Reference to Resource
  user: mongoose.Types.ObjectId; // Reference to User
  start_time: Date;
  end_time: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;