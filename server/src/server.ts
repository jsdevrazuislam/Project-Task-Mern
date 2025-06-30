import dotenv from "dotenv";
dotenv.config();
import connectedDB from "@/config/db";
import app from "@/app";

connectedDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server is listing on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB Connection Error`, error);
  });
