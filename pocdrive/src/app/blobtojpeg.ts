function blobToJPEG(blob: Blob, fileName: string): File {
  // Create a new File object from the Blob
  const jpegFile = new File([blob], fileName, { type: "image/jpeg" });
  return jpegFile;
}
export default blobToJPEG;
