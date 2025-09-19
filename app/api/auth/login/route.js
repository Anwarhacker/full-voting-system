import connectToDatabase from "@/lib/mongodb";
import Voter from "@/models/Voter";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectToDatabase();

    const { email, password } = await request.json();

    const voter = await Voter.findOne({ email });
    if (!voter) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, voter.passwordHash);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });
    }

    const token = jwt.sign(
      { id: voter._id, role: voter.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return new Response(JSON.stringify({ token, role: voter.role }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
