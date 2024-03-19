import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotFound from "../others/NotFound";
import PublicCard from "./PublicCard";
import { DarkModeProvider, useDarkMode } from '../theme/Darkmode';
import CryptoJS from 'crypto-js';
import LoadingBar from "react-top-loading-bar";
import config from "../configuration";

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

const ProfileRoute = () => {
    const { username } = useParams();
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [isdecryptedUuid, setDecryptedUuid] = useState(null);
    const [responseStatus, setResponseStatus] = useState(null);
    const encryptionKey = 'ASDCFVBNLKMNBSDFVBNJNBCV';

    const navigate = useNavigate();
    const loadingBarRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${config.apiUrl}/${username}`);
                setResponseStatus(response.status);
                if (!response.ok) {
                    const timeout = setTimeout(() => {
                        navigate('/login');
                    }, 4000);
                    return () => clearTimeout(timeout);
                    throw new Error('User not found');
                }

                const tokenCookie = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('token='));
                if (!tokenCookie) {
                    const timeout = setTimeout(() => {
                        navigate('/login');
                    }, 4000);
                    return () => clearTimeout(timeout);
                    throw new Error('Token cookie not found. Please log in.');
                }

                const data = await response.json();
                if (response.status === 202 && data.success) {
                    const profileResponse = await fetch(`${config.apiUrl}/found/${username}`);
                    const profileData = await profileResponse.json();
                    setUserProfile(profileData.user);
                } else {
                    setUserProfile(null);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUserProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            setLoading(true);
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
        };
    }, [username, navigate, loadingBarRef]);

    useEffect(() => {
        if (responseStatus === 202) {
            const fetchDecryptedUuid = async () => {
                try {
                    const encryptedUuidCookie = document.cookie
                        .split('; ')
                        .find((row) => row.startsWith('token='))
                        ?.split('=')[1];

                    if (!encryptedUuidCookie) {
                        const timeout = setTimeout(() => {
                            navigate('/login');
                        }, 4000);
                        return () => clearTimeout(timeout);
                        throw new Error('Token cookie not found. Please log in.');
                    }

                    const decryptedUuidBytes = CryptoJS.AES.decrypt(encryptedUuidCookie, encryptionKey);
                    const decryptedUuid = decryptedUuidBytes.toString(CryptoJS.enc.Utf8);
                    setDecryptedUuid(decryptedUuid);
                } catch (error) {
                    console.error('Error decrypting UUID:', error);
                    setDecryptedUuid(null);
                }
            };

            fetchDecryptedUuid();
        }
    }, [responseStatus, encryptionKey, navigate]);

    if (loading) {
        return (
            <div>
                <LoadingBar
                    ref={loadingBarRef}
                    height={3}
                    color="#ec1b90"
                />
                <p style={{ color: colors.textColor, textAlign: 'center' }}>
                    <div className="loading-dots">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </p>
            </div>
        );
    }

    if (responseStatus === 404) {
        return (
            <div>
                <NotFound />
            </div>
        );
    }

    if (responseStatus === 202 && !isdecryptedUuid) {
        return (
            <div>
                <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '20px' }}>Please log in to view this profile.</p>
            </div>
        );
    }

    if (userProfile && userProfile.uuid) {
        const { username, uuid, userProfile: { uuid: profileUUID, profilePhoto } } = userProfile;
        const photoURL = profilePhoto?.photoURL;

        return (
            <DarkModeProvider>
                <PublicCard userUUID={isdecryptedUuid} uuid={uuid} profileUUID={profileUUID} username={username} photoURL={photoURL} colors={colors} loading={true} />
            </DarkModeProvider>
        );
    } else {
        return (
            <div>
                <NotFound />
            </div>
        );
    }
};

export default ProfileRoute;