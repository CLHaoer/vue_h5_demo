// jsqr-worker.ts
import jsQR from "jsqr";
self.onmessage = (e) => {
  const { imageData } = e.data;
  try {
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "attemptBoth" });
    self.postMessage({data:qrCode?.data});
  } catch (error) {
    self.postMessage({ error })
  }
};