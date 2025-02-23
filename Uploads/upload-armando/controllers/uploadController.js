import fs from "fs";
import multer from "multer";
import path from "path";

// Rutas de las carpetas
const uploadsDir = path.join(process.cwd(), "uploads");
const recycleDir = path.join(process.cwd(), "recycle");


const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
ensureDirectoryExistence(uploadsDir);
ensureDirectoryExistence(recycleDir);

// Configuración de Multer (subida de archivos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });
export { upload };

// Obtener el tamaño total de una carpeta
const getFolderSize = (folderPath) => {
  let totalSize = 0;

  const getSizeRecursive = (currentPath) => {
    try {
      const stats = fs.statSync(currentPath);
      if (stats.isDirectory()) {
        fs.readdirSync(currentPath).forEach(file => getSizeRecursive(path.join(currentPath, file)));
      } else {
        totalSize += stats.size;
      }
    } catch (err) {
      console.error(`Error obteniendo tamaño de: ${currentPath}`, err);
    }
  };

  getSizeRecursive(folderPath);
  return totalSize;
};



// Controlador: listar archivos subidos
export const listFiles = (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error("Error listando archivos:", err);
      return res.status(500).json({ error: "Error al listar archivos" });
    }
    res.json(files);
  });
};

// Controlador: listar archivos en la papelera
export const listRecycleFiles = (req, res) => {
  fs.readdir(recycleDir, (err, files) => {
    if (err) {
      console.error("Error listando archivos en recycle:", err);
      return res.status(500).json({ error: "Error al listar archivos en recycle" });
    }
    res.json(files);
  });
};


export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se ha subido ningún archivo" });
  }
  res.json({ message: "Archivo subido con éxito", fileName: req.file.filename });
};

//mover archivo a la papelera
export const moveToRecycle = (req, res) => {
  const fileName = req.params.fileName;
  const uploadPath = path.join(uploadsDir, fileName);
  const recyclePath = path.join(recycleDir, fileName);

  fs.rename(uploadPath, recyclePath, (err) => {
    if (err) {
      console.error(`Error moviendo archivo ${fileName} a recycle:`, err);
      return res.status(500).json({ error: `Error al mover archivo: ${fileName}` });
    }
    res.json({ message: `Archivo ${fileName} movido a recycle con éxito` });
  });
};

export const clearRecycle = (req, res) => {
  fs.readdir(recycleDir, (err, files) => {
    if (err) {
      console.error("Error accediendo a recycle:", err);
      return res.status(500).json({ error: "Error al acceder a la carpeta recycle" });
    }

    const deletePromises = files.map(file => fs.promises.unlink(path.join(recycleDir, file)).catch(err => {
      console.error(`Error eliminando archivo: ${file}`, err);
    }));

    Promise.all(deletePromises)
      .then(() => res.json({ message: "Carpeta recycle vaciada con éxito" }))
      .catch(() => res.status(500).json({ error: "Error al vaciar la carpeta recycle" }));
  });
};


export const getFolderSizes = (req, res) => {
  res.json({
    update: getFolderSize(uploadsDir),
    recycle: getFolderSize(recycleDir),
  });
};
