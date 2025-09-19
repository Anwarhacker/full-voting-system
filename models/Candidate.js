import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema(
  {
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String, // URL or path to photo
      required: true,
    },
    party: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Candidate ||
  mongoose.model("Candidate", CandidateSchema);
