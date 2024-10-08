import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Dialog, DialogContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDarkMode } from '../../theme/Darkmode';
import config from '../../configuration';
import { Link } from 'react-router-dom';


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

function PostProfile() {
    const profileUUID = useSelector(state => state.profileuuid.uuid);
    const [posts, setPosts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    useEffect(() => {
        fetch(`${config.apiUrl}/posts/api/user/posts/profile/${profileUUID}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPosts(data);
                } else {
                    console.error('Invalid response format:', data);
                }
            })
            .catch(error => console.error('Error fetching user posts:', error))
            .finally(() => setLoading(false)); // Update loading state
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
            <div style={{ height: '580px', overflowY: 'auto' }}>
                {loading ? (
                    <Typography>Loading...</Typography>
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
                                No posts found. Share your moments with friends!
                            </Typography>
                        </div>
                        <Link to='/add' style={{ color: colors.labelColor, textDecoration: 'none', textAlign: 'center' }}>Go to Upload</Link>
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
                                        cursor: 'pointer', padding: '5px',
                                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                                    }}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                )}

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
                            style={{ width: '100%', height: '100%', backgroundColor: colors.backgroundColor, userSelect: 'none' }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div >
    );
}

export default PostProfile;
