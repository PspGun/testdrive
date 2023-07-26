import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  crop: Crop
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = crop.width!;
        canvas.height = crop.height!;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(
          img,
          crop.x!,
          crop.y!,
          crop.width!,
          crop.height!,
          0,
          0,
          crop.width!,
          crop.height!
        );

        const resizedCanvas = document.createElement("canvas");
        let width = crop.width!;
        let height = crop.height!;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        resizedCanvas.width = width;
        resizedCanvas.height = height;

        const resizedCtx = resizedCanvas.getContext("2d");
        resizedCtx?.drawImage(
          img,
          0,
          0,
          crop.width!,
          crop.height!,
          0,
          0,
          width,
          height
        );

        resizedCanvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, file.type);
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
export default resizeImage;
