import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
import mainRouter from "./routes/index.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", mainRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1);
  });
