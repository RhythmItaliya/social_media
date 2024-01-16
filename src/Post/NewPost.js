import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import AvatarEditor from 'react-avatar-editor';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CheckIcon from '@mui/icons-material/Check';
import { Dialog, DialogContent } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDarkMode } from '../theme/Darkmode';


import { useDispatch } from 'react-redux';
import { setBase64Data } from '../actions/authActions';

const lightModeColors = {
    backgroundColor: '#ffffff',
    searchBarColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    placeholderColor: 'rgb(0,0,0)',
    inputTextColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
};

const darkModeColors = {
    backgroundColor: '#ffffff',
    searchBarColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    placeholderColor: '#ffffff',
    inputTextColor: 'rgb(0,0,0)',
    focusColor: '#ffffff',
    border: '#333333',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
};


const NewPost = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [editor, setEditor] = useState(null);
    const [scale, setScale] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [loading, setLoading] = useState(false); // New loading state
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const dispatch = useDispatch();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleScaleChange = (e) => {
        const newScale = parseFloat(e.target.value);
        setScale(newScale);
    };

    const handleZoomIn = () => {
        setScale((prevScale) => Math.min(prevScale + 0.1, 3));
    };

    const handleZoomOut = () => {
        setScale((prevScale) => Math.max(prevScale - 0.1, 0.1));
    };

    const handleApplyCrop = async () => {
        if (editor) {
            setLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            const croppedImage = editor.getImageScaledToCanvas().toDataURL();
            setCroppedImageUrl(croppedImage);
            setOpenModal(true);

            // const base64Data = croppedImage.split(',')[1];
            // dispatch(setBase64Data(base64Data));
            dispatch(setBase64Data(croppedImage));


            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const determineBackgroundColor = () => {
        if (selectedImage) {
            const img = new Image();
            img.src = selectedImage;

            // Check aspect ratio
            if (img.width > img.height) {
                return '#ffffff'; // Landscape image, set background to white
            } else {
                return '#ffffff'; // Portrait image, set background to white (you can change this if needed)
            }
        }

        return '#ffffff'; // Default background color if no image is selected
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '500px' }}>
            {selectedImage ? (
                <div>
                    <div style={{ width: '499.5px', height: '500px', overflow: 'hidden', backgroundColor: colors.backgroundColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: colors.boxShadow }}>
                        <AvatarEditor
                            ref={(ref) => setEditor(ref)}
                            image={selectedImage}
                            width={400}
                            height={400}
                            scale={scale}
                            style={{ backgroundColor: determineBackgroundColor() }}
                        />
                    </div>

                    <div className='justify-content-around d-flex mt-3'>
                        <IconButton onClick={handleZoomIn} aria-label="Zoom In">
                            <ZoomInIcon style={{ color: colors.iconColor }} />
                        </IconButton>
                        <Slider
                            value={scale}
                            min={0.1}
                            max={3}
                            step={0.1}
                            onChange={handleScaleChange}
                            aria-labelledby="Zoom"
                            style={{ color: colors.iconColor, track: { backgroundColor: colors.iconColor }, rail: { backgroundColor: colors.border } }}
                        />
                        <IconButton onClick={handleZoomOut} aria-label="Zoom Out">
                            <ZoomOutIcon style={{ color: colors.iconColor }} />
                        </IconButton>
                    </div>

                    <div className='justify-content-around d-flex'>
                        <IconButton onClick={handleApplyCrop} aria-label="Apply Crop">
                            <CheckIcon style={{ color: colors.iconColor }} />
                        </IconButton>
                        <IconButton onClick={() => setSelectedImage(null)} aria-label="Close">
                            <CloseIcon style={{ color: colors.iconColor }} />
                        </IconButton>
                    </div>

                    <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md">
                        <DialogContent style={{ backgroundColor: colors.backgroundColor }}>
                            {croppedImageUrl && (
                                <div>
                                    {/* Display the cropped image */}
                                    <img
                                        src={croppedImageUrl}
                                        alt="Cropped Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            border: colors.border,
                                        }}
                                    />
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {loading && <p>Loading...</p>}

                </div>
            ) : (
                <div>
                    <label htmlFor="file-input">
                        <CloudUploadIcon fontSize="large" style={{ color: colors.iconColor, cursor: 'pointer' }} />
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none', cursor: 'pointer' }}
                    />
                </div>
            )}
        </div>
    );
};

export default NewPost;
