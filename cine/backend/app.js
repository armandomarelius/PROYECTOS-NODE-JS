// app.js
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import { initializeMovieDatabase } from "./controllers/movieController.js";

const app = express();

// Configuración de CORS
const allowedOrigins = [
  "http://localhost:5174",
  "http://tu-dominio.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

export const initializeApp = async () => {
  try {
    await connectDB();
    console.log('MongoDB conectado correctamente');

    // Inicializar la base de datos de películas
    await initializeMovieDatabase();
    console.log('Base de datos de películas inicializada');

  } catch (error) {
    console.error('Error durante la inicialización:', error);
    process.exit(1);
  }
};


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/", movieRoutes);

export default app;