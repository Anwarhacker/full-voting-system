import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema(
  {
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voter",
      required: true,
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Vote || mongoose.model("Vote", VoteSchema);
