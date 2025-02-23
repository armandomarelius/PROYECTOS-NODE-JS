document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const fileList = document.getElementById("fileList");
  const clearRecycleButton = document.getElementById("clearRecycle");
  const ctx = document.getElementById("sizeChart");

  if (!uploadForm || !fileList || !clearRecycleButton || !ctx) {
    console.error("Faltan algunos elementos en el HTML.");
    return;
  }

  let sizeChartInstance = null; // Guardamos la instancia del gráfico para actualizarlo

  // Función que borra la papelera y actualiza la lista de archivos
  async function clearRecycle() {
    try {
      const response = await fetch("/uploads/recycle", { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo limpiar la papelera");
      alert("Papelera vaciada!");
      fetchFolderSizes(); // Actualizar el gráfico después de limpiar
    } catch (error) {
      console.error(error.message);
    }
  }

  // Manejar el botón para vaciar la papelera
  clearRecycleButton.addEventListener("click", async () => {
    await clearRecycle();
    fetchFiles();
  });

  // Obtiene la lista de archivos del servidor y los muestra en la interfaz
  async function fetchFiles() {
    try {
      const response = await fetch("/uploads");
      if (!response.ok) throw new Error("No se pudieron cargar los archivos");
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
          fetchFolderSizes(); // Actualizar el gráfico
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  // Mueve un archivo a la papelera
  async function moveFileToRecycle(fileName) {
    try {
      const response = await fetch(`/uploads/recycle/${fileName}`, { method: "POST" });
      if (!response.ok) throw new Error(`No se pudo eliminar el archivo: ${fileName}`);
    } catch (error) {
      console.error(error.message);
    }
  }

  // Manejador del formulario de subida de archivos
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);
    try {
      const response = await fetch("/uploads", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Error subiendo el archivo");
      uploadForm.reset();
      fetchFiles();
      fetchFolderSizes(); // Refrescar el gráfico
    } catch (error) {
      console.error(error.message);
    }
  });

  // Obtiene los tamaños de las carpetas y dibuja el gráfico
  async function fetchFolderSizes() {
    try {
      const response = await fetch(`/uploads/sizes?timestamp=${new Date().getTime()}`);
      if (!response.ok) throw new Error("No se pudo obtener el tamaño de las carpetas");
      const sizes = await response.json();
  
      const uploadsSize = sizes.update / (1024 * 1024);
      const recycleSize = sizes.recycle / (1024 * 1024);
  
      if (sizeChartInstance) {
        sizeChartInstance.destroy();
      }
  
      sizeChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Uploads", "Recycle"],
          datasets: [{
            label: "Tamaño (MB)",
            data: [uploadsSize, recycleSize],
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
              suggestedMin: 0,
              suggestedMax: Math.max(uploadsSize, recycleSize, 1)
            }
          }
        }
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  // Inicializar la lista de archivos y el gráfico al cargar la página
  fetchFiles();
  fetchFolderSizes();
});
