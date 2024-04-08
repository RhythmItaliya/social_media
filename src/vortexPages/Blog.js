import React, { useEffect, useState } from 'react';
import VortexNav from './VortexNav';

import './vortexnav.css';
import BlogPost from './Blog/BlogPost';

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

const Blog = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('mode');
        setIsDarkMode(savedMode === 'dark');
    }, []);

    useEffect(() => {
        localStorage.setItem('mode', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const colors = isDarkMode ? darkModeColors : lightModeColors;

    return (
        <>
            <div>
                <VortexNav />
            </div>
            <div style={{ marginTop: '100px', backgroundColor: colors.backgroundColor }}>
                <BlogPost colors={colors} />
            </div>
            <div>
            </div>
        </>
    );
}

export default Blog;