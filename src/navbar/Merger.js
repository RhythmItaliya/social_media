// Merger.jsx
import React from 'react';
import { Grid, } from '@mui/material';
import ReceiverComponent from './ReceiverComponent';
import { useDarkMode } from '../theme/Darkmode';
import SuggestedFriends from '../friendabout/SuggestedFriends';
import './Merger.css';

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
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

function Merger() {

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg-6 d-flex align-items-center justify-content-center'>
                    <div className='col-lg-8 mx-auto'>
                        <SuggestedFriends colors={colors} />
                    </div>
                </div>

                <div className='col-lg-6 d-flex align-items-center justify-content-center'>
                    <div className='col-lg-6 mx-auto'>
                        <ReceiverComponent colors={colors} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Merger;