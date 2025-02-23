import fs from "fs";
import multer from "multer";
import path from "path";

// Crear directorios si no existen
const ensureDirectoryExistence = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const uploadsDir = path.join(process.cwd(), "uploads");
const recycleDir = path.join(process.cwd(), "recycle");
ensureDirectoryExistence(uploadsDir);
ensureDirectoryExistence(recycleDir);

// Configuración de Multer: almacenamiento y nombres de archivo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Controlador para subir archivo
export const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo" });
    }
    res.json({ message: "Archivo subido con éxito", fileName: req.file.filename });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    res.status(500).json({ error: "Error al subir archivo" });
  }
};

// Controlador para listar los archivos subidos
export const listFiles = (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error("Error al listar archivos:", err);
      return res.status(500).json({ error: "Error al listar archivos" });
    }
    res.json(files);
  });
};

// Controlador para mover un archivo a la carpeta recycle
export const moveToRecycle = (req, res) => {
  const fileName = req.params.fileName;
  const uploadPath = path.join(uploadsDir, fileName);
  const recyclePath = path.join(recycleDir, fileName);

  fs.rename(uploadPath, recyclePath, (err) => {
    if (err) {
      console.error(`Error al mover archivo ${fileName} a recycle:`, err);
      return res.status(500).json({ error: `Error al mover archivo: ${fileName}` });
    }
    res.json({ message: `Archivo ${fileName} movido a recycle con éxito` });
  });
};

// Controlador para listar archivos en la carpeta recycle
export const listRecycleFiles = (req, res) => {
  fs.readdir(recycleDir, (err, files) => {
    if (err) {
      console.error("Error al listar archivos en recycle:", err);
      return res.status(500).json({ error: "Error al listar archivos en recycle" });
    }
    res.json(files);
  });
};

// Controlador para eliminar todo en la carpeta recycle
export const clearRecycle = (req, res) => {
  fs.readdir(recycleDir, (err, files) => {
    if (err) {
      console.error("Error al acceder a la carpeta recycle:", err);
      return res.status(500).json({ error: "Error al acceder a la carpeta recycle" });
    }
    
    const deletePromises = files.map(file => 
      fs.promises.unlink(path.join(recycleDir, file)).catch(err => {
        console.error(`Error al eliminar archivo: ${file}`, err);
      })
    );
    
    Promise.all(deletePromises)
      .then(() => res.json({ message: "Carpeta recycle vaciada con éxito" }))
      .catch(() => res.status(500).json({ error: "Error al vaciar la carpeta recycle" }));
  });
};

// Función para obtener el resumen de archivos
const getFilesSummary = () => {
  const uploadFiles = fs.readdirSync(uploadsDir);
  const recycleFiles = fs.readdirSync(recycleDir);

  const uploadSize = getFolderSize(uploadsDir) / (1024 * 1024);  
  const recycleSize = getFolderSize(recycleDir) / (1024 * 1024); 

  return {
    uploadFiles,
    recycleFiles,
    uploadSize: uploadSize.toFixed(2),  
    recycleSize: recycleSize.toFixed(2)
  };
};




// Función para obtener el tamaño total de una carpeta (recursiva)
const getFolderSize = (folderPath) => {
  let totalSize = 0;

  const getSizeRecursive = (currentPath) => {
    try {
      const stats = fs.statSync(currentPath);
      if (stats.isDirectory()) {
        const files = fs.readdirSync(currentPath);
        files.forEach(file => getSizeRecursive(path.join(currentPath, file)));
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

// Controlador para obtener los tamaños de las carpetas update y recycle
export const getFolderSizes = (req, res) => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  const recycleDir = path.join(process.cwd(), "recycle");

  const updateSize = getFolderSize(uploadsDir);
  const recycleSize = getFolderSize(recycleDir);

  res.json({
    update: updateSize,
    recycle: recycleSize,
  });
};

export { upload };