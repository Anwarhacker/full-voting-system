import connectToDatabase from "./lib/mongodb.js";
import Election from "./models/Election.js";
import Candidate from "./models/Candidate.js";
import Voter from "./models/Voter.js";
import bcrypt from "bcryptjs";

async function seedTestData() {
  try {
    await connectToDatabase();

    // Create a test election
    const election = new Election({
      title: "Student Council Election 2025",
      description: "Vote for your student representatives",
      startTime: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours from now
    });
    await election.save();
    console.log("Election created:", election._id);

    // Create candidates
    const candidates = [
      {
        electionId: election._id,
        name: "Alice Johnson",
        photo: "https://via.placeholder.com/150?text=Alice",
        party: "Unity Party",
      },
      {
        electionId: election._id,
        name: "Bob Smith",
        photo: "https://via.placeholder.com/150?text=Bob",
        party: "Progress Party",
      },
      {
        electionId: election._id,
        name: "Charlie Brown",
        photo: "https://via.placeholder.com/150?text=Charlie",
        party: "Innovation Party",
      },
    ];

    for (const candidateData of candidates) {
      const candidate = new Candidate(candidateData);
      await candidate.save();
      console.log("Candidate created:", candidate.name);
    }

    // Create a test voter
    const hashedPassword = await bcrypt.hash("voter123", 10);
    const voter = new Voter({
      name: "Test Voter",
      email: "voter@example.com",
      passwordHash: hashedPassword,
      role: "voter",
      hasVoted: {},
    });
    await voter.save();
    console.log("Voter created:", voter.email);

    console.log("\n=== TEST DATA CREATED ===");
    console.log("Election ID:", election._id);
    console.log("Voter Email: voter@example.com");
    console.log("Voter Password: voter123");
    console.log("Admin Email: admin@example.com");
    console.log("Admin Password: admin123");
  } catch (error) {
    console.error("Error seeding test data:", error);
  } finally {
    process.exit();
  }
}

seedTestData();
