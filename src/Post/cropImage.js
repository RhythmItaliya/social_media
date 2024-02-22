const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
  
      image.onload = () => {
        console.log('Image Loaded:', image.width, image.height);
        resolve(image);
      };
  
      image.onerror = (error) => {
        console.error('Error loading image:', error);
        reject(error);
      };
  
      image.src = src;
    });
  };
  
  const cropImage = (image, crop, zoom) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const scaledWidth = image.width * zoom;
    const scaledHeight = image.height * zoom;
  
    console.log('Scaled Dimensions:', scaledWidth, scaledHeight);
  
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
  
    const offsetX = (scaledWidth - crop.width * zoom) / 2;
    const offsetY = (scaledHeight - crop.height * zoom) / 2;
  
    console.log('Offset:', offsetX, offsetY);
  
    const croppedX = Math.max(crop.x * zoom - offsetX, 0);
    const croppedY = Math.max(crop.y * zoom - offsetY, 0);
  
    ctx.drawImage(
      image,
      croppedX,
      croppedY,
      crop.width * zoom,
      crop.height * zoom,
      0,
      0,
      scaledWidth,
      scaledHeight
    );
  
    return canvas.toDataURL('image/jpeg');
  };
  
  export const getCroppedImg = async (imageSrc, crop, zoom) => {
    try {
      const image = await loadImage(imageSrc);
      if (!image.width || !image.height) {
        throw new Error('Invalid image dimensions');
      }
  
      const dataUrl = cropImage(image, crop, zoom);
      console.log('Cropped Image Data URL:', dataUrl);
      return dataUrl;
    } catch (error) {
      // Handle the error
      console.error('Error:', error);
      throw error;
    }
  };
