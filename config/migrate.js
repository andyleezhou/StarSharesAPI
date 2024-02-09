require("dotenv").config();

const url = process.env.MONGO_CONNECTION;
const mongoose = require("mongoose");
const User = require("../model/userSchema"); // Import your user model

async function migrate() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find({});

    for (const user of users) {
      if (!user.firstName && !user.lastName) {
        // If both firstName and lastName are missing, you can set default values or leave them empty
        user.firstName = "John";
        user.lastName = "Doe";
        await user.save();
      } else if (!user.firstName) {
        // If only firstName is missing, set a default value or leave it empty
        user.firstName = "Default First Name";
        await user.save();
      } else if (!user.lastName) {
        // If only lastName is missing, set a default value or leave it empty
        user.lastName = "Default Last Name";
        await user.save();
      }
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    mongoose.disconnect();
  }
}

migrate();
