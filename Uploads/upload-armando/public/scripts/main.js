
document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const fileList = document.getElementById("fileList");
  const clearRecycleButton = document.getElementById("clearRecycle");
  const ctx = document.getElementById("sizeChart"); // Elemento canvas del gráfico

  if (!uploadForm || !fileList || !clearRecycleButton || !ctx) {
    console.error("No se encontraron elementos HTML requeridos.");
    return;
  }

  let sizeChartInstance = null; // Almacenar el gráfico para poder actualizarlo

  // Función para listar los archivos subidos
  async function fetchFiles() {
    try {
      const response = await fetch("/uploads");
      if (!response.ok) throw new Error("Error al obtener los archivos");
      const files = await response.json();
      fileList.innerHTML = "";

      files.forEach((file) => {
        const li = document.createElement("li");
        li.className = "flex justify-between items-center bg-gray-100 p-2 rounded-lg shadow-sm";
        li.innerHTML = `
          <span>${file}</span>
          <button class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600" data-filename="${file}">Eliminar</button>
        `;
        fileList.appendChild(li);
      });

      document.querySelectorAll("button[data-filename]").forEach((button) => {
        button.addEventListener("click", async (e) => {
          const fileName = e.target.dataset.filename;
          await moveFileToRecycle(fileName);
          fetchFiles();
          fetchFolderSizes(); // Actualizar el gráfico después de eliminar un archivo
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  // Función para mover archivo a recycle
  async function moveFileToRecycle(fileName) {
    try {
      const response = await fetch(`/uploads/recycle/${fileName}`, { method: "POST" });
      if (!response.ok) throw new Error(`Error al mover el archivo: ${fileName}`);
    } catch (error) {
      console.error(error.message);
    }
  }

  // Función para vaciar la carpeta recycle
  async function clearRecycle() {
    try {
      const response = await fetch("/uploads/recycle", { method: "DELETE" });
      if (!response.ok) throw new Error("Error al vaciar la papelera");
      alert("Papelera vaciada correctamente");
      fetchFolderSizes(); // Actualizar el gráfico después de vaciar la papelera
    } catch (error) {
      console.error(error.message);
    }
  }

  // Evento para vaciar la papelera
  clearRecycleButton.addEventListener("click", async () => {
    await clearRecycle();
    fetchFiles();
  });

  // Manejador de envío del formulario de subida
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);
    try {
      const response = await fetch("/uploads", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error al subir el archivo");
      uploadForm.reset();
      fetchFiles();
      fetchFolderSizes(); // Actualizar el gráfico después de subir un archivo
    } catch (error) {
      console.error(error.message);
    }
  });

  // Función para obtener los tamaños de las carpetas y actualizar el gráfico
  async function fetchFolderSizes() {
    try {
      const response = await fetch(`/uploads/sizes?timestamp=${new Date().getTime()}`);
      if (!response.ok) throw new Error("Error al obtener los tamaños");
      const sizes = await response.json();
  
      // Convertir los tamaños a MB y asegurarse de que ambas barras existen
      const uploadsSize = sizes.update / (1024 * 1024); 
      const recycleSize = sizes.recycle / (1024 * 1024);
  
      // Si ya existe un gráfico, destruirlo antes de crear uno nuevo
      if (sizeChartInstance) {
        sizeChartInstance.destroy();
      }
  
      // Crear el nuevo gráfico con las dos barras siempre visibles
      sizeChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Uploads", "Recycle"],
          datasets: [{
            label: "Tamaño (MB)",
            data: [uploadsSize, recycleSize], // Siempre incluye ambos valores, incluso si son 0
            backgroundColor: ["#4CAF50", "#FF5722"],
            borderColor: ["#388E3C", "#D32F2F"],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              suggestedMin: 0, // Asegura que el eje Y comience en 0
              suggestedMax: Math.max(uploadsSize, recycleSize, 1) // Evita que el gráfico se vea vacío si ambos son 0
            }
          }
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  // Cargar la lista de archivos y el gráfico al cargar la página
  fetchFiles();
  fetchFolderSizes();
  
});
