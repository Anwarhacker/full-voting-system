import connectToDatabase from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import { getUserFromToken } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();
    const { id } = await params;
    const { electionId, name, photo, party } = await request.json();
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      { electionId, name, photo, party },
      { new: true }
    );
    if (!candidate) {
      return new Response(JSON.stringify({ error: "Candidate not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(candidate), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();
    const { id } = await params;
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) {
      return new Response(JSON.stringify({ error: "Candidate not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ message: "Candidate deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
