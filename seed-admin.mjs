import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import connectToDatabase from "./lib/mongodb.js";
import Voter from "./models/Voter.js";
import bcrypt from "bcryptjs";
import Voter from "./models/Voter.js";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  try {
    await connectToDatabase();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const existingAdmin = await Voter.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new Voter({
      name: "Admin User",
      email: adminEmail,
      passwordHash: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    process.exit();
  }
}

seedAdmin();
