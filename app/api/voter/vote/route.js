import connectToDatabase from "@/lib/mongodb";
import Vote from "@/models/Vote";
import Voter from "@/models/Voter";
import Election from "@/models/Election";
import { getUserFromToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = getUserFromToken(request);
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();
    const { electionId, candidateId } = await request.json();

    const voter = await Voter.findById(user.id);
    if (voter.hasVoted.get(electionId)) {
      return new Response(
        JSON.stringify({ error: "You have already voted in this election" }),
        { status: 400 }
      );
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return new Response(JSON.stringify({ error: "Election not found" }), {
        status: 404,
      });
    }

    const now = new Date();
    if (now < election.startTime || now > election.endTime) {
      return new Response(JSON.stringify({ error: "Election is not active" }), {
        status: 400,
      });
    }

    const vote = new Vote({
      voterId: user.id,
      electionId,
      candidateId,
    });
    await vote.save();

    voter.hasVoted.set(electionId, true);
    await voter.save();

    return new Response(
      JSON.stringify({ message: "Vote submitted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
