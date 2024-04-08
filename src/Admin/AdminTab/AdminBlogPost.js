import React, { useState, useRef } from 'react';
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


const AdminBlogPost = ({ colors, imageData }) => {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [zoom, setZoom] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);
    const editorRef = useRef(null);

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setLoading(true);

            const base64String = new FileReader();
            base64String.onloadend = () => {
                setAvatarUrl(base64String.result);
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
            resizedCanvas.width = 900;
            resizedCanvas.height = 400;
            const ctx = resizedCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, 900, 400);

            const resizedBase64 = resizedCanvas.toDataURL('image/png');
            imageData(resizedBase64);
        }
    };

    const handleSaveAvatar = () => {
        setLoading(true);

        if (editorRef.current) {
            const canvas = editorRef.current.getImage();
            const resizedCanvas = document.createElement('canvas');
            resizedCanvas.width = 900;
            resizedCanvas.height = 400;
            const ctx = resizedCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, 900, 400);

            const resizedBase64 = resizedCanvas.toDataURL('image/png');
            imageData(resizedBase64);
            setAvatarUrl(resizedBase64);
            setLoading(false);
            setError(null);
            setSaved(true); // Mark as saved
        }
    };

    const handleReset = () => {
        setAvatarUrl('');
        setZoom(1);
        setLoading(false);
        setError(null);
        setSaved(false); // Reset saved status
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}} className='rounded-2'>
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

                    {!avatarUrl && !saved && (
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

                {(avatarUrl || saved) && (
                    <div>
                        <AvatarEditor
                            ref={editorRef}
                            image={avatarUrl}
                            width={900}
                            height={400}
                            border={50}
                            color={[255, 255, 255, 0.6]}
                            scale={zoom}
                            rotate={0}
                            style={{ display: saved ? 'none' : 'block' }}
                        />
                        {!saved && (
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
                        )}
                    </div>
                )}

                {(avatarUrl || saved) && !saved && (
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

                {saved && (
                    <div>
                        <div className='d-flex justify-content-end '>
                            <IconButton
                                style={{
                                    color: colors.iconColor
                                }}
                                onClick={handleReset}>
                                <RefreshIcon />
                            </IconButton>
                        </div>
                        <div>
                            <img src={avatarUrl} alt="Avatar" style={{ width: 900, height: 400, display: saved ? 'block' : 'none' }} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminBlogPost;
