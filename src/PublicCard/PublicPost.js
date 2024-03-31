import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Dialog, DialogContent, Typography } from '@mui/material';
import { useDarkMode } from '../theme/Darkmode';
import config from '../configuration';

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
    linkColor: '#000',
    hashtagColor: 'darkblue',
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
    valueTextColor: '#ffffff',
    linkColor: '#CCC8',
    hashtagColor: '#8A2BE2',
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};


function PublicPost({ profileUUID }) {
    const [posts, setPosts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [accessDenied, setAccessDenied] = useState(false);
    const [loading, setLoading] = useState(true);

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    useEffect(() => {
        fetch(`${config.apiUrl}/api/user/posts/profile/public/${profileUUID}`)
            .then(response => {
                if (response.status === 403) {
                    console.error('Access denied. Users are not friends.');
                    setAccessDenied(true);
                    setLoading(false);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                setLoading(false);
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error('Invalid response format:', data);
                }
            })
            .catch(error => {
                setLoading(false);
                console.error('Error fetching user posts:', error);
            });
    }, [profileUUID]);

    const handleImageClick = (item) => {
        setSelectedImage(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div className='user-select-none'>
            <div style={{ height: '600px', overflowY: 'auto' }}>
                {loading ? (
                    <Typography>
                        <div className="loading-dots">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </Typography>
                ) : accessDenied ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '400px',
                    }}>
                        <div className='w-100 h-25 rounded-2 text-center'
                            style={{
                                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                                color: colors.textColor,
                                fontSize: '16px',
                                padding: '10px',
                                marginBottom: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Typography style={{ color: colors.textColor }}>
                                Access denied. To view posts, become friends.
                            </Typography>
                        </div>
                    </div>
                ) : posts.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '400px',
                    }}>
                        <div className='w-100 h-25 rounded-2 text-center'
                            style={{
                                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                                color: colors.textColor,
                                fontSize: '16px',
                                padding: '10px',
                                marginBottom: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <Typography style={{ color: colors.textColor }}>
                                No posts found.
                            </Typography>
                        </div>
                    </div>
                ) : (
                    <ImageList
                        sx={{
                            width: '100%',
                            height: '100%',
                            transform: 'translateZ(0)',
                            backgroundColor: colors.backgroundColor,
                            padding: '10px'
                        }}
                        rowHeight={300}
                        gap={15}
                    >
                        {posts.map((post) => (
                            <ImageListItem key={post.id}>
                                <img
                                    src={`http://static.post.local/${post.postUploadURLs}`}
                                    alt={post.title}
                                    loading="lazy"
                                    onClick={() => handleImageClick(post)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '5px',
                                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                                    }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                )}
            </div>
            {/* Modal */}
            <Dialog open={modalOpen} onClose={handleCloseModal}>
                <DialogContent style={{
                    border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                    backgroundColor: colors.backgroundColor
                }}>
                    <img
                        src={`http://static.post.local/${selectedImage?.postUploadURLs}`}
                        alt={selectedImage?.title}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', backgroundColor: colors.backgroundColor }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default PublicPost;