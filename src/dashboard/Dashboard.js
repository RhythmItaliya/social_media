import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerticalTabs from './Tab/VerticalTabs';
import { setProfileUuid, setUserUuid, setUserPhoto, setUsername } from '../actions/authActions';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';
import LoadingBar from 'react-top-loading-bar';
// import LinearProgress from '@mui/material/LinearProgress';
import '../App.css';
import { LinearProgress } from '@material-ui/core';

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
                const response = await fetch(`http://localhost:8080/api/users/profileCreated/${uuid}`, {
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
            setError('An error occurred while fetching user data. Please try again.');
            setIsLoading(false);
            setLoadingBarProgress(0);
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
                setDefaultUserPhoto();
                return;
            }

            const photoData = await response.json();
            dispatch(setUserPhoto(photoData.completeImageUrl));
            console.log(photoData.completeImageUrl);
        } catch (error) {
            console.error(error);
            setError('An error occurred while fetching user photo. Please try again.');
        } finally {
            setIsLoading(false);
            setLoadingBarProgress(0);
        }
    };

    const setDefaultUserPhoto = () => {
        const defaultImageUrl = 'https://placekitten.com/200/300';
        dispatch(setUserPhoto(defaultImageUrl));
        console.log(defaultImageUrl);
    };

    return (
        <div className='container-fluid p-0 m-0 overflow-hidden '>
            <div className='row'>
                <LoadingBar progress={loadingBarProgress} height={3} color="#f11946" onLoaderFinished={() => setLoadingBarProgress(0)} />
                {isLoading ? (
                    <div className="d-flex vh-100 overflow-hidden justify-content-center align-content-center">
                        <LinearProgress />
                        <p>Loading...</p>
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