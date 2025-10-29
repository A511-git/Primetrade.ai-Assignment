
import "dotenv/config";
import connectDB from "./db/index.js";
import { configDotenv } from "dotenv";
import { app } from "./app.js";

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT);
    console.log(`Server running on port : ${PORT}`);
  })
  .catch((e) => {
    console.log(`Server failed to start: ${e.message}`);
  });

