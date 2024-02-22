import React, { } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import '../Tab/vertical.css';
import { DarkModeProvider } from '../../theme/Darkmode';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import { ChatBubble, Settings } from '@mui/icons-material';
import Chat from '../../Chat/Chat';
import CreatePost from '../../Post/CreatePost';
import ProfileSet from '../Profile/ProfileSet';
import SettingsPage from '../../Settings/Setting';
import Homemix from '../../mixComponet/Homemix';
import Searchmix from '../../mixComponet/Searchmix';
import AddCircleIcon from '@mui/icons-material/AddCircle';
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
                        centered
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        sx={{
                            borderRight: 1,
                            borderColor: 'divider',
                            transform: 'translateY(50%)',

                        }}
                    >
                        <Tab label="Home" icon={<HomeIcon />} {...a11yProps(0)} className="custom-tab" />
                        <Tab label="Account" icon={<AccountCircleIcon />} {...a11yProps(1)} className="custom-tab" />
                        <Tab label="Chat" icon={<ChatBubble />} {...a11yProps(2)} className="custom-tab" />
                        <Tab label="Search" icon={<SearchIcon />} {...a11yProps(3)} className="custom-tab" />
                        <Tab label="Add" icon={<AddCircleIcon />} {...a11yProps(4)} className="custom-tab" />
                        <Tab label="Settings" icon={<Settings />} {...a11yProps(5)} className="custom-tab" />

                    </Tabs>
                </Box>


                {/* small devices */}
                <Box className="horizontalSidebar fixed-bottom d-lg-none d-flex justify-content-center align-items-center">
                    <Tabs
                        orientation="horizontal"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                    >
                        <Tab icon={<HomeIcon />} {...a11yProps(0)} className="custom-tab1" />
                        <Tab icon={<AccountCircleIcon />} {...a11yProps(1)} className="custom-tab1" />
                        <Tab icon={<ChatBubble />} {...a11yProps(2)} className="custom-tab1" />
                        <Tab icon={<SearchIcon />} {...a11yProps(3)} className="custom-tab1" />
                        <Tab icon={<AddCircleIcon />} {...a11yProps(4)} className="custom-tab1" />
                        <Tab icon={<Settings />} {...a11yProps(5)} className="custom-tab1" />
                    </Tabs>
                </Box>

                {/* Inside your render method or functional component */}
                <TabPanel value={value} index={0}>
                    <Homemix />
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <ProfileSet />
                </TabPanel>

                <TabPanel value={value} index={2}>
                    <Chat />
                </TabPanel>

                <TabPanel value={value} index={3}>
                    <Searchmix />
                </TabPanel>

                <TabPanel value={value} index={4}>
                    <div className='d-flex align-items-center justify-content-center overflow-scroll' style={{ height: '100vh' }}>
                        <CreatePost />
                    </div>
                </TabPanel>

                <TabPanel value={value} index={5}>
                    <SettingsPage />
                </TabPanel>

            </Box>
        </DarkModeProvider>
    );
}