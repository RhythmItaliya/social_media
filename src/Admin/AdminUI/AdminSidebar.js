import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import UserGraph from '../AdminTab/UserGraph';
import AdminSearchbar from '../AdminTab/AdminSerchbar';
import AdminPostReportData from '../AdminTab/AdminPostReportData';
import AdminAvatar from '../AdminTab/AdminAvatar';
import { useDarkMode } from '../../theme/Darkmode';
import AdminUserTerminate from '../AdminTab/AdminUserTerminate';
import './admin.css';
import AdminContactUs from '../AdminTab/AdminContactUs';
import AdminBlog from '../AdminTab/AdminBlog';

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

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const { Sider, Content } = Layout;

const AdminSidebar = () => {

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const [selectedTab, setSelectedTab] = useState('1');

    const handleMenuClick = (e) => {
        setSelectedTab(e.key);
    };

    return (
        <Layout className='admin-sidebar'>
            <Sider>
                <Menu theme="dark" className='mt-3 user-select-none' selectedKeys={[selectedTab]} mode="inline" onClick={handleMenuClick}>
                    <Menu.Item key="1">Vortex Analytics</Menu.Item>
                    <Menu.Item key="2">User Details</Menu.Item>
                    <Menu.Item key="3">Default Avatar</Menu.Item>
                    <Menu.Item key="4">Post Report</Menu.Item>
                    <Menu.Item key="5">Account Terminate</Menu.Item>
                    <Menu.Item key="6">Contact Us</Menu.Item>
                    <Menu.Item key="7">Blogs</Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{ margin: '16px' }}>
                    <div>
                        {selectedTab === '1' && (
                            <>
                                <UserGraph colors={colors} />
                            </>
                        )}
                        {selectedTab === '2' && <h1>
                            <>
                                <AdminSearchbar colors={colors} />
                            </>
                        </h1>}
                        {selectedTab === '3' && <h1>
                            <>
                                <AdminAvatar colors={colors} />
                            </>
                        </h1>}
                        {selectedTab === '4' && <h1>
                            <>
                                <AdminPostReportData colors={colors} />
                            </>
                        </h1>}
                        {selectedTab === '5' && <h1>
                            <>
                                <AdminUserTerminate colors={colors} />
                            </>
                        </h1>}
                        {selectedTab === '6' && <h1>
                            <>
                                <AdminContactUs colors={colors} />
                            </>
                        </h1>}
                        {selectedTab === '7' && <h1>
                            <>
                                <AdminBlog colors={colors} />
                            </>
                        </h1>}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminSidebar;