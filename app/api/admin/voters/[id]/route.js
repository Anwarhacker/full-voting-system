import connectToDatabase from "@/lib/mongodb";
import Voter from "@/models/Voter";
import bcrypt from "bcryptjs";
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
    const { name, email, password, role } = await request.json();
    const updateData = { name, email, role };
    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }
    const voter = await Voter.findByIdAndUpdate(id, updateData, { new: true });
    if (!voter) {
      return new Response(JSON.stringify({ error: "Voter not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(voter), { status: 200 });
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
    const voter = await Voter.findByIdAndDelete(id);
    if (!voter) {
      return new Response(JSON.stringify({ error: "Voter not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ message: "Voter deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
