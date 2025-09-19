import connectToDatabase from "@/lib/mongodb";
import Voter from "@/models/Voter";
import bcrypt from "bcryptjs";
import { getUserFromToken } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();
    const voters = await Voter.find({});
    return new Response(JSON.stringify(voters), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromToken(request);
    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await connectToDatabase();
    const { name, email, password, role } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    const voter = new Voter({
      name,
      email,
      passwordHash: hashedPassword,
      role: role || "voter",
    });
    await voter.save();
    return new Response(JSON.stringify(voter), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
