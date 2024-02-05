import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../others/LoadingSpinner";
import { useDarkMode } from '../theme/Darkmode';


// dark mode
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


const VerifyLogin = () => {
    const [isValid, setIsValid] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useParams();

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    useEffect(() => {
        const checkLinkExpire = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/verify/login/${token}`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const data = await res.json();

                if (res.ok) {
                    setIsValid(data.isValid);
                    setTimeout(() => { window.location.href = '/login' }, 3000);
                } else {
                    console.log(data.message);
                    setIsValid(false);
                }
            } catch (e) {
                console.log(e);
                setIsValid(false);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            checkLinkExpire();
        } else {
            setIsValid(false);
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div className="text-center mt-3">
            {
                isValid == true
                    ? <>
                        <h2>Your Account is Verified</h2>
                        <Link to="/login">Go to Login</Link>
                    </>
                    : <h2>Link is invalid...</h2>
            }
        </div>
    );
};


export default VerifyLogin;
