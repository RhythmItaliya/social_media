import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../others/NotFound";
import PublicCard from "./PublicCard";
import { DarkModeProvider, useDarkMode } from '../theme/Darkmode';
import CryptoJS from 'crypto-js';
import LoadingBar from "react-top-loading-bar";

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
    const [userProfile, setUserProfile] = useState(null);
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;
    const [isdecryptedUuid, setDecryptedUuid] = useState(null);
    const encryptionKey = 'ASDCFVBNLKMNBSDFVBNJNBCV';
    const loadingBarRef = useRef(null);

    useEffect(() => {
        const fetchDecryptedUuid = async () => {
            try {
                const encryptedUuidCookie = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('token='))
                    .split('=')[1];

                const decryptedUuidBytes = CryptoJS.AES.decrypt(encryptedUuidCookie, encryptionKey);
                const decryptedUuid = decryptedUuidBytes.toString(CryptoJS.enc.Utf8);
                setDecryptedUuid(decryptedUuid);
            } catch (error) {
                console.error('Error decrypting UUID:', error);
                setDecryptedUuid(null);
            }
        };

        fetchDecryptedUuid();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (loadingBarRef.current) {
                loadingBarRef.current.continuousStart();
            }

            try {
                const response = await fetch(`http://localhost:8080/${username}`);
                const data = await response.json();

                setUserProfile(data.user);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setUserProfile(null);
            } finally {
                if (loadingBarRef.current) {
                    loadingBarRef.current.complete();
                }
            }
        };

        fetchData();

        return () => {
            if (loadingBarRef.current) {
                loadingBarRef.current.complete();
            }
        };
    }, [username]);

    if (userProfile === null) {
        return (
            <div>
                <LoadingBar
                    ref={loadingBarRef}
                    height={3}
                    color="#f11946"
                />
                <NotFound />
            </div>
        );
    }

    if (userProfile && userProfile.uuid) {
        const { username, uuid, userProfile: { uuid: profileUUID, profilePhoto } } = userProfile;
        const photoURL = profilePhoto?.photoURL;

        return (
            <DarkModeProvider>
                <PublicCard userUUID={isdecryptedUuid} uuid={uuid} profileUUID={profileUUID} username={username} photoURL={photoURL} colors={colors} loading={false} />
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