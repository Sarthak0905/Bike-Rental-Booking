require("dotenv").config();
const mongoose = require("mongoose");
const Bike = require("./src/models/Bike");

const mockBikes = [
  {
    name: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    category: "bike",
    pricePerDay: 800,
    location: "Mumbai",
    description: "Classic cruiser bike, perfect for long rides and city commute alike.",
    isAvailable: true,
    images: [{ url: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "mock1" }]
  },
  {
    name: "Honda Activa 6G",
    brand: "Honda",
    category: "scooty",
    pricePerDay: 400,
    location: "Pune",
    description: "The most reliable and popular scooty for easy city travel.",
    isAvailable: true,
    images: [{ url: "https://images.unsplash.com/photo-1596726210086-9051fb6c1894?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "mock2" }]
  },
  {
    name: "KTM Duke 200",
    brand: "KTM",
    category: "bike",
    pricePerDay: 1200,
    location: "Bangalore",
    description: "Sporty and aggressive street naked bike. Pure thrill.",
    isAvailable: true,
    images: [{ url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "mock3" }]
  },
  {
    name: "TVS Jupiter",
    brand: "TVS",
    category: "scooty",
    pricePerDay: 350,
    location: "Mumbai",
    description: "Comfortable scooty with great mileage for daily chores.",
    isAvailable: true,
    images: [{ url: "https://images.unsplash.com/photo-1629009710502-b2c3400dd692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "mock4" }]
  },
  {
    name: "Bajaj Pulsar NS200",
    brand: "Bajaj",
    category: "bike",
    pricePerDay: 700,
    location: "Delhi",
    description: "Powerful engine, great handling. Ideal for highway runs.",
    isAvailable: true,
    images: [{ url: "https://images.unsplash.com/photo-1620023419998-e7c65c92c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", publicId: "mock5" }]
  }
];

const seedDB = async () => {
  try {
    // Determine the URI based on if we have it in .env, otherwise use local or docker-compose Atlas URI
    const uri = process.env.MONGO_URI || "mongodb+srv://sarthaknagpure1_db_user:83JCC1kq5JTgorTW@cluster0.dcseach.mongodb.net/rental-booking-bike?appName=Cluster0";
    
    console.log("Connecting to database...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");

    console.log("Clearing existing bikes...");
    await Bike.deleteMany({});

    console.log("Inserting mock bikes...");
    await Bike.insertMany(mockBikes);

    console.log("Mock data inserted successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedDB();
