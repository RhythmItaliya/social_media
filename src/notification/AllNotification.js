// AllNotification,js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import config from '../configuration';
import { RefreshSharp } from '@mui/icons-material';
import { Avatar, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

function AllNotification({ colors }) {
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [notificationsUUID, setNotificationsUUID] = useState([]);
    const [notificationsUsername, setNotificationsUsername] = useState({});
    const [newNotificationIds, setNewNotificationIds] = useState([]);

    const navigate = useNavigate();
    const profileUUID = useSelector((state) => state.profileuuid.uuid);

    async function fetchNotifications() {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiUrl}/notifications/all/post/notifications/${profileUUID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            const data = await response.json();
            setNotifications(data.notifications);

            const notificationMessages = data.notifications.map(notification => notification.notificationMessage);
            setNotificationsUUID(notificationMessages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, [profileUUID]);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userData = {};

                for (const message of notificationsUUID) {
                    const response = await fetch(`${config.apiUrl}/notifications/post/notifications/user/${message}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch notifications');
                    }
                    const data = await response.json();

                    userData[message] = {
                        username: data.username,
                        photoURL: data.photoURL
                    };
                }
                setNotificationsUsername(userData);
            } catch (error) {
                console.error(error);
            }
        }

        if (notificationsUUID && notificationsUUID.length > 0) {
            fetchUserData();
        }
    }, [notificationsUUID]);

    async function markAsRead() {
        try {
            const notificationIds = notifications.map(notification => notification.id);
            const response = await fetch(`${config.apiUrl}/notifications/post/notifications/mark/as/read`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationIds })
            });
            if (!response.ok) {
                throw new Error('Failed to mark notifications as read');
            }
            fetchNotifications();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const newIds = notifications.filter(notification => !notification.isRead).map(notification => notification.id);
        setNewNotificationIds(newIds);
    }, [notifications]);

    function getTimeDifference(createdAt) {
        const currentTime = new Date();
        const createdTime = new Date(createdAt);
        const difference = currentTime - createdTime;

        const seconds = Math.floor(difference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) {
            return `${seconds} sec ago`;
        } else if (minutes < 60) {
            return `${minutes} min ago`;
        } else if (hours < 24) {
            return `${hours} hour ago`;
        } else if (days < 7) {
            return `${days} day ago`;
        } else if (weeks < 4) {
            return `${weeks} week ago`;
        } else if (months < 12) {
            return `${months} month ago`;
        } else {
            return `${years} year ago`;
        }
    }

    return (

        <div
            className='mt-5'
            style={{
                width: '100%',
                height: '700px',
                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                overflowY: 'auto'
            }}
        >
            <div className='p-2 d-flex justify-content-between align-items-center' style={{ borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, }}>
                <div className='d-flex align-items-center user-select-none'>
                    <p className='m-2' style={{ color: "#ec1b90", fontSize: '16px', margin: 0 }}>Show All Notification</p>
                </div>
                <div className='d-flex align-items-center gap-2 user-select-none'>
                    <IconButton style={{ color: colors.iconColor }} onClick={fetchNotifications}>
                        <RefreshSharp />
                    </IconButton>
                    {notifications.some(notification => !notification.isRead) && (
                        <Typography style={{ color: colors.textColor, textDecoration: 'underline', cursor: 'pointer', fontSize: '10px' }} onClick={markAsRead}>Mark as Read</Typography>
                    )}
                </div>
            </div>

            {loading && <div className='text-center user-select-none'>
                <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>}

            {!loading && (
                <div>
                    {notifications.length === 0 ? (
                        <div>
                            <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '14px', marginTop: '50px', borderTop: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, padding: '50px', lineHeight: 2 }}>No Recent<span style={{ color: '#ec1b90', fontSize: '16px' }}>Activity</span> Found.</p>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div key={notification.id} className='d-flex justify-content-start align-items-start rounded-1 user-select-none' style={{ borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, cursor: 'pointer', padding: '8px 12px', backgroundColor: newNotificationIds.includes(notification.id) ? 'rgba(255, 114, 186, 0.3)' : colors.backgroundColor }}>
                                <ul className='text-center' style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                    <li className='d-flex align-items-center justify-content-center'>
                                        {notificationsUsername && notificationsUsername[notification.notificationMessage] && notificationsUsername[notification.notificationMessage].photoURL ? (
                                            <Avatar
                                                src={`http://static.profile.local/${notificationsUsername[notification.notificationMessage].photoURL}`}
                                                alt={notificationsUsername[notification.notificationMessage].username}
                                                style={{
                                                    width: '25px',
                                                    height: '25px'
                                                }}
                                            />
                                        ) : (
                                            <Avatar style={{ width: '25px', height: '25px' }} />
                                        )}
                                        <Typography style={{ color: colors.textColor, marginLeft: '8px', fontSize: '12px', textAlign: 'center' }}>
                                            {notification.isPost ? (
                                                <>
                                                    New Post by&nbsp;&nbsp;
                                                    <span className='username' style={{ color: '#ec1b90', fontSize: '14px', cursor: 'pointer' }} onClick={() => navigate(`/${notificationsUsername && notificationsUsername[notification.notificationMessage] && notificationsUsername[notification.notificationMessage].username}`)}>
                                                        {notificationsUsername && notificationsUsername[notification.notificationMessage] && notificationsUsername[notification.notificationMessage].username}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    Your Post Liked by&nbsp;&nbsp;
                                                    <span className='username' style={{ color: '#ec1b90', fontSize: '14px', cursor: 'pointer' }} onClick={() => navigate(`/${notificationsUsername && notificationsUsername[notification.notificationMessage] && notificationsUsername[notification.notificationMessage].username}`)}>
                                                        {notificationsUsername && notificationsUsername[notification.notificationMessage] && notificationsUsername[notification.notificationMessage].username}
                                                    </span>
                                                </>
                                            )}
                                            &nbsp;&nbsp;<span style={{ fontSize: '10px', color: colors.labelColor }}>{getTimeDifference(notification.createdAt)}</span>
                                        </Typography>
                                    </li>
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default AllNotification;