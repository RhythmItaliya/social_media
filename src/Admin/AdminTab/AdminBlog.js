import { useState } from 'react';
import { Form, Input, Radio, Tag } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Button from '@mui/material/Button';
import AdminBlogPost from './AdminBlogPost';
import config from '../../configuration';

const AdminBlog = ({ colors }) => {
    const [form] = Form.useForm();
    const [isPublic, setIsPublic] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [keywordsJSON, setKeywordsJSON] = useState('');
    const [imgData, setImgNewData] = useState('');

    const onFinish = async (values) => {
        try {
            const response = await fetch(`${config.apiUrl}/blogs/blogs`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: values.title,
                    keyword: keywordsJSON,
                    contentarea: values.content,
                    isPublic: isPublic,
                    data: imgData,
                }),
            });

            if (response.ok) {
                console.log('Blog uploaded successfully!');
                form.resetFields();
            } else {

                console.error('Error uploading blog:', response.statusText);
            }
        } catch (error) {

            console.error('Error uploading blog:', error.message);
        }
    };

    const handleImageData = (data) => {
        setImgNewData(data);
    };

    const handlePublicChange = (e) => {
        setIsPublic(e.target.value);
    };

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleKeywordAdd = () => {
        if (keyword.trim() !== '') {
            setKeywords([...keywords, keyword]);
            setKeyword('');
            updateKeywordsJSON();
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleKeywordAdd();
        }
    };
    
    const updateKeywordsJSON = () => {
        const keywordsObject = {};
        keywords.forEach((kw, index) => {
            keywordsObject[`keyword${index + 1}`] = kw;
        });
        setKeywordsJSON(JSON.stringify(keywordsObject));
    };
    

    const handleKeywordRemove = (removedKeyword) => {
        const updatedKeywords = keywords.filter((kw) => kw !== removedKeyword);
        setKeywords(updatedKeywords);
        if (updatedKeywords) {
            updateKeywordsJSON(updatedKeywords);
        } else {
            setKeywordsJSON('');
        }
    };
    

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <h2 className='card p-2 mb-4 text-center'>Blog Upload</h2>

                    <Form
                        form={form}
                        style={{ height: '700px', overflowY: 'scroll' }}
                        name="admin-blog-form"
                        onFinish={onFinish}
                        initialValues={{ isPublic }}
                    >

                        <div className="mb-3">
                            <Form.Item
                                label="Image"
                                rules={[{ required: true, message: 'Please upload an image' }]}
                            >
                                <AdminBlogPost imageData={handleImageData} colors={colors} />
                            </Form.Item>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <Form.Item
                                name="title"
                                rules={[{ required: true, message: 'Please enter a title' }]}
                            >
                                <Input className="form-control" />
                            </Form.Item>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="keywords" className="form-label">Keywords</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {keywords.map((kw) => (
                                    <Tag
                                        key={kw}
                                        closable
                                        onClose={() => handleKeywordRemove(kw)}
                                        style={{ marginBottom: '5px', marginRight: '5px' }}
                                    >
                                        {kw}
                                    </Tag>
                                ))}
                            </div>

                            <Form.Item
                                name="keywords"
                                rules={[
                                    { required: true, message: 'Please enter at least one keyword' },
                                ]}
                            >
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Input
                                        className="form-control"
                                        value={keyword}
                                        onChange={handleKeywordChange}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleKeywordAdd}
                                        style={{ marginLeft: '5px' }}
                                    >
                                        <PlusCircleOutlined />
                                    </Button>
                                </div>
                            </Form.Item>

                        </div>

                        <div className="mb-3">
                            <label htmlFor="content" className="form-label">Content</label>
                            <Form.Item
                                name="content"
                                rules={[{ required: true, message: 'Please enter content' }]}
                            >
                                <ReactQuill theme="snow" style={{ height: '200px', marginBottom: '30px' }} />
                            </Form.Item>
                        </div>

                        <div className="mb-3 mt-5">
                            <Radio.Group id="isPublic" name="isPublic" onChange={handlePublicChange} value={isPublic}>
                                <Radio value={true}>Blog Public</Radio>
                                <Radio value={false}>Blog Private</Radio>
                            </Radio.Group>
                        </div>

                        <div className="text-center mt-5">
                            <Button type="submit" variant="contained" color="primary">
                                Upload
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AdminBlog;