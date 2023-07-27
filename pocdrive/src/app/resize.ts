import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
//ไม่ใช้แล้ว
async function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  crop: Crop
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    // reader.readAsDataURL(file);

    reader.onload = () => {
      img.onload = () => {
        console.log(img.src);
        console.log(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = crop.width;
        canvas.height = crop.height;
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;

        console.log(scaleX, scaleY);

        const ctx = canvas.getContext("2d");

        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        if (ctx) ctx.imageSmoothingQuality = "high";

        ctx?.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height
        );
        console.log(crop.x);
        console.log(crop.y);

        // const resizedCanvas = document.createElement("canvas");
        // let width = crop.width!;
        // let height = crop.height!;

        // if (width > height) {
        //   if (width > maxWidth) {
        //     height = (height * maxWidth) / width;
        //     width = maxWidth;
        //   }
        // } else {
        //   if (height > maxHeight) {
        //     width = (width * maxHeight) / height;
        //     height = maxHeight;
        //   }
        // }

        // resizedCanvas.width = width;
        // resizedCanvas.height = height;
        // const resizedCtx = resizedCanvas.getContext("2d");
        // resizedCtx?.drawImage(canvas, 0, 0, width, height);
        // console.log(width);
        // console.log(height);

        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, file.type);
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
export default resizeImage;
