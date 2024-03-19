// import React, { useState } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
// import { Modal, Upload } from 'antd';
// import '../Tab/vertical.css';
// import { useSelector } from 'react-redux';

// const getBase64 = (file) =>
//     new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => resolve(reader.result);
//         reader.onerror = (error) => reject(error);
//     });

// const ProfilePhoto = () => {
//     const [previewOpen, setPreviewOpen] = useState(false);
//     const [previewImage, setPreviewImage] = useState('');
//     const [previewTitle, setPreviewTitle] = useState('');
//     const [fileList, setFileList] = useState([]);

//     const uuid = useSelector(state => state.profileuuid.uuid);

//     const handleCancel = () => setPreviewOpen(false);

//     const handlePreview = async (file) => {
//         if (!file.url && !file.preview) {
//             file.preview = await getBase64(file.originFileObj);
//         }
//         setPreviewImage(file.url || file.preview);
//         setPreviewOpen(true);
//         setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
//     };

//     const handleChange = ({ fileList: newFileList }) => {
//         setFileList(newFileList);
//     };


//     const handleDelete = async (file) => {
//         try {
//             // Send a DELETE request to the server to delete the file
//             await fetch(`${config.apiUrl}/profilephotoes/delete/${uuid}`, {
//                 method: 'DELETE',
//                 credentials: 'include',
//             });

//             // Update the UI by removing the deleted file from the fileList
//             const updatedFileList = fileList.filter((f) => f.uid !== file.uid);
//             setFileList(updatedFileList);

//             console.log('File deleted successfully');
//         } catch (e) {
//             console.log('Error deleting file:', e);
//         }
//     };


//     const customRequest = async ({ file, onSuccess, onError }) => {
//         try {
//             // Convert the file to base64 before sending it
//             const reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = async () => {
//                 const base64Data = reader.result.split(',')[1];

//                 // Check if a profile photo already exists for the user
//                 const response = await fetch(`${config.apiUrl}/profilephotoes/${uuid}`, {
//                     method: 'GET',
//                     credentials: 'include',
//                 });
//                 const data = await response.json();
//                 console.log(data);

//                 if (data.found) {
//                     // If a profile photo exists, update it
//                     fetch(`${config.apiUrl}/profilephotoes/update/${uuid}`, {
//                         method: 'PUT',
//                         credentials: 'include',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             name: file.name,
//                             data: base64Data,
//                         }),
//                     })
//                         .then((response) => {
//                             if (response.ok) {
//                                 onSuccess();
//                             } else {
//                                 onError();
//                             }
//                         })
//                         .catch((error) => {
//                             console.log('Error updating file:', error);
//                             onError();
//                         });
//                 } else {
//                     // If no profile photo exists, add a new one
//                     fetch(`${config.apiUrl}/profilephotoes/${uuid}`, {
//                         method: 'POST',
//                         headers: {
//                             'Content-Type': 'application/json',
//                         },
//                         body: JSON.stringify({
//                             name: file.name,
//                             data: base64Data,
//                         }),
//                     })
//                         .then((response) => {
//                             if (response.ok) {
//                                 onSuccess();
//                             } else {
//                                 onError();
//                             }
//                         })
//                         .catch((error) => {
//                             console.error('Error uploading file:', error);
//                             onError();
//                         });
//                 }
//             };
//         } catch (error) {
//             console.error('Error uploading file:', error);
//             onError();
//         }
//     };

//     const uploadButton = (
//         <div>
//             <PlusOutlined />
//             <div style={{ marginTop: 8 }}>Upload</div>
//         </div>
//     );

//     return (
//         <>
//             <Upload
//                 customRequest={customRequest}
//                 listType="picture-card"
//                 fileList={fileList}
//                 onPreview={handlePreview}
//                 onChange={({ fileList: newFileList }) => handleChange({ fileList: newFileList })}
//                 name="profilePhoto"
//                 onRemove={(file) => handleDelete(file)}
//             >
//                 {fileList.length >= 1 ? null : uploadButton}
//             </Upload>

//             {/* Save Button removed */}
//             <Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
//                 <img
//                     alt="Profile"
//                     style={{
//                         width: '100%',
//                         height: 'auto',
//                         maxWidth: '150px',
//                         maxHeight: '150px',
//                         objectFit: 'cover',
//                     }}
//                     src={previewImage}
//                 />
//             </Modal>
//         </>
//     );
// };

// export default ProfilePhoto;
