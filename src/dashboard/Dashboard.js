import React, { useState, useEffect } from 'react';
import VerticalTabs from './Tab/VerticalTabs';
import { setProfileUuid, setUserUuid, setUserPhoto } from '../actions/authActions';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [cookies] = useCookies(['token']);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulating data fetching with a 2-second delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                setIsLoading(false); // Set loading to false after data fetching
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false); // Set loading to false in case of an error
            }
        };
        fetchData();
    }, []);

    // user uuid
    useEffect(() => {
        const decryptToken = async () => {
            try {
                const encryptedUuid = cookies.token;

                if (encryptedUuid) {
                    const decryptedBytes = CryptoJS.AES.decrypt(encryptedUuid, 'ASDCFVBNLKMNBSDFVBNJNBCV');
                    const uuid = decryptedBytes.toString(CryptoJS.enc.Utf8);
                    dispatch(setUserUuid(uuid));
                    await fetchUserData(uuid);
                    console.log('User UUID:', uuid);
                }
            } catch (error) {
                console.error('Error decrypting token:', error);
                setIsLoading(false); // Set loading to false in case of an error
            }
        };

        decryptToken();
    }, [dispatch, cookies.token]);

    // profile uuid
    const fetchUserData = async (uuid) => {
        try {
            const response = await fetch(`http://localhost:8080/users/${uuid}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Request failed');
                throw new Error('Request failed');
            }

            const data = await response.json();

            await fetchUserPhoto(data.userProfile.uuid);

            dispatch(setProfileUuid(data.userProfile.uuid));
            console.log('Profile UUID:', data.userProfile.uuid);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setIsLoading(false); // Set loading to false in case of an error
        }
    };

    const fetchUserPhoto = async (profileUuid) => {
        try {
            const response = await fetch(`http://localhost:8080/profile/profilePhoto/${profileUuid}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Request failed');
                throw new Error('Request failed');
            }

            const photoData = await response.json();
            dispatch(setUserPhoto(photoData.completeImageUrl));
            console.log(photoData.completeImageUrl);
        } catch (error) {
            console.error(error);
            setIsLoading(false); // Set loading to false in case of an error
        }
    };

    return (
        <div className='container-fluid p-0 m-0 overflow-hidden '>
            <div className='row'>
                {isLoading ? (
                    // Display a loading indicator or message while data is loading
                    <p>Loading...</p>
                ) : (
                    // Render the VerticalTabs component once the data is loaded
                    <VerticalTabs />
                )}
            </div>
        </div>
    );
}

export default Dashboard;