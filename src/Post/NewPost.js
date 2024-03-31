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
import './otherpost.css';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
    spinnerColor: 'rgb(0,0,0)',
    labelColor: '#8e8e8e',
    valueTextColor: 'rgb(0,0,0)',
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    focusColor: '#ffffff',
    border: '#333333',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
    spinnerColor: '#ffffff',
    labelColor: '#CCC',
    valueTextColor: '#ffffff'
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const NewPost = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [editor, setEditor] = useState(null);
    const [scale, setScale] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
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
                return '#ffffff';
            } else {
                return '#ffffff'; // Portrait image, set background to white (you can change this if needed)
            }
        }

        return '#ffffff'; // Default background color if no image is selected
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'auto'
        }}>
            {selectedImage ? (
                <div>
                    <div style={{ width: '500px', height: '500px', overflow: 'hidden', backgroundColor: colors.backgroundColor, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: colors.boxShadow }}>
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

                    {loading && <p style={{ color: colors.textColor }}>
                        <div className="loading-dots">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </p>}

                </div>
            ) : (
                <div className='p-4 rounded-1 file-upload-container' style={{ cursor: 'pointer', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)` }}>
                    <label htmlFor="file-input" className="upload-label">
                        <div className="upload-icon-container">
                            <CloudUploadIcon fontSize="large" style={{ color: colors.iconColor, }} className="upload-icon" />
                        </div>
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                </div>
            )}
        </div>
    );
};

export default NewPost;