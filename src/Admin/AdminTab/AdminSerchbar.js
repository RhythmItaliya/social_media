import React, { useState, useEffect } from 'react';
import { Avatar, Input, List, Table, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './chart.css';
import config from '../../configuration';
import LoadingBar from 'react-top-loading-bar';

const { Item } = List;

const AdminSearchbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [loading, setLoading] = useState(false);


    const handleSearch = async (value) => {
        setSearchQuery(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${config.apiUrl}/admins/admin/profile/search/${searchQuery}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSearchResults(data.users);
            } catch (error) {
                console.error('Error fetching data:', error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            fetchData();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleUserSelect = async (username) => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/admins/admin/profile/${username}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const userData = await response.json();
            setSelectedUserData(userData);
            setSearchQuery('');
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: ['user', 'username'],
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'email',
        },
        {
            title: 'Active',
            dataIndex: ['user', 'isActive'],
            key: 'isActive',
            render: isActive => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Yes' : 'No'}
                </Tag>
            ),
        },
        {
            title: 'First Name',
            dataIndex: ['user', 'userProfile', 'firstName'],
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: ['user', 'userProfile', 'lastName'],
            key: 'lastName',
        },
        {
            title: 'Gender',
            dataIndex: ['user', 'userProfile', 'gender'],
            key: 'gender',
        },
        {
            title: 'Birthdate',
            dataIndex: ['user', 'userProfile', 'birthdate'],
            key: 'birthdate',
        },
        {
            title: 'Location',
            dataIndex: ['user', 'userProfile', 'location'],
            key: 'location',
            render: location => (
                <div>
                    {location && (
                        <div>
                            <div>{location.country}</div>
                            <div>{location.state}</div>
                            <div>{location.city}</div>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Bio',
            dataIndex: ['user', 'userProfile', 'bio'],
            key: 'bio',
        },
        {
            title: 'Public',
            dataIndex: ['user', 'userProfile', 'isPublic'],
            key: 'isPublic',
            render: isPublic => (
                <Tag color={isPublic ? 'blue' : 'default'}>
                    {isPublic ? 'Yes' : 'No'}
                </Tag>
            ),
        },
        {
            title: 'Dark Mode',
            dataIndex: ['user', 'userProfile', 'darkMode'],
            key: 'darkMode',
            render: darkMode => (
                <Tag color={darkMode ? 'purple' : 'default'}>
                    {darkMode ? 'Yes' : 'No'}
                </Tag>
            ),
        },
        {
            title: 'Total Posts',
            dataIndex: 'totalPosts',
            key: 'totalPosts',
        },
        {
            title: 'Total Stories',
            dataIndex: 'totalStories',
            key: 'totalStories',
        },
        {
            title: 'Total Ratings Received',
            dataIndex: 'totalRatingsReceived',
            key: 'totalRatingsReceived',
        },
        {
            title: 'Total Ratings Given',
            dataIndex: 'totalRatingsGiven',
            key: 'totalRatingsGiven',
        },
        {
            title: 'Total Ignores',
            dataIndex: 'totalIgnores',
            key: 'totalIgnores',
        },
        {
            title: 'Total Crushes',
            dataIndex: 'totalCrushes',
            key: 'totalCrushes',
        },
        {
            title: 'Total Friendships',
            dataIndex: 'totalFriendships',
            key: 'totalFriendships',
        },
    ];

    const selectedColumns = [
        {
            title: 'Field',
            dataIndex: 'field',
            key: 'field',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
    ];


    const getSelectedUserDataAsTableData = () => {
        const tableData = [];
        if (selectedUserData) {
            const { user, totalPosts, totalStories, totalRatingsReceived, totalRatingsGiven, totalIgnores, totalCrushes, totalFriendships } = selectedUserData;
            const userProfile = user.userProfile;

            tableData.push({ field: 'Username', value: user.username });
            tableData.push({ field: 'Email', value: user.email });
            tableData.push({ field: 'Active', value: user.isActive ? 'Yes' : 'No' });
            tableData.push({ field: 'First Name', value: userProfile.firstName });
            tableData.push({ field: 'Last Name', value: userProfile.lastName });
            tableData.push({ field: 'Gender', value: userProfile.gender });
            tableData.push({ field: 'Birthdate', value: new Date(userProfile.birthdate).toLocaleDateString() });
            if (userProfile.location) {
                const { country, state, city } = JSON.parse(userProfile.location);
                tableData.push({ field: 'Country', value: country });
                tableData.push({ field: 'State', value: state });
                tableData.push({ field: 'City', value: city });
            }
            tableData.push({ field: 'Bio', value: userProfile.bio });
            tableData.push({ field: 'Public', value: userProfile.isPublic ? 'Yes' : 'No' });
            tableData.push({ field: 'Dark Mode', value: userProfile.darkMode ? 'Yes' : 'No' });
            tableData.push({ field: 'Total Posts', value: totalPosts });
            tableData.push({ field: 'Total Stories', value: totalStories });
            tableData.push({ field: 'Total Ratings Received', value: totalRatingsReceived });
            tableData.push({ field: 'Total Ratings Given', value: totalRatingsGiven });
            tableData.push({ field: 'Total Ignores', value: totalIgnores });
            tableData.push({ field: 'Total Crushes', value: totalCrushes });
            tableData.push({ field: 'Total Friendships', value: totalFriendships });
        }
        return tableData;
    };


    return (
        <>
            {loading && <LoadingBar color="#1890ff" height={4} />}

            <h2 className='card p-2 mb-4 w-25 text-center mx-auto'>User Details</h2>
            <div className='mb-5' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '80%' }} className='card'>
                    <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined style={{ color: '#1890ff' }} />}
                        style={{ width: '100%', height: '50px', paddingLeft: '22px' }}
                        onChange={(e) => handleSearch(e.target.value)}
                    />

                    {searchQuery && (
                        <List
                            dataSource={searchResults}
                            renderItem={(item) => (
                                <Item
                                    className='p-3 itemhover'
                                    style={{ cursor: 'pointer', transition: 'background-color 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'start', gap: '20px' }}
                                    key={item.id}
                                    onClick={() => handleUserSelect(item.username)}
                                >
                                    {item.userProfile.profilePhote ? (
                                        <Avatar
                                            src={`http://static.profile.local/${item.userProfile.profilePhote.photoURL}`}
                                            alt={item.username}
                                          
                                        />
                                    ) : null}
                                    <div>
                                        <div>{`${item.userProfile.firstName} ${item.userProfile.lastName}`}</div>
                                        <div style={{ fontWeight: 'bold' }}>{item.username}</div>
                                    </div>
                                </Item>
                            )}
                        />
                    )}
                </div>
            </div>

            {selectedUserData ? (
                <div>
                    <div className='mb-3' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <div className='d-flex justify-content-around align-items-center' style={{ cursor: 'pointer' }}
                            onClick={() => {
                                window.open(`${selectedUserData.user.username}`, '_blank');
                            }}
                        >
                            {selectedUserData.profilePhotos && selectedUserData.profilePhotos.length > 0 ? (
                                <Avatar
                                    src={`http://static.profile.local/${selectedUserData.profilePhotos[0].photoURL}`}
                                    alt={selectedUserData.user.username}
                                    style={{
                                        width: '40px',
                                        height: '40px'
                                    }}
                                />
                            ) : (
                                <Avatar />
                            )}
                            <p style={{ margin: 0, fontSize: '14px', marginLeft: '10px' }}>@{selectedUserData.user.username}</p>
                        </div>

                        <div className='d-flex justify-content-around align-items-center'>
                            <h2 style={{ margin: '0', fontSize: '20px' }}>
                                {`${selectedUserData.user.userProfile.firstName.charAt(0).toUpperCase()}${selectedUserData.user.userProfile.firstName.slice(1)} ${selectedUserData.user.userProfile.lastName.charAt(0).toUpperCase()}${selectedUserData.user.userProfile.lastName.slice(1)}`}
                            </h2>
                        </div>
                    </div>

                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <Table
                            dataSource={getSelectedUserDataAsTableData()}
                            columns={selectedColumns}
                            rowKey={(record, index) => index}
                            pagination={false}
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center mt-5">
                    {searchQuery ? (
                        <p className='text-muted'>No user found with the provided search criteria.</p>
                    ) : (
                        <p className='text-muted'>Please perform a search to display user details.</p>
                    )}
                </div>
            )}
        </>
    );

};

export default AdminSearchbar;