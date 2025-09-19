import mongoose from "mongoose";

const VoterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "voter"],
      default: "voter",
    },
    hasVoted: {
      type: Map,
      of: Boolean,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Voter || mongoose.model("Voter", VoterSchema);
