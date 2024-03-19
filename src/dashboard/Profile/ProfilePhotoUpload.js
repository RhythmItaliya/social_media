import React, { useState } from 'react';
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, Upload, Button, message } from 'antd';
import '../Tab/vertical.css';
import { useSelector } from 'react-redux';
import config from '../../configuration';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ProfilePhoto = () => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const uuid = useSelector((state) => state.profileuuid.uuid);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };


    const customRequest = async ({ file, onError, onSuccess }) => {
        try {
            // Convert the file to base64 before sending it
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64Data = reader.result.split(',')[1];


                // Check if a profile photo already exists for the user
                const response = await fetch(`${config.apiUrl}/profilephotoes/${uuid}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                console.log(data);

                if (data.found) {
                    // If a profile photo exists, update it
                    try {
                        const updateResponse = await fetch(`${config.apiUrl}/profilephotoes/update/${uuid}`, {
                            method: 'PUT',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: file.name,
                                data: base64Data,
                            }),
                        });

                        if (updateResponse.ok) {
                            onSuccess();
                            console.log('File updated successfully');
                        } else {
                            onError(new Error('Error updating file'));
                            console.log('Error updating file');
                        }
                    } catch (error) {
                        onError(error);
                        console.log('Error updating file:', error);
                    }
                } else {
                    // If no profile photo exists, add a new one
                    try {
                        const addResponse = await fetch(`${config.apiUrl}/profilephotoes/${uuid}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: file.name,
                                data: base64Data,
                            }),
                        });

                        if (addResponse.ok) {
                            onSuccess();
                            console.log('File uploaded successfully');
                        } else {
                            onError(new Error('Error uploading file'));
                            console.log('Error uploading file');
                        }
                    } catch (error) {
                        onError(error);
                        console.error('Error uploading file:', error);
                    }
                }
            };
        } catch (error) {
            onError(error);
            console.error('Error uploading file:', error);
        }
    };


    const handleDeleteImage = async () => {
        // Add logic to permanently delete the image
        try {
            await fetch(`${config.apiUrl}/profilephotoes/delete/${uuid}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            setFileList([]);
            console.log('Image deleted successfully');
        } catch (error) {
            console.log('Error deleting image:', error);
        }
    };

    const handleSave = () => {
        setFileList([]);
        setUploading(true);

        // Your customRequest logic goes here

        // After the upload is complete, set uploading status to false
        // This can be done in the onSuccess callback of your fetch request

        // Example:
        // .then(() => {
        //     setUploading(false);
        // })
        // .catch((error) => {
        //     console.log('Error:', error);
        //     setUploading(false);
        // });
    };

    const handleClear = () => {
        setFileList([]);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Upload
                customRequest={customRequest}
                listType="picture-circle"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={({ fileList: newFileList }) => handleChange({ fileList: newFileList })}
                name="profilePhoto"
            >
                {fileList.length >= 1 ? null : uploadButton}
            </Upload>

            {fileList.length > 0 && (
                <>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSave}
                        disabled={uploading}
                        style={{ marginTop: 16, marginRight: 8 }}
                    >
                        Save
                    </Button>

                    <Button
                        type="default"
                        icon={<PlusOutlined />}
                        onClick={handleClear}
                        disabled={uploading}
                        style={{ marginTop: 16, marginRight: 8 }}
                    >
                        Clear
                    </Button>
                </>
            )}

            <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={handleDeleteImage}
                style={{ marginTop: 16 }}
            >
                Remove Image
            </Button>


            <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <img
                    alt="Profile"
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '100px',
                        maxHeight: '100px',
                        objectFit: 'cover',
                        borderRadius: '50%'
                    }}
                    src={previewImage}
                />
            </Modal>
        </>
    );
};

export default ProfilePhoto;