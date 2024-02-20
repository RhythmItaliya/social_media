// ProfileAvatarSelector.jsx
import React, { useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import Slider from '@mui/material/Slider';
import AvatarEditor from 'react-avatar-editor';
import { useDarkMode } from '../../theme/Darkmode';


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


const ProfileAvatarSelector = ({ onCroppedImage }) => {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [cropUrl, setCropUrl] = useState('');
    const [zoom, setZoom] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const editorRef = useRef(null);

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setLoading(true);

            const base64String = new FileReader();
            base64String.onloadend = () => {
                setAvatarUrl(base64String.result);
                setCropUrl('');
                setLoading(false);
            };
            base64String.readAsDataURL(file);
        }
    };

    const handleZoomChange = (_, newZoom) => {
        setZoom(newZoom);
        updatePreview(newZoom);
    };

    const updatePreview = (newZoom) => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImage();
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = 200;
            resizedCanvas.height = 200;
            const ctx = resizedCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, 200, 200);

            const resizedBase64 = resizedCanvas.toDataURL('image/png');
            setCropUrl(resizedBase64);

            onCroppedImage(resizedBase64);
        }
    };

    const handleSaveAvatar = () => {
        setLoading(true);

        if (editorRef.current) {
            const canvas = editorRef.current.getImage();
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = 200;
            resizedCanvas.height = 200;
            const ctx = resizedCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, 200, 200);

            const resizedBase64 = resizedCanvas.toDataURL('image/png');
            setCropUrl(resizedBase64);

            onCroppedImage(resizedBase64);

            setLoading(false);
            setError(null);
        }
    };


    const handleReset = () => {
        setZoom(1);
        setCropUrl('');
        updatePreview(1);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px' }}>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error.message}</p>}

            <FormControl style={{ display: 'flex', justifyContent: 'center', width: '350px' }}>
                <input
                    type="file"
                    id="avatar-file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                />
                <label htmlFor="avatar-file" style={{ cursor: 'pointer', textAlign: 'center' }}>
                    <IconButton color="primary" component="span">
                        <PhotoCameraIcon />
                    </IconButton>
                </label>
            </FormControl>

            {avatarUrl && (
                <div>
                    <AvatarEditor
                        ref={editorRef}
                        image={avatarUrl}
                        width={200}
                        height={200}
                        border={50}
                        color={[255, 255, 255, 0.6]} // RGBA
                        scale={zoom}
                        rotate={0}
                    />
                    <div style={{ marginTop: '16px' }}>
                        <Slider
                            value={zoom}
                            min={1}
                            max={2}
                            step={0.1}
                            onChange={handleZoomChange}
                        />
                    </div>
                </div>
            )}

            <p className='mt-1'>Preview</p>
            {cropUrl && (
                <Avatar
                    alt="Avatar"
                    src={cropUrl}
                    style={{ width: 100, height: 100 }}
                />
            )}

            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ margin: '0 8px' }}>
                    <IconButton color="primary" onClick={handleSaveAvatar}>
                        <SaveIcon />
                    </IconButton>
                </div>
                <div style={{ margin: '0 8px' }}>
                    <IconButton color="secondary" onClick={handleReset}>
                        <RefreshIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    );
};

export default ProfileAvatarSelector;
