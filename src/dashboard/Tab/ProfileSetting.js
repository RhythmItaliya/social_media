// import React, { useState } from 'react';
// import { Form, Input, Select, DatePicker, Upload, Button, message } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';

// const { Option } = Select;

// const UserForm = () => {
//   const [form] = Form.useForm();
//   const [photoFile, setPhotoFile] = useState(null);

//   const onFinish = (values) => {
//     // Handle form submission, including the photoFile
//     console.log('Form values:', values);
//     console.log('Photo file:', photoFile);
//     // Add your logic to send the data to the server or perform any other action
//   };

//   const normFile = (e) => {
//     if (Array.isArray(e)) {
//       return e;
//     }
//     return e && e.fileList;
//   };

//   const beforeUpload = (file) => {
//     const isImage = file.type.startsWith('image/');
//     if (!isImage) {
//       message.error('You can only upload image files!');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 20;
//     if (!isLt2M) {
//       message.error('Image must be smaller than 2MB!');
//     }
//     return isImage && isLt2M;
//   };

//   return (
//     <Form
//       form={form}
//       name="userForm"
//       onFinish={onFinish}
//       labelCol={{ span: 6 }}
//       wrapperCol={{ span: 14 }}
//     >
//       <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
//         <Select>
//           <Option value="male">Male</Option>
//           <Option value="female">Female</Option>
//           <Option value="other">Other</Option>
//         </Select>
//       </Form.Item>
//       <Form.Item name="birthdate" label="Birthdate" rules={[{ required: true }]}>
//         <DatePicker />
//       </Form.Item>
//       <Form.Item name="location" label="Location" rules={[{ required: true }]}>
//         <Input />
//       </Form.Item>
//       <Form.Item name="bio" label="Bio" rules={[{ required: true }]}>
//         <Input.TextArea />
//       </Form.Item>
//       <Form.Item
//         name="photo"
//         label="Photo"
//         valuePropName="fileList"
//         getValueFromEvent={normFile}
//         rules={[{ required: true }]}
//       >
//         <Upload
//           beforeUpload={beforeUpload}
//           maxCount={1}
//           customRequest={({ file, onSuccess }) => {
//             // Handle photo upload logic here
//             // You may want to use a library like axios to send the file to the server
//             console.log('Uploading photo:', file);
//             setPhotoFile(file);
//             onSuccess(); // Notify Ant Design that the upload is successful
//           }}
//         >
//           <Button icon={<UploadOutlined />}>Click to Upload</Button>
//         </Upload>
//       </Form.Item>
//       <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// };

// export default UserForm;
