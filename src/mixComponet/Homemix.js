import React, { useState } from 'react';
import { Grid, Tabs, Tab } from '@mui/material';
import Profilebar from "../navbar/ProfileBar";
import Post from '../Post/Post';
import FriendPost from '../Post/FriendPost';
import StoryList from '../Story/StoryList';
import './mix.css';
import { useDarkMode } from '../theme/Darkmode';


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
// border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)` 

const Homemix = () => {

    // Dark mode
    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const [value2, setValue2] = useState(0);
    const [isStoryVisible, setIsStoryVisible] = useState(false);

    const handleChange2 = (event, newValue2) => {
        setValue2(newValue2);
    };

    const toggleStoryVisibility = () => {
        setIsStoryVisible(!isStoryVisible);
    };


    return (

        <>
            <div className="overflow-hidden" style={{ height: '100vh' }}>
                {/* Render Profilebar only once */}
                <Profilebar toggleStoryVisibility={toggleStoryVisibility} />

                {/* Conditionally render Story */}
                {isStoryVisible && (
                    <div className={`story-container w-50 mx-auto visible smooth-visible-transition smooth-width-transition`}>
                        <StoryList colors={colors} />
                    </div>
                )}

                <div className="grid-container">
                    <Grid item xs={12} lg={6} className='mx-auto justify-content-center d-flex'>
                        <div>
                            <div className='justify-content-center align-content-center d-flex'>
                                <Tabs
                                    value={value2}
                                    onChange={handleChange2}
                                >
                                    <Tab
                                        label="Show Friend Post"
                                        style={{
                                            fontSize: '12px',
                                        }}
                                    />
                                    <Tab
                                        label="Show Your Post"
                                        style={{
                                            fontSize: '12px',
                                        }}
                                    />
                                </Tabs>
                            </div>
                            <div className="tab-content">
                                {value2 === 0 && <FriendPost />}
                                {value2 === 1 && <Post />}
                            </div>
                        </div>
                    </Grid>

                    <Grid item xs={12} lg={3} className='mx-auto justify-content-center d-flex'>
                        <div className="sender-component">
                            {/* <SenderComponent /> */}
                        </div>
                    </Grid>
                </div>
            </div>
        </>
    );
};

export default Homemix;
