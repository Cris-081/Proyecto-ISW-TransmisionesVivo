import express from "express";
import cors from "cors";
import morgan from "morgan";
import { AppDataSource } from "./config/configDb.js";
import mainRouter from "./routes/index.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


app.use("/api", mainRouter);
app.use("/api/admin", adminRouter);


AppDataSource.initialize()
  .then(() => {
    console.log("Base de datos conectada correctamente");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar la base de datos:", error);
  });