import { Router } from "express";
import {
  upload,
  uploadFile,
  listFiles,
  moveToRecycle,
  listRecycleFiles,
  clearRecycle,
  getFolderSizes,
} from "../controllers/uploadController.js";

const router = Router();

// Ruta para subir archivo
router.post("/", upload.single("file"), uploadFile);

router.get("/", listFiles);

// Ruta para mover un archivo a la papelera
router.post("/recycle/:fileName", moveToRecycle);

// Ruta para listar archivos en la papelera
router.get("/recycle", listRecycleFiles);

// Ruta para vaciar la papelera completamente
router.delete("/recycle", clearRecycle);


router.get('/sizes', getFolderSizes);

export default router;
