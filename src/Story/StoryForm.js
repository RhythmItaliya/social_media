// StoryForm.js
import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const StoryForm = ({ open, onClose, onSubmit }) => {
  const [imageURL, setImageURL] = useState('');
  const [file, setFile] = useState(null);

  const handleImageURLChange = (event) => {
    setImageURL(event.target.value);
  };

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
   
    if (!imageURL && !file) {
      alert('Please provide an image URL or upload a file.');
      return;
    }

    const storyData = {
      image: imageURL || file,
    };

    onSubmit(storyData);

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Upload Story</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="imageURL"
          label="Image URL"
          type="text"
          fullWidth
          value={imageURL}
          onChange={handleImageURLChange}
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoryForm;
