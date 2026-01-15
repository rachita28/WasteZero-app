import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null, // user who created the pickup
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    items: {
      type: String,
      required: true, // e.g. "Plastic, Metal"
    },
    additionalNotes: {
      type: String,
      default: "", // optional user note
    },
    assignedVolunteerId: {
      type: String,
      default: null, // volunteer ID
    },
    assignedVolunteerName: {
      type: String,
      default: "", // volunteer name
    },
    status: {
      type: String,
      enum: ["Scheduled", "Cancelled", "Completed"],
      default: "Scheduled",
    },
    completedAt: {
      type: Date,
      default: null,
    },
    wasteTypes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Pickup =
  mongoose.models.Pickup || mongoose.model("Pickup", pickupSchema);

export default Pickup;
