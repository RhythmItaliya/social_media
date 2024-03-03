import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../others/NotFound";
import PublicCard from "./PublicCard";
import { DarkModeProvider, useDarkMode } from '../theme/Darkmode';

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
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    useEffect(() => {
        setLoading(true);

        fetch(`http://localhost:8080/${username}`)
            .then(response => response.json())
            .then(data => {
                setUserProfile(data.user);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
                setUserProfile(null);
                setLoading(false);
            });
    }, [username]);

    if (loading) {
        return <p style={{ color: colors.textColor }}>Loading...</p>;
    }

    if (userProfile) {
        const { username, uuid, userProfile: { uuid: profileUUID, profilePhote } } = userProfile;

        console.log('uuid', uuid);
        console.log('Profile uuid', profileUUID);
        console.log('username', username);

        const photoURL = profilePhote?.photoURL;

        console.log('photoURL', photoURL);

        return (
            <>
                <DarkModeProvider>
                    <PublicCard uuid={uuid} profileUUID={profileUUID} username={username} photoURL={photoURL} colors={colors} loading={loading} />
                </DarkModeProvider>
            </>
        );
    } else {
        return <NotFound />;
    }
};

export default ProfileRoute;
