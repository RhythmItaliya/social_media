import React, { useEffect, useState } from 'react';
import { Modal, Backdrop, Fade, IconButton, Avatar, TextareaAutosize, Slider, Tooltip, LinearProgress, Dialog, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material';
import { Close, Visibility, Add, Upload, ArrowBack, ArrowForward } from '@mui/icons-material';
import AvatarEditor from 'react-avatar-editor';
import { ChromePicker } from 'react-color';
import { message } from 'antd';
import { DeleteForever } from '@material-ui/icons';
import config from '../configuration';

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const UserStory = ({ open, onClose, username, colors, uuid }) => {

  const [uploadingStory, setUploadingStory] = useState(false);

  const [loading, setLoading] = useState(false);
  const [newStoryText, setNewStoryText] = useState('');
  const [newStoryImage, setNewStoryImage] = useState('');
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewDetails, setPreviewDetails] = useState({ text: '', image: '' });

  const [textColor, setTextColor] = useState(colors.textColor);
  const [showColorPicker, setShowColorPicker] = useState(true);

  const [uploadProgress, setUploadProgress] = useState(0);


  const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [storyDetails, setStoryDetails] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [stories, setStories] = useState(null);

  const handleColorChange = (color) => {
    setTextColor(color.hex);
  };

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
  };

  const handleUploadStory = () => {
    setUploadingStory(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setNewStoryImage(URL.createObjectURL(file));
    }
  };

  const handleScaleChange = (e) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
  };

  const resetState = () => {
    setNewStoryText('');
    setNewStoryImage('');
    setScale(1);
    setTextColor('#000000');
    setShowColorPicker(true);
  };

  const handleClose = () => {
    setUploadingStory(false);
    resetState();
    onClose();
  };

  const handleStoryUpload = async () => {
    if (editor) {
      try {
        setLoading(true);

        const intervals = [10, 20, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 100];

        for (const interval of intervals) {
          await simulateUpload(interval);
          setUploadProgress(interval);
        }

        const croppedImage = editor.getImageScaledToCanvas().toDataURL();

        const response = await fetch(`${config.apiUrl}/stories/stories/${uuid}`, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postText: newStoryText,
            data: croppedImage,
            textColor: textColor,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          message.success('Your Story uploaded successfully.');
          setPreviewDetails();
          onClose();
        } else {
          console.error('Failed to upload story:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading story:', error);
      } finally {
        setLoading(false);
        setUploadProgress(0);
      }
    }
  };

  const simulateUpload = (interval) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
  };

  const setPreview = () => {
    const croppedImage = editor.getImageScaledToCanvas().toDataURL();
    const previewDetails = {
      text: newStoryText,
      image: croppedImage,
    };

    setPreviewDetails(previewDetails);
    setPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
  };

  const handleTextareaFocus = () => {
    setShowColorPicker(true);
  };


  const handleViewStory = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${config.apiUrl}/stories/get/stories/${uuid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const { success, stories } = data;

      if (success && stories.length > 0) {
        setStories(stories);

        const firstStory = stories[0];

        setStoryDetails({
          image: firstStory.image,
          text: firstStory.text,
          textColor: firstStory.textColor,
          uuid: firstStory.uuid
        });

        setStoryModalVisible(true);
      } else {
        console.error('Error fetching user stories:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user stories:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStory = () => {
    if (stories && stories.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % stories.length);
      setStoryDetails(stories[(currentIndex + 1) % stories.length]);
    }
  };

  const handlePreviousStory = () => {
    if (stories && stories.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
      setStoryDetails(stories[(currentIndex - 1 + stories.length) % stories.length]);
    }
  };

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setStoryToDelete(null);
  };

  const handleDeleteConfirmation = () => {
    setStoryToDelete(storyDetails.uuid);
    setDeleteConfirmationOpen(true);
  };


  const handleDeleteStory = async () => {
    if (storyToDelete) {
      try {
        const response = await fetch(`${config.apiUrl}/stories/delete/story/${storyToDelete}`, {
          credentials: 'include',
          method: 'DELETE',
        });

        if (response.ok) {
          message.success('Story deleted successfully.');
          onClose();
        } else {
          console.error('Failed to delete story:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePreviousStory();
      } else if (event.key === 'ArrowRight') {
        handleNextStory();
      }
    };

    const handleTouchStart = (event) => {
      const touchStartX = event.touches[0].clientX;

      const handleTouchEnd = (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (deltaX > 50) {
          handlePreviousStory();
        } else if (deltaX < -50) {
          handleNextStory();
        }
        document.removeEventListener('touchend', handleTouchEnd);
      };
      document.addEventListener('touchend', handleTouchEnd);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleNextStory, handlePreviousStory]);

  const handleCloseStoryModal = () => {
    setStoryModalVisible(false);
    setStoryDetails(null);
  };


  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      style={{
        backgroundColor: colors.transparentColor
      }}
    >
      <Fade in={open}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
          width: '350px',
          border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '8px',
        }}>
          <div style={{ position: 'relative' }}>
            {uploadingStory ? (
              <div style={{ padding: '20px', background: colors.backgroundColor, borderRadius: '8px', textAlign: 'center' }}>
                <IconButton
                  style={{ position: 'absolute', top: 10, right: 10, color: colors.iconColor }}
                  onClick={handleClose}
                >
                  <Close />
                </IconButton>
                <h2 style={{ color: colors.textColor, fontSize: '20px' }}>Upload Your Story</h2>

                <div style={{ marginTop: '10px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="mediaInput"
                  />
                  <label htmlFor="mediaInput">
                    <Tooltip title="Select Media" placement="bottom">
                      <IconButton style={{ color: colors.iconColor }} component="span">
                        <Upload />
                      </IconButton>
                    </Tooltip>
                  </label>
                </div>

                <TextareaAutosize
                  minRows={2}
                  maxRows={3}
                  placeholder="Story Text"
                  value={newStoryText}
                  onChange={(e) => setNewStoryText(e.target.value)}
                  style={{
                    color: textColor,
                    backgroundColor: colors.backgroundColor,
                    border: `1px solid ${colors.border} `,
                    borderRadius: '4px',
                    padding: '8px',
                    width: '100%',
                    marginTop: '8px',
                    resize: 'none',
                    '&:focus': {
                      borderColor: colors.focusColor,
                    },

                  }}
                  onFocus={handleTextareaFocus}
                />

                {showColorPicker && (
                  <div>
                    <div>
                      <IconButton
                        style={{ backgroundColor: colors.backgroundColor, color: colors.iconColor }}
                        onClick={handleColorPickerClose}
                      >
                        <Close />
                      </IconButton>
                    </div>
                    <div>
                      <ChromePicker
                        color={textColor}
                        onChange={handleColorChange}
                        width="350px"
                      />
                    </div>
                  </div>
                )}

                {newStoryImage && (
                  <>
                    <div style={{ maxWidth: '350px', height: '500px', overflow: 'hidden', backgroundColor: colors.backgroundColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: colors.boxShadow }}>
                      <AvatarEditor
                        ref={(ref) => setEditor(ref)}
                        image={newStoryImage}
                        width={350}
                        height={550}
                        scale={scale}
                        style={{ backgroundColor: colors.backgroundColor }}
                      />
                    </div>

                    <div className='justify-content-around d-flex mt-3'>
                      <Slider
                        value={scale}
                        min={0.1}
                        max={3}
                        step={0.1}
                        onChange={handleScaleChange}
                        aria-labelledby="Zoom"
                        style={{ color: colors.iconColor, track: { backgroundColor: colors.iconColor }, rail: { backgroundColor: colors.border } }}
                      />
                    </div>

                    <Tooltip title="Upload Your Story" placement="bottom">
                      <IconButton style={{ color: colors.iconColor }} onClick={handleStoryUpload}>
                        <Add />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Preview Your Story" placement="bottom">
                      <IconButton style={{ color: colors.iconColor }} onClick={setPreview}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </>
                )}

                {loading && (
                  <div>
                    <p style={{ color: colors.textColor }}>Uploading: {uploadProgress}%</p>
                    <LinearProgress style={{ color: colors.textColor }} variant="determinate" value={uploadProgress} />
                  </div>
                )}

              </div>

            ) : (
              // Display user's story
              <>
                {/* {selectedUser && (
                  <>
                    <Avatar
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      style={{ width: '350px', height: '550px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <IconButton style={{ position: 'absolute', top: 0, right: 0, color: colors.iconColor }} onClick={handleClose}>
                      <Close style={{ color: colors.iconColor }} />
                    </IconButton>
                    <div style={{ position: 'absolute', bottom: '0', textAlign: 'center', width: '100%', color: colors.textColor }}>
                      {selectedUser.storyText && <p className='mt-2' style={{ color: colors.textColor }}>{selectedUser.storyText}</p>}
                    </div>
                  </>
                )} */}
              </>
            )}
          </div>

          {/* Preview Modal */}
          <Modal
            open={previewVisible}
            onClose={handleClosePreview}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={previewVisible}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '550px',
                width: '350px',
                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.2)`,
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '8px',
              }}>
                <div style={{ position: 'relative' }}>
                  {/* Display the uploaded story details in the preview modal */}
                  {previewDetails && (
                    <>
                      <Avatar
                        src={previewDetails.image}
                        alt="Preview"
                        style={{ width: '350px', height: '550px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <IconButton style={{ position: 'absolute', top: 0, right: 0, color: colors.iconColor }} onClick={handleClosePreview}>
                        <Close style={{ color: colors.iconColor }} />
                      </IconButton>
                      <div style={{ position: 'absolute', bottom: '0', textAlign: 'center', width: '100%', color: textColor }}>
                        {previewDetails.text && <p className='mt-2' style={{ color: textColor }}>{previewDetails.text}</p>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Fade>
          </Modal>

          {/* Story Modal */}
          <Modal
            open={storyModalVisible}
            onClose={handleCloseStoryModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={storyModalVisible}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '550px',
                width: '350px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '8px',
              }}>
                <div style={{ position: 'relative' }}>
                  {storyDetails && (
                    <>
                      <Avatar
                        src={`http://static.stories.local/${storyDetails.image}`}
                        alt="Story Preview"
                        style={{ width: '350px', height: '550px', objectFit: 'cover', borderRadius: '8px' }}
                      />

                      <div style={{ position: 'absolute', top: '0', textAlign: 'center', width: '100%', color: storyDetails.textColor }}>
                        <p className='mt-2' style={{ color: colors.textColor, fontSize: '14px' }}>@{username}</p>
                      </div>

                      <div style={{ position: 'absolute', bottom: '0', textAlign: 'center', width: '100%', color: storyDetails.textColor }}>
                        {storyDetails.text && <p className='mt-2' style={{ color: storyDetails.textColor }}>{storyDetails.text}</p>}
                      </div>

                      <IconButton style={{ position: 'absolute', top: 0, right: 0, color: 'white' }} onClick={handleCloseStoryModal}>
                        <Close style={{ color: colors.iconColor }} />
                      </IconButton>

                      {stories && (
                        <div style={{ position: 'absolute', top: 0, left: 0, color: 'white', padding: '8px' }}>
                          <span style={{ color: colors.textColor }}>{stories.length}/{currentIndex + 1}</span>
                        </div>
                      )}

                      <IconButton style={{ position: 'absolute', top: '45%', left: 0 }} onClick={handlePreviousStory}>
                        <ArrowBack style={{ color: colors.textColor }} />
                      </IconButton>

                      <IconButton style={{ position: 'absolute', top: '45%', right: 0 }} onClick={handleNextStory}>
                        <ArrowForward style={{ color: colors.textColor }} />
                      </IconButton>

                      <Tooltip title="Action" placement="top">
                        <IconButton style={{ position: 'absolute', bottom: '0', right: 0 }} onClick={() => handleDeleteConfirmation(storyDetails.uuid)}>
                          <DeleteForever style={{ color: colors.textColor }} />
                        </IconButton>
                      </Tooltip>

                      <Dialog
                        open={deleteConfirmationOpen}
                        onClose={handleCloseDeleteConfirmation}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        style={{
                          border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`,
                          boxShadow: colors.boxShadow
                        }}
                      >
                        <DialogTitle style={{ color: colors.textColor, backgroundColor: colors.backgroundColor }} id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                        <DialogContent sx={{ backgroundColor: colors.backgroundColor }}>
                          <DialogContentText id="alert-dialog-description" style={{ color: colors.textColor }}>
                            Are you sure you want to delete this Story?
                          </DialogContentText>
                        </DialogContent>
                        <DialogContent className='d-flex justify-content-around align-content-center p-2' sx={{ backgroundColor: colors.backgroundColor }}>
                          <Button onClick={handleCloseDeleteConfirmation} color="primary">
                            Cancel
                          </Button>
                          <Button onClick={handleDeleteStory} color="warning" autoFocus>
                            Delete
                          </Button>
                        </DialogContent>
                      </Dialog>

                    </>
                  )}
                </div>
              </div>
            </Fade>
          </Modal>

          {uploadingStory ? null : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className='gap-5'>
              <IconButton style={{ position: 'absolute', top: 0, right: 0, color: colors.iconColor }} onClick={handleClose}>
                <Close style={{ color: colors.iconColor }} />
              </IconButton>

              <Tooltip title="View Your Story" placement="bottom">
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton style={{ color: colors.iconColor, marginBottom: '5px' }} onClick={handleViewStory}>
                    <Visibility />
                  </IconButton>
                  <p style={{ color: colors.textColor, margin: '0', fontSize: '12px' }}>View Your Story</p>
                </div>
              </Tooltip>


              <Tooltip title="Upload Your Story" placement="bottom">
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton style={{ color: colors.iconColor, marginBottom: '5px' }} onClick={handleUploadStory}>
                    <Add />
                  </IconButton>
                  <p style={{ color: colors.textColor, margin: '0', fontSize: '12px' }}>Upload Your Story</p>
                </div>
              </Tooltip>


            </div>
          )}
        </div>
      </Fade>
    </Modal >
  );
};

export default UserStory;