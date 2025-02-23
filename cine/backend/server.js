// server.js
import app, { initializeApp } from "./app.js";

const startServer = async () => {
  try {
     // Iniciar el servidor
     const PORT = process.env.PORT;
     app.listen(PORT, () => {
       console.log(`Servidor corriendo en http://localhost:${PORT}`);
     });

    await initializeApp();

  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();