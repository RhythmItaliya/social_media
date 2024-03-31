import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import logoImage from '../../assets/vortex.png';

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const ProfilePageNav = ({ colors }) => {
    const [cookies, setCookie] = useCookies(['username']);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const savedUsername = cookies.username;
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, [cookies.username]);

    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: colors.backgroundColor, zIndex: 1000, border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginLeft: '10px', marginRight: '10px' }}>
                <div className='d-flex justify-content-center align-content-center'>
                    <img src={logoImage} alt="Logo" style={{ width: '220px', height: 'auto', borderRadius: '5px' }} />
                </div>

                <div className='d-flex justify-content-center align-content-center'>
                    <p style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '18px', marginTop: '10px' }}>welcome, <span style={{ color: colors.textColor, fontSize: '22px', fontWeight: '400' }}>{username}</span></p>
                </div>

            </div>
        </nav>
    );
};

export default ProfilePageNav;
