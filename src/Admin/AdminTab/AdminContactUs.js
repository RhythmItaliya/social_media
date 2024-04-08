import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Alert, Popconfirm, Tag } from 'antd';
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import config from '../../configuration';

const AdminContactUs = () => {
    const [contactData, setContactData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        fetch(`${config.apiUrl}/contactsus/get/contactsus`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setContactData(data);
                } else {
                    console.error('Failed to fetch contact data');
                }
            })
            .catch(error => {
                console.error('Error fetching contact data:', error);
            })
            .finally(() => setLoading(false));
    };

    const handleDelete = (record) => {
        setLoading(true);
        fetch(`${config.apiUrl}/contactsus/get/contactsus/${record.id}`, {
            credentials: 'include',
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    setContactData(prevData => prevData.filter(contact => contact.id !== record.id));
                } else {
                    console.error('Failed to delete contact:', data.error);
                }
            })
            .catch(error => {
                console.error('Error deleting contact:', error);
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Note',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Are you sure you want to delete this contact?"
                        onConfirm={() => handleDelete(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2 className='card p-2 mb-4 w-25 text-center mx-auto'>Contact Us</h2>
            <div className='mb-2'>
                <Space>
                    <Button className='mb-3' onClick={fetchData} icon={<ReloadOutlined />} loading={loading}>
                        Refresh
                    </Button>
                </Space>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {contactData.length > 0 ? (
                        <Table
                            dataSource={contactData}
                            columns={columns}
                            rowKey={(record) => record.id}
                            pagination={{ pageSize: 5 }}
                        />
                    ) : (
                        <Alert message="No contact data found." type="info" className='text-center mt-5' />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminContactUs;
