// This file will be loaded as a Web Worker
self.onmessage = async (e) => {
  const { bitmap, settings, processId } = e.data;
  const { rotation, resizeEnabled, width, height, format, quality, resizeMethod, originalDim } = settings;

  try {
    let targetWidth = resizeEnabled && width ? Number(width) : originalDim.w;
    let targetHeight = resizeEnabled && height ? Number(height) : originalDim.h;

    if (!resizeEnabled) {
      const MAX_SIZE = 4096;
      if (targetWidth > targetHeight && targetWidth > MAX_SIZE) {
        targetHeight *= MAX_SIZE / targetWidth;
        targetWidth = MAX_SIZE;
      } else if (targetHeight > MAX_SIZE) {
        targetWidth *= MAX_SIZE / targetHeight;
        targetHeight = MAX_SIZE;
      }
    }

    const isVerticalRotation = (rotation / 90) % 2 !== 0;
    const canvasWidth = isVerticalRotation ? targetHeight : targetWidth;
    const canvasHeight = isVerticalRotation ? targetWidth : targetHeight;

    const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get 2d context');
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = resizeMethod.includes('High') ? 'high' : 'medium';
    ctx.drawImage(bitmap, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
    
    ctx.restore();

    const blobOptions = { type: format };
    if (format === 'image/jpeg' || format === 'image/webp') {
      blobOptions.quality = quality / 100;
    }

    const blob = await canvas.convertToBlob(blobOptions);

    self.postMessage({ blob, processId });
    bitmap.close();
  } catch (error) {
    self.postMessage({ error: error.message, processId });
    if (bitmap) bitmap.close();
  }
};
