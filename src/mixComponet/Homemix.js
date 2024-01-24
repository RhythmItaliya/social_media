import Profilebar from "../navbar/ProfileBar";
import Post from '../Post/Post';
import FriendPost from '../Post/FriendPost';
import SenderComponent from "../navbar/SenderComponent";

import React, { useState } from 'react';
import { Grid, Tabs, Tab } from '@mui/material';


const Homemix = () => {

    const [value2, setValue2] = useState(0);

    const handleChange2 = (event, newValue2) => {
        setValue2(newValue2);
    };


    return (
        <>
            <Profilebar />

            <div className="grid-container">
                <Grid item xs={12} lg={6} className='mx-auto justify-content-center d-flex'>
                    <div>
                        <div className='justify-content-center align-content-center d-flex'>
                            <Tabs
                                value={value2}
                                onChange={handleChange2}
                            >
                                <Tab
                                    label="Show Post"
                                    style={{
                                        fontSize: '12px',
                                    }}
                                />
                                <Tab
                                    label="Show Friend Post"
                                    style={{
                                        fontSize: '12px',
                                    }}
                                />
                            </Tabs>
                        </div>
                        <div className="tab-content">
                            {value2 === 0 && <Post />}
                            {value2 === 1 && <FriendPost />}
                        </div>
                    </div>
                </Grid>

                <Grid item xs={12} lg={3} className='mx-auto justify-content-center d-flex'>
                    <div className="sender-component">
                        <SenderComponent />
                    </div>
                </Grid>
            </div>
        </>
    );
};

export default Homemix;
