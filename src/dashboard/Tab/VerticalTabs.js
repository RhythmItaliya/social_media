import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../Tab/vertical.css';
import Logout from "../../others/Logout";
import Profile from './Proflie';
import Settings from './Settings';
import Profilephoto from './ProfilePhoto';
import Post from './Post';

import Logo from '../../assets/Millie.png'
import SearchAppBar from '../../navbar/Searchbar';
import TitlebarImageList from '../../navbar/Gallery';
import QuiltedImageList from '../../navbar/Gallery';
import { Grid } from '@mui/material';
import Merger from '../../navbar/Merger';
import Profilebar from '../../navbar/ProfileBar';
import Layout from '../../theme/Layout';
import { DarkModeProvider } from '../../theme/Darkmode';

import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import AccountBoxIcon from '@material-ui/icons/AccountBox';



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

                    </Tabs>
                </Box>

                {/* Use full width on all devices */}
                <TabPanel value={value} index={0}>
                    <Profilebar />
                    <div className='col-lg-12 mx-auto justify-content-center d-flex'>
                        <Post />
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Profile />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <SearchAppBar />
                    <Merger />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    {/* Your content for the "Account" tab */}
                </TabPanel>
            </Box>
        </DarkModeProvider>
    );
}
