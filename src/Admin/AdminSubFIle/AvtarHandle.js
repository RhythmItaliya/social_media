import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Alert, Popconfirm } from 'antd';
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../configuration';

const AvtarHandle = () => {
    const [avatarData, setAvatarData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        fetch(`${config.apiUrl}/admins/get/all/defaultAvatar`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setAvatarData(data.avatars);
                } else {
                    console.error('Failed to fetch avatar data:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching avatar data:', error);
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (record) => {
        setLoading(true);
        fetch(`${config.apiUrl}/admins/delete/defaultAvatar/${record.id}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchData();
                } else {
                    console.error('Failed to delete avatar:', data.error);
                }
            })
            .catch(error => {
                console.error('Error deleting avatar:', error);
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
            title: 'Avatar URL',
            dataIndex: 'url',
            key: 'url',
            render: url => <img src={url} alt="Avatar" style={{ width: '50px', height: '50px' }} />,
        },
        {
            title: 'UUID',
            dataIndex: 'uuid',
            key: 'uuid',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Are you sure you want to delete this avatar?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2 className='card p-2 mt-4 mb-4 w-25 text-center mx-auto'>Default Avatar Data</h2>

            <div className='mb-2' style={{ width: '80%', margin: 'auto' }}>
                <Space>
                    <Button className='mb-3' onClick={fetchData} icon={<ReloadOutlined />} loading={loading}>
                        Refresh
                    </Button>
                </Space>

                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {avatarData.length > 0 ? (
                        <Table
                            dataSource={avatarData}
                            columns={columns}
                            rowKey={(record) => record.id}
                            pagination={{ pageSize: 5 }}
                        />
                    ) : (
                        <Alert message="No avatar data found." type="info" className='text-center mt-5' />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvtarHandle;
