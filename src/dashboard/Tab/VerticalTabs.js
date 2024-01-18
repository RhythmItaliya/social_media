import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../Tab/vertical.css';
import Profile from './Proflie';


import SearchAppBar from '../../navbar/Searchbar';

import { Grid } from '@mui/material';
import Merger from '../../navbar/Merger';
import Profilebar from '../../navbar/ProfileBar';

import { DarkModeProvider } from '../../theme/Darkmode';

import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import SenderComponent from '../../navbar/SenderComponent';

import { CreateSharp } from '@mui/icons-material';
import Chat from '../../Chat.js/Chat';
import Post from '../../Post/Post'
import CreatePost from '../../Post/CreatePost';
import ProfileSet from '../Profile/ProfileSet';



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            className='full-screen'
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{
                    height: '100vh',
                }}>
                    {/* Set the background color for the TabPanel content */}
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
    spinnerColor: 'rgb(0,0,0)',
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    focusColor: '#ffffff',
    border: '#333333',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
    spinnerColor: '#ffffff',
};

export default function VerticalTabs() {
    const [value, setValue] = React.useState(0);


    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <DarkModeProvider>
            <Box
                sx={{
                    display: 'flex',
                }}
            >

                {/* Display sidebar only on large devices */}
                <Box className="verticalSidebar d-none d-lg-block d-flex flex-column justify-content-center align-items-center">
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{
                            borderRight: 1,
                            borderColor: 'divider',
                            marginTop: '100%',
                            transform: 'translateY(100%)',

                        }}
                    >
                        <Tab icon={<HomeIcon />} {...a11yProps(0)} className="custom-tab" />
                        <Tab icon={<AccountCircleIcon />} {...a11yProps(1)} className="custom-tab" />
                        <Tab icon={<SearchIcon />} {...a11yProps(2)} className="custom-tab" />
                        <Tab icon={<AccountBoxIcon />} {...a11yProps(3)} className="custom-tab" />
                        <Tab icon={<CreateSharp />} {...a11yProps(4)} className="custom-tab" />
                        <Tab icon={<CreateSharp />} {...a11yProps(5)} className="custom-tab" />


                        {/* <Logout /> */}
                        {/* <Layout /> */}
                    </Tabs>
                </Box>


                {/* small devices */}
                <Box className="horizontalSidebar fixed-bottom d-lg-none d-flex justify-content-center align-items-center">
                    <Tabs
                        orientation="horizontal"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                    >
                        <Tab icon={<HomeIcon />} {...a11yProps(0)} className="custom-tab" />
                        <Tab icon={<AccountCircleIcon />} {...a11yProps(1)} className="custom-tab" />
                        <Tab icon={<SearchIcon />} {...a11yProps(2)} className="custom-tab" />
                        <Tab icon={<AccountBoxIcon />} {...a11yProps(3)} className="custom-tab" />
                        <Tab icon={<CreateSharp />} {...a11yProps(4)} className="custom-tab" />
                        <Tab icon={<CreateSharp />} {...a11yProps(5)} className="custom-tab" />

                    </Tabs>
                </Box>

                {/* Use full width on all devices */}
                <TabPanel value={value} index={0}>

                    <Profilebar />
                    <div className="grid-container">
                        <Grid item xs={12} lg={6} className='mx-auto justify-content-center bg-info d-flex'>
                            <Post />
                        </Grid>

                        <Grid item xs={12} lg={3} className='mx-auto justify-content-center d-flex'>
                            <div>
                                <SenderComponent />
                            </div>
                        </Grid>

                    </div>
                </TabPanel>

                <TabPanel value={value} index={1}>
                    {/* <Profile /> */}
                    <ProfileSet />
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <SearchAppBar />
                    <Merger />
                </TabPanel>

                <TabPanel value={value} index={3}>
                    {/* <ProfileSet /> */}
                </TabPanel>

                <TabPanel value={value} index={4}>
                    <Chat />
                </TabPanel>

                <TabPanel value={value} index={5}>
                    <div className='d-flex align-items-center justify-content-center overflow-scroll' style={{ height: '100vh' }}>
                        <CreatePost />
                    </div>
                </TabPanel>
            </Box>
        </DarkModeProvider>
    );
}
