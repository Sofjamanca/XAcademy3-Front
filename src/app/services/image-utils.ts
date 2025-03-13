export function convertToWebP(file: File, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        return reject(new Error("El archivo no es una imagen"));
      }
  
      const reader = new FileReader();
      reader.readAsDataURL(file);
  
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
  
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
  
          if (!ctx) return reject(new Error("No se pudo obtener el contexto del canvas"));
  
          // Ajustar tamaño del canvas
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0, img.width, img.height);
  
          // Convertir a WebP
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error("Error al convertir la imagen a WebP"));
  
            // Crear un nuevo archivo WebP
            const webpFile = new File([blob], `${Date.now()}_image.webp`, { type: "image/webp" });
            resolve(webpFile);
          }, "image/webp", quality);
        };
      };
  
      reader.onerror = reject;
    });
  }
  