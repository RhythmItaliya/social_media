import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDarkMode } from '../theme/Darkmode';
import config from "../configuration";
import LoadingBar from 'react-top-loading-bar';

import logoImage from '../assets/orkut-logo.png';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
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
    spinnerColor: '#ffffff',
    labelColor: '#CCC',
    valueTextColor: '#ffffff',
    linkColor: '#CCC8',
    hashtagColor: '#8A2BE2',
};

const useVerifyLogin = () => {
    const [isValid, setIsValid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const { token } = useParams();
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    useEffect(() => {
        const checkLinkExpire = () => {
            fetch(`${config.apiUrl}/auth/verify/login/${token}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                onDownloadProgress: progressEvent => {
                    const { loaded, total } = progressEvent;
                    const percent = Math.floor((loaded / total) * 100);
                    console.log("Progress:", percent);
                    setProgress(percent);
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.isValid === 1) {
                        setIsValid(true);
                    } else {
                        setIsValid(false);
                    }
                })
                .catch(error => {
                    console.error(error);
                    setIsValid(false);
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        if (token) {
            checkLinkExpire();
        } else {
            setIsValid(false);
            setLoading(false);
        }
    }, [token]);

    return { isValid, loading, progress };
};

const VerifyLogin = () => {
    const { isValid, loading, progress } = useVerifyLogin();
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!loading) {
                navigate("/login");
            }
        }, 3000);

        return () => clearTimeout(timeout);
    }, [loading, navigate]);

    const getMessage = () => {
        if (loading) {
            return null;
        }

        if (isValid === true) {
            return (
                <>
                    <h2>Your Account Is Verified.</h2>
                    <Link to="/login">Go to Login</Link>
                </>
            );
        } else if (isValid === false) {
            return (
                <>
                    <h2>Your Account Is Verified.</h2>
                    {/* <p>Please make sure you've used the correct verification link.</p> */}
                    {/* <h2> Link Is Invalid.</h2> */}
                    <Link to="/login">Go to Login</Link>

                </>
            );
        } else {
            return (
                <>
                    <h2>An error occurred...</h2>
                    <p>Please try again later.</p>
                </>
            );
        }
    };

    return (
        <>
            <div className="text-center mt-5">
                <img src={logoImage} alt="Logo" className="mb-5 mx-auto d-block user-select-none" style={{ width: '150px' }} />
            </div>
            <div className="text-center">
                <p className="mt-3 text-center" style={{ fontSize: '16px', letterSpacing: '1px' }}>
                    {getMessage()}
                </p>
            </div>

            {loading && <LoadingBar progress={progress} color='#ec1b90' height={3} />}
        </>
    );
};

export default VerifyLogin;
