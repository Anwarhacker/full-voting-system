import connectToDatabase from "@/lib/mongodb";
import Election from "@/models/Election";
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
    const { title, description, startTime, endTime } = await request.json();
    const election = await Election.findByIdAndUpdate(
      id,
      { title, description, startTime, endTime },
      { new: true }
    );
    if (!election) {
      return new Response(JSON.stringify({ error: "Election not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(election), { status: 200 });
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
    const election = await Election.findByIdAndDelete(id);
    if (!election) {
      return new Response(JSON.stringify({ error: "Election not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ message: "Election deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
