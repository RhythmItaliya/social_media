import React, { useCallback, useState } from 'react';
import { useDarkMode } from '../../theme/Darkmode';
import { Container, Grid, Card, TextField, Button, Modal } from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const lightModeColors = {
  backgroundColor: '#ffffff',
  textColor: 'rgb(0, 0, 0)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
};

const darkModeColors = {
  backgroundColor: 'rgb(0, 0, 0)',
  textColor: '#ffffff',
  boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
};

const CreatePost = () => {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 16 / 9 });
  const [cropPreview, setCropPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedImage(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const onImageLoaded = (image) => {
    // You can do something when the image is loaded, if needed
  };

  const showCroppedPreview = () => {
    if (selectedImage) {
      const image = new Image();
      image.src = selectedImage;

      const pixelCrop = {
        x: (crop.x / 100) * image.width,
        y: (crop.y / 100) * image.height,
        width: (crop.width / 100) * image.width,
        height: (crop.height / 100) * image.height,
      };

      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

      const croppedImageUrl = canvas.toDataURL('image/png');
      setCropPreview(croppedImageUrl);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Container style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, height: '100vh' }}>
      <Grid container alignItems="center" justify="center" style={{ height: '100%' }}>
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Card style={{ padding: '20px', boxShadow: colors.boxShadow, width: '100%' }}>
            <Grid container spacing={3} direction="column" alignItems="center">
              <Grid item xs={12}>
                <h5>Post Upload Interface</h5>
              </Grid>
              <Grid item xs={12}>
                <div {...getRootProps()} style={{ border: `2px dashed ${colors.textColor}`, padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                  <input {...getInputProps()} />
                  <p>{isDragActive ? 'Drop the files here ...' : 'Drag & drop or click to select files'}</p>
                </div>
              </Grid>
              <Grid item xs={12}>
                {selectedImage && (
                  <ReactCrop
                    src={selectedImage}
                    crop={crop}
                    onChange={onCropChange}
                    onImageLoaded={onImageLoaded}
                  />
                )}
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={showCroppedPreview}>
                  Show Cropped Preview
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div style={{ backgroundColor: colors.backgroundColor, color: colors.textColor, padding: '20px', textAlign: 'center' }}>
          <h5>Cropped Image Preview</h5>
          {cropPreview && <img src={cropPreview} alt="Cropped Preview" style={{ maxWidth: '100%', height: 'auto' }} />}
          <Button variant="contained" color="primary" onClick={handleCloseModal}>
            Close
          </Button>
        </div>
      </Modal>
    </Container>
  );
};

export default CreatePost;
