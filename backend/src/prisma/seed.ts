import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding database...");

  // Clean the database 
  await prisma.booking.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.offering.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.teacher.deleteMany({});
  await prisma.parent.deleteMany({});

  // 1. Create Courses
  const mathCourse = await prisma.course.create({
    data: {
      title: "Advanced Mathematics",
      description: "Linear Algebra, Calculus, and Statistics for Engineering Students",
    },
  });

  const physicsCourse = await prisma.course.create({
    data: {
      title: "Quantum Physics Introduction",
      description: "Basics of wave-particle duality, Schrodinger equation, and quantum states",
    },
  });

  console.log("Seeded Courses:", { mathCourse, physicsCourse });

  // 2. Create Teachers with different timezones
  const teacherA = await prisma.teacher.create({
    data: {
      name: "Prof. Alan Turing",
      email: "alan.turing@school.com",
      timezone: "America/New_York", // EST/EDT
    },
  });

  const teacherB = await prisma.teacher.create({
    data: {
      name: "Prof. Richard Feynman",
      email: "richard.feynman@school.com",
      timezone: "Asia/Kolkata", // IST
    },
  });

  console.log("Seeded Teachers:", { teacherA, teacherB });

  const parentA = await prisma.parent.create({
    data: {
      name: "John Doe (Parent)",
      email: "john.doe@family.com",
      timezone: "Europe/London", // GMT/BST
    },
  });

  const parentB = await prisma.parent.create({
    data: {
      name: "Jane Smith (Parent)",
      email: "jane.smith@family.com",
      timezone: "Asia/Kolkata", // IST
    },
  });

  console.log("Seeded Parents:", { parentA, parentB });

  const mathOffering = await prisma.offering.create({
    data: {
      courseId: mathCourse.id,
      teacherId: teacherA.id,
      title: "Algebra Masterclass - Summer 2026",
      price: 199.99,
    },
  });

  
  await prisma.session.createMany({
    data: [
      {
        offeringId: mathOffering.id,
        startTime: new Date("2026-06-01T14:00:00Z"), // 10:00 AM NY / 7:30 PM India
        endTime: new Date("2026-06-01T16:00:00Z"),
      },
      {
        offeringId: mathOffering.id,
        startTime: new Date("2026-06-03T14:00:00Z"), // 10:00 AM NY / 7:30 PM India
        endTime: new Date("2026-06-03T16:00:00Z"),
      },
    ],
  });

  console.log("Seeded initial Math Offering and Sessions");
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
