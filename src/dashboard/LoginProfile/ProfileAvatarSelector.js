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
import Tooltip from '@mui/material/Tooltip';


const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};


const ProfileAvatarSelector = ({ colors, onCroppedImage }) => {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [cropUrl, setCropUrl] = useState('');
    const [zoom, setZoom] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const editorRef = useRef(null);

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
        setAvatarUrl('');
        setCropUrl('');
        setZoom(1);
        setLoading(false);
        setError(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '16px', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)` }} className='rounded-2'>
            {loading && <p>
                <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </p>}
            {error && <p style={{ color: 'red' }}>{error.message}</p>}

            <FormControl style={{ display: 'flex', justifyContent: 'center', width: '350px' }}>
                <input
                    type="file"
                    id="avatar-file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                />

                {!avatarUrl && (
                    <label htmlFor="avatar-file" style={{ cursor: 'pointer', textAlign: 'center', margin: '20px' }}>
                        <Tooltip title="Select Avatar">
                            <IconButton
                                style={{
                                    color: colors.iconColor
                                }}
                                component="span">
                                <PhotoCameraIcon />
                            </IconButton>
                        </Tooltip>
                    </label>
                )}

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
                            style={{
                                color: colors.iconColor
                            }}
                        />
                    </div>
                </div>
            )}

            {cropUrl && (
                <>
                    <p className='mb-2'>Preview</p>
                    <Avatar
                        alt="Avatar"
                        src={cropUrl}
                        style={{ width: 100, height: 100 }}
                    />
                </>
            )}

            {avatarUrl && (
                <div className='m-2' style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ margin: '0 8px' }}>
                        <Tooltip title="Save Avatar">
                            <IconButton
                                style={{
                                    color: colors.iconColor
                                }}
                                onClick={handleSaveAvatar}>
                                <SaveIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <div style={{ margin: '0 8px' }}>
                        <Tooltip title="Reset Avatar">
                            <IconButton
                                style={{
                                    color: colors.iconColor
                                }}
                                onClick={handleReset}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfileAvatarSelector;
