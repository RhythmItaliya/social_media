import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, message, Alert } from 'antd';
import config from '../../configuration';
import LoadingBar from 'react-top-loading-bar';
import { format } from 'date-fns';
import { ReloadOutlined } from '@ant-design/icons';
import { Avatar } from '@mui/material';
import { EyeOutlined, EyeInvisibleOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import './chart.css';

const AdminPostReportData = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.apiUrl}/admins/admin/reports`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const updatedData = data.map(item => {
                return {
                    ...item,
                    isTakeDown: item.post.isTakeDown
                };
            });
            // Sort the data by isSolve (false first) and then by report date
            updatedData.sort((a, b) => {
                if (a.isSolve !== b.isSolve) {
                    return a.isSolve ? 1 : -1; // False values come first
                }
                return new Date(b.reportDate) - new Date(a.reportDate);
            });

            setReportData(updatedData);
        } catch (error) {
            console.error('Error fetching report data:', error);
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchReportData();
    }, []);

    const handleRefresh = () => {
        fetchReportData();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Report User',
            render: (text, record) => `${record.userProfile.firstName} ${record.userProfile.lastName} (@${record.userProfile.username})`,
            key: 'userProfile',
        },
        {
            title: 'Report ID',
            dataIndex: 'reportId',
            key: 'reportId',
        },
        {
            title: 'Post ID',
            render: (text, record) => record.post.id,
            key: 'postId',
        },
        {
            title: 'Report Reason',
            dataIndex: 'reportReason',
            key: 'reportReason',
            render: (text) => {
                const words = text.split(' ');
                const truncatedText = words.slice(0, 3).join(' ');
                return truncatedText;
            },
        },
        {
            title: 'Is Solved',
            dataIndex: 'isSolve',
            key: 'isSolve',
            render: (text) => (
                <Tag color={text ? 'green' : 'red'}>
                    {text ? 'Yes' : 'No'}
                </Tag>
            ),
        },
        {
            title: 'Is TakeDown',
            dataIndex: 'isTakeDown',
            key: 'isTakeDown',
            render: (text) => (
                <Tag color={text ? 'red' : 'green'}>
                    {text ? 'Takedown' : 'No Takedown'}
                </Tag>
            ),
        },

        {
            title: 'Report Date',
            dataIndex: 'reportDate',
            key: 'reportDate',
            render: (text, record) => format(new Date(record.reportDate), 'dd-MM-yyyy HH:mm:ss'),
        },
        {
            title: 'Post Type',
            dataIndex: 'post.isPhoto',
            key: 'postType',
            render: (text, record) => (
                <Tag color={record.post.isPhoto ? 'blue' : 'default'}>
                    {record.post.isPhoto ? 'Photo' : 'Text'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleShowDetails(record)} icon={selectedReport && selectedReport.id === record.id ? <EyeInvisibleOutlined /> : <EyeOutlined />} />

                    <Button onClick={() => handleTakeDown(record)} style={{ marginLeft: '8px', color: 'red' }} icon={<DeleteOutlined />} />

                    <Button onClick={() => handleIgnore(record)} style={{ marginLeft: '8px', color: 'blue' }} icon={<StopOutlined />} />

                </div>
            ),
            key: 'actions',
        },
    ];


    const handleTakeDown = async (record) => {
        try {
            const response = await fetch(`${config.apiUrl}/admins/post/takedown/${record.post.id}`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchReportData();
            console.log('Post marked as taken down:', record);
        } catch (error) {
            console.error('Error marking post as taken down:', error);
        }
    };



    const handleIgnore = async (record) => {
        try {
            const response = await fetch(`${config.apiUrl}/admins/reports/${record.reportId}/solve`, {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchReportData();
            console.log('Report marked as solved:', record);
        } catch (error) {
            console.error('Error marking report as solved:', error);
        }
    };


    const handleShowDetails = (record) => {
        if (selectedReport && selectedReport.id === record.id) {
            setSelectedReport(null);
        } else {
            setSelectedReport(record);
        }
    };

    const handleCloseDetails = () => {
        setSelectedReport(null);
    };


    return (
        <div className='vh-100 overflow-y-scroll'>
            {loading && <LoadingBar color="#1890ff" height={4} />}
            <h2 className='card p-2 mb-4 w-25 text-center mx-auto'>Report Data</h2>
            <div className='mb-2' style={{ width: '80%', margin: 'auto' }}>
                <Space>
                    <Button className='mb-3' onClick={handleRefresh} icon={<ReloadOutlined />} loading={loading}>
                        Refresh
                    </Button>
                </Space>

                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {reportData.length > 0 ? (
                        <Table
                            dataSource={reportData}
                            columns={columns}
                            rowKey={(record) => record.id}
                            pagination={{ pageSize: 5 }}
                        />
                    ) : (
                        <Alert message="Report not Found," type="info" className='text-center mt-5'/>
                    )}
                </div>
            </div>

            {selectedReport && (
                <>
                    <div className="container mx-auto mt-4">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button type="primary" onClick={handleCloseDetails}>Close</Button>
                        </div>

                        <div className='mb-3' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <div className='d-flex justify-content-around align-items-center' style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    window.open(`${selectedReport.userProfile.username}`, '_blank');
                                }}
                            >
                                {selectedReport.profilePhoto && selectedReport.profilePhoto.length > 0 ? (
                                    <Avatar
                                        src={`http://static.profile.local/${selectedReport.userProfile.profilePhoto[0].photoURL}`}
                                        alt={selectedReport.userProfile.username}
                                        style={{
                                            width: '40px',
                                            height: '40px',

                                        }}

                                    />
                                ) : (
                                    <Avatar />
                                )}
                                <p style={{ margin: 0, fontSize: '14px', marginLeft: '10px' }}>@{selectedReport.userProfile.username}</p>
                            </div>

                            <div className='d-flex justify-content-around align-items-center'>
                                <h2 style={{ margin: '0', fontSize: '20px' }}>
                                    {`${selectedReport.userProfile.firstName.charAt(0).toUpperCase()}${selectedReport.userProfile.firstName.slice(1)} ${selectedReport.userProfile.lastName.charAt(0).toUpperCase()}${selectedReport.userProfile.lastName.slice(1)}`}
                                </h2>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <h5>Report Details</h5>
                                <table className="table custom-table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td>Report ID</td>
                                            <td>{selectedReport.reportId}</td>
                                        </tr>
                                        <tr>
                                            <td>Is Solved</td>
                                            <td>{selectedReport.isSolve ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <td>Report Reason</td>
                                            <td>{selectedReport.reportReason}</td>
                                        </tr>
                                        <tr>
                                            <td>Report Date</td>
                                            <td>{new Date(selectedReport.reportDate).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td>User First Name</td>
                                            <td>{selectedReport.userProfile.firstName}</td>
                                        </tr>
                                        <tr>
                                            <td>User Last Name</td>
                                            <td>{selectedReport.userProfile.lastName}</td>
                                        </tr>
                                        <tr>
                                            <td>Username</td>
                                            <td>{selectedReport.userProfile.username}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">
                                <h5>Post Details</h5>
                                <table className="table custom-table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td>Post ID</td>
                                            <td>{selectedReport.post.id}</td>
                                        </tr>
                                        <tr>
                                            <td>Post Text</td>
                                            <td>{selectedReport.post.postText}</td>
                                        </tr>
                                        <tr>
                                            <td>Is Photo</td>
                                            <td>{selectedReport.post.isPhoto ? 'Yes' : 'No'}</td>
                                        </tr>
                                        <tr>
                                            <td>Caption</td>
                                            <td>{selectedReport.post.caption}</td>
                                        </tr>
                                        <tr>
                                            <td>Location</td>
                                            <td>{JSON.parse(selectedReport.post.location).city}, {JSON.parse(selectedReport.post.location).country}</td>
                                        </tr>
                                        <tr>
                                            <td>Visibility</td>
                                            <td>
                                                {selectedReport.post.isVisibility ? (
                                                    <Tag color="green">Public</Tag>
                                                ) : (
                                                    <Tag color="red">Private</Tag>
                                                )}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>TakeDown</td>
                                            <td>
                                                {selectedReport.post.isTakeDown ? (
                                                    <Tag color="red">Takedown</Tag>
                                                ) : (
                                                    <Tag color="green">No Takedown</Tag>
                                                )}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>Post Upload URLs</td>
                                            <td>{selectedReport.post.postUploadURLs}</td>
                                        </tr>
                                        <tr>
                                            <td>Hashtags</td>
                                            <td>{selectedReport.post.hashtags}</td>
                                        </tr>
                                        <tr>
                                            <td>UUID</td>
                                            <td>{selectedReport.post.uuid}</td>
                                        </tr>
                                        <tr>
                                            <td>Created At</td>
                                            <td>{new Date(selectedReport.post.createdAt).toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td>Updated At</td>
                                            <td>{new Date(selectedReport.post.updatedAt).toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    );

};

export default AdminPostReportData;