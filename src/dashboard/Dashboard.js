import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerticalTabs from './Tab/VerticalTabs';
import { setProfileUuid, setUserUuid, setUserPhoto, setUsername } from '../actions/authActions';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import LoadingBar from 'react-top-loading-bar';
import config from '../configuration';
import logoImage from '../assets/vortex.png';
import { useDarkMode } from '../theme/Darkmode';

import '../dashboard/Tab/vertical.css';
import '../App.css';

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
    transparentColor: 'rgba(255, 255, 255, 0.5)'
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
    transparentColor: 'rgba(255, 255, 255, 0.5)'
  };
  
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };


const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingBarProgress, setLoadingBarProgress] = useState(0);
    const [error, setError] = useState(null);
    const [cookies] = useCookies(['token']);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const savedUsername = Cookies.get('username');
        if (savedUsername) {
            dispatch(setUsername(savedUsername));
        }
    }, [dispatch]);

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingBarProgress(50);
                await new Promise(resolve => setTimeout(resolve, 2000));

                const savedUsername = Cookies.get('username');
                if (savedUsername) {
                    dispatch(setUsername(savedUsername));
                }

                const encryptedUuid = cookies.token;
                if (encryptedUuid) {
                    setLoadingBarProgress(25);
                    const decryptedBytes = CryptoJS.AES.decrypt(encryptedUuid, 'ASDCFVBNLKMNBSDFVBNJNBCV');
                    const uuid = decryptedBytes.toString(CryptoJS.enc.Utf8);
                    dispatch(setUserUuid(uuid));
                    await fetchUserData(uuid);
                    await fetchProfileCreatedStatus(uuid);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data. Please try again.');
            } finally {
                setIsLoading(false);
                setLoadingBarProgress(100);
            }
        };

        const fetchProfileCreatedStatus = async (uuid) => {
            try {
                const response = await fetch(`${config.apiUrl}/create/api/users/profileCreated/${uuid}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    console.error('Request failed');
                    throw new Error('Request failed');
                }

                const profileData = await response.json();

                if (profileData) {
                    if (profileData.profileCreated === false) {
                        await fetchAdditionalData(uuid);
                        navigate('/profile/create');
                    } else {
                        navigate('/home');
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('An error occurred while fetching data. Please try again.');
            } finally {
                setIsLoading(false);
                setLoadingBarProgress(100);
            }
        };

        const fetchAdditionalData = async (uuid) => {
            await fetchUserPhoto(uuid);
        };

        fetchData();
    }, [dispatch, cookies.token, navigate]);

    const fetchUserData = async (uuid) => {
        try {
            const response = await fetch(`${config.apiUrl}/users/users/${uuid}`, {
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
            setError('An error occurred while fetching user data. Please try again.');
            setIsLoading(false);
            setLoadingBarProgress(0);
        }
    };

    const fetchUserPhoto = async (profileUuid) => {
        try {
            const response = await fetch(`${config.apiUrl}/photos/profile/profilePhoto/${profileUuid}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error('Request failed');
                setDefaultUserPhoto();
                return;
            }

            const photoData = await response.json();
            dispatch(setUserPhoto(photoData.completeImageUrl));

        } catch (error) {
            console.error(error);
            setError('An error occurred while fetching user photo. Please try again.');
        } finally {
            setIsLoading(false);
            setLoadingBarProgress(0);
        }
    };

    const setDefaultUserPhoto = async () => {
        try {
            const response = await fetch(`${config.apiUrl}/admins/get/defaultAvatar`);
            const data = await response.json();

            if (!data.success) {
                console.error('Failed to fetch default avatar URL');
                return;
            }
            const defaultImageUrl = data.avatarURL;
            dispatch(setUserPhoto(defaultImageUrl));
        } catch (error) {
            console.error('Error fetching default avatar URL:', error);
        }
    };

    return (
        <div className='container-fluid p-0 m-0 overflow-hidden' style={{ backgroundColor: colors.backgroundColor }}>
            <div className='row'>
                <LoadingBar progress={loadingBarProgress} height={3} color="#ec1b90" onLoaderFinished={() => setLoadingBarProgress(0)} />
                {isLoading ? (
                    <div className="d-flex overflow-hidden justify-content-center align-items-center" style={{ minHeight: '100vh' }}>

                        <div className="m-2 loading-dots">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>

                        <img src={logoImage} alt="Logo" className="user-select-none" style={{ width: '250px', height: 'auto' }} />

                        <div className="m-2 loading-dots">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>

                    </div>
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : (
                    <VerticalTabs />
                )}
            </div>
        </div>

    );
}

export default Dashboard;