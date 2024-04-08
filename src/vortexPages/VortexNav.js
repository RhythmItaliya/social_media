import React, { useEffect, useState } from 'react';
import logoImage from '../assets/vortex.png';
import { Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import GavelIcon from '@mui/icons-material/Gavel';
import { IconButton, Drawer } from '@mui/material'; // Added Drawer
import MenuIcon from '@mui/icons-material/Menu'; // Added MenuIcon

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

const VortexNav = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const savedMode = localStorage.getItem('mode');
        setIsDarkMode(savedMode === 'dark');
    }, []);

    useEffect(() => {
        localStorage.setItem('mode', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const colors = isDarkMode ? darkModeColors : lightModeColors;

    return (
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: colors.backgroundColor, zIndex: 1000, border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', marginLeft: '10px', marginRight: '10px' }}>

                {/* Vortex Logo */}
                <div className='d-flex justify-content-center align-content-center'>
                    <Link to={'/home'}>
                        <img src={logoImage} alt="Vortex" style={{ width: '150px', height: 'auto', borderRadius: '5px' }} />
                    </Link>
                </div>

                {/* Menu Icon for Drawer */}
                {windowWidth <= 991.99 && (
                    <IconButton onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Sidebar Drawer */}
                <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
                    <div style={{ width: 250 }}>
                        {/* Links */}
                        <div style={{ padding: '12px', marginTop: '15px' }}>
                            <div>
                                <span style={{ color: colors.textColor, fontSize: '12px', display: windowWidth <= 991.99 ? 'block' : 'none' }}>
                                    <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                        <Link to="/login" style={{ color: '#ec1b90', margin: '8px' }}>Login</Link>
                                    </IconButton>
                                </span>
                                <span style={{ color: colors.textColor, fontSize: '12px', display: windowWidth <= 991.99 ? 'block' : 'none' }}>
                                    <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                        <Link to="/register" style={{ color: '#ec1b90', margin: '8px' }}>Register</Link>
                                    </IconButton>
                                </span>

                                <span style={{ color: colors.textColor, fontSize: '12px', display: windowWidth <= 991.99 ? 'block' : 'none' }}>
                                    <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                        {/* <InfoIcon style={{ color: colors.iconColor, margin: '8px' }} /> */}
                                        <Link to="/about-us" style={{ color: '#ec1b90', textDecoration: 'none' }}>Our Blog</Link>
                                    </IconButton>
                                </span>
                                <span style={{ color: colors.textColor, fontSize: '12px', display: windowWidth <= 991.99 ? 'block' : 'none' }}>
                                    <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                        {/* <ContactSupportIcon style={{ color: colors.iconColor, margin: '8px' }} /> */}
                                        <Link to="/contact-us" style={{ color: '#ec1b90', textDecoration: 'none' }}>Contact Us</Link>
                                    </IconButton>
                                </span>
                                <span style={{ color: colors.textColor, fontSize: '12px', display: windowWidth <= 991.99 ? 'block' : 'none' }}>
                                    <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                        {/* <GavelIcon style={{ color: colors.iconColor, margin: '8px' }} /> */}
                                        <Link to="/terms-and-conditions" style={{ color: '#ec1b90', textDecoration: 'none' }}> Terms and Conditions</Link>
                                    </IconButton>
                                </span>
                            </div>
                        </div>
                        {/* Dark Mode Toggle */}
                        {/* <div style={{ position: 'absolute', bottom: 0 }}>
                            <IconButton onClick={toggleDarkMode} style={{ borderRadius: 0, fontSize: '16px' }}>
                                {isDarkMode ? <Brightness4Icon style={{ color: colors.iconColor, margin: '8px' }} /> : <Brightness7Icon style={{ color: colors.iconColor, margin: '8px' }} />}
                            </IconButton>
                        </div> */}
                    </div>
                </Drawer>

                {/* Navigation Links */}
                {windowWidth > 991.99 && (
                    <div className='d-flex justify-content-center align-content-center gap-4' style={{ cursor: 'pointer' }}>
                        <div>
                            <span style={{ color: colors.textColor, fontSize: '12px' }}>
                                <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                    <Link to="/login" style={{ color: '#ec1b90', margin: '8px' }}>Login</Link>
                                </IconButton>
                            </span>
                            <span style={{ color: colors.textColor, fontSize: '12px' }}>
                                <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                    <Link to="/register" style={{ color: '#ec1b90', margin: '8px' }}>Register</Link>
                                </IconButton>
                            </span>

                            <span style={{ color: colors.textColor, fontSize: '12px' }}>
                                <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                    {/* <InfoIcon style={{ color: colors.iconColor, margin: '8px' }} /> */}
                                    <Link to="/about-us" style={{ color: '#ec1b90', textDecoration: 'none' }}>Our Blogs</Link>
                                </IconButton>
                            </span>
                            <span style={{ color: colors.textColor, fontSize: '12px' }}>
                                <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                    {/* <ContactSupportIcon style={{ color: colors.iconColor, margin: '8px' }} /> */}
                                    <Link to="/contact-us" style={{ color: '#ec1b90', textDecoration: 'none' }}>Contact Us</Link>
                                </IconButton>
                            </span>
                            <span style={{ color: colors.textColor, fontSize: '12px' }}>
                                <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                    {/* <GavelIcon style={{ color: colors.iconColor, margin: '8px' }} /> */}
                                    <Link to="/terms-and-conditions" style={{ color: '#ec1b90', textDecoration: 'none' }}> Terms and Conditions</Link>
                                </IconButton>
                            </span>
                        </div>

                        {/* Dark Mode Toggle */}
                        {/* <div>
                            <span onClick={toggleDarkMode} style={{ color: colors.textColor, fontSize: '12px' }}>
                                <IconButton style={{ borderRadius: 0, fontSize: '16px' }}>
                                    {isDarkMode ? <Brightness4Icon style={{ color: colors.iconColor, margin: '8px' }} /> : <Brightness7Icon style={{ color: colors.iconColor, margin: '8px' }} />}
                                </IconButton>
                            </span>
                        </div> */}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default VortexNav;
