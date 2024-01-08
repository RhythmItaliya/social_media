import React, { useEffect, useState } from 'react';
import { Input, Button, Form, Select, DatePicker, Row, Col } from 'antd';
import ProfilePhoto from './ProfilePhoto';
import { useSelector } from 'react-redux';

const { Option } = Select;

const EditProfile = () => {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState(null);

    const profileuuid = useSelector((state) => state.profileuuid.uuid);
    const useruuid = useSelector((state) => state.useruuid.uuid);

    // Inside the useEffect hook
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/userProfile/get/${profileuuid}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();

                    setUserData(data);
                    form.setFieldsValue(data);
                } else {
                    const error = await response.json();
                    console.error('Error fetching user profile data:', error);
                }
            } catch (error) {
                console.error('Server error:', error);
            }
        };

        fetchData();
    }, [profileuuid, form]);


    const onFinish = async (values) => {
        try {
            const response = await fetch(`http://localhost:8080/userProfile/create/${useruuid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                const error = await response.json();
                console.error('Error creating user profile:', error);
            }
        } catch (error) {
            console.error('Server error:', error);
        }
    };

    return (
        <div>
            <ProfilePhoto form={form} />

            <Form
                form={form}
                name="editProfileForm"
                onFinish={onFinish}
                initialValues={userData || {}}
            >
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Form.Item name="firstName" label="First Name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="lastName" label="Last Name">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="username" label="Username">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="gender" label="Gender">
                            <Select>
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Form.Item name="bio" label="Bio">
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="location" label="Location">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Save Changes
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default EditProfile;
