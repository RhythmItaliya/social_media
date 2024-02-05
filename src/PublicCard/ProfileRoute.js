import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../others/NotFound";
import PublicCard from "./PublicCard";
import { DarkModeProvider } from '../theme/Darkmode';

const ProfileRoute = () => {
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);

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
        return <p>Loading...</p>;
    }

    if (userProfile) {
        const { username, uuid, userProfile: { uuid: profileUUID, profilePhote } } = userProfile;

        console.log('uuid', uuid);
        console.log('Profile uuid', profileUUID);
        console.log('username', username);

        const photoURL = profilePhote?.photoURL;

        console.log('photoURL', photoURL);

        return (
            <DarkModeProvider>
                <PublicCard uuid={uuid} profileUUID={profileUUID} username={username} photoURL={photoURL} />
            </DarkModeProvider>
        );
    } else {
        return <NotFound />;
    }
};

export default ProfileRoute;
