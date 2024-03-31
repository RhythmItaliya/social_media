import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Alert, Popconfirm, Tag } from 'antd';
import { ReloadOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import config from '../../configuration';

const AdminUserTerminate = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        fetch(`${config.apiUrl}/admins/get/users/data`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setUserData(data);
                } else {
                    console.error('Failed to fetch user data');
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            })
            .finally(() => setLoading(false));
    };

    const handleTerminate = (record) => {
        setLoading(true);
        fetch(`${config.apiUrl}/admins/user/takedown/${record.id}`, {
            credentials: 'include',
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    const updatedUserData = userData.map(user => {
                        if (user.id === record.id) {
                            return { ...user, isTerminate: true };
                        }
                        return user;
                    });
                    setUserData(updatedUserData);
                } else {
                    console.error('Failed to terminate user:', data.error);
                }
            })
            .catch(error => {
                console.error('Error terminating user:', error);
            })
            .finally(() => setLoading(false));
    };

    const handleReactivate = (record) => {
        setLoading(true);
        fetch(`${config.apiUrl}/admins/user/takedown/${record.id}`, {
            credentials: 'include',
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    const updatedUserData = userData.map(user => {
                        if (user.id === record.id) {
                            return { ...user, isTerminate: false };
                        }
                        return user;
                    });
                    setUserData(updatedUserData);
                } else {
                    console.error('Failed to reactivate user:', data.error);
                }
            })
            .catch(error => {
                console.error('Error reactivating user:', error);
            })
            .finally(() => setLoading(false));
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Is Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: isActive => isActive ? 'Yes' : 'No',
        },
        {
            title: 'Profile Created',
            dataIndex: 'profileCreated',
            key: 'profileCreated',
            render: profileCreated => profileCreated ? 'Yes' : 'No',
        },
        {
            title: 'Is Terminated',
            dataIndex: 'isTerminate',
            key: 'isTerminate',
            render: isTerminate => (
                <Tag color={isTerminate ? 'red' : 'green'}>
                    {isTerminate ? 'Terminated' : 'Active'}
                </Tag>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {record.isTerminate ? (
                        <Popconfirm
                            title="Are you sure you want to reactivate this user?"
                            onConfirm={() => handleReactivate(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" icon={<CheckCircleOutlined />} />
                        </Popconfirm>
                    ) : (
                        <Popconfirm
                            title="Are you sure you want to terminate this user?"
                            onConfirm={() => handleTerminate(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" danger icon={<CloseCircleOutlined />} />
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2 className='card p-2 mb-4 w-25 text-center mx-auto'>Admin User Terminate</h2>

            <div className='mb-2'>
                <Space>
                    <Button className='mb-3' onClick={fetchData} icon={<ReloadOutlined />} loading={loading}>
                        Refresh
                    </Button>
                </Space>

                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {userData.length > 0 ? (
                        <Table
                            dataSource={userData}
                            columns={columns}
                            rowKey={(record) => record.id}
                            pagination={{ pageSize: 5 }}
                        />
                    ) : (
                        <Alert message="No user data found." type="info" className='text-center mt-5' />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUserTerminate;
