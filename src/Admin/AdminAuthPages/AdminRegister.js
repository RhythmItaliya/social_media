// AdminRegister.js

import { useState } from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import { Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';
import MailOutlineOutlined from '@mui/icons-material/MailOutlineOutlined';
import logoImage from '../../assets/vortex.png';
import config from '../../configuration';


const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    spinnerColor: 'rgb(0,0,0)',
    labelColor: '#8e8e8e',
    valueTextColor: 'rgb(0,0,0)',
    linkColor: '#000',
    hashtagColor: 'darkblue',
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    focusColor: '#ffffff',
    border: '#333333',
    spinnerColor: '#ffffff',
    labelColor: '#CCC',
    valueTextColor: '#ffffff',
    linkColor: '#CCC8',
    hashtagColor: '#8A2BE2',
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const AdminRegister = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const onFinish = async (values) => {
        try {
            const res = await fetch(`${config.apiUrl}/admins/admin/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            if (res.status === 409) {
                message.error("Username or Email is already exist...");
            } else if (res.status === 500) {
                message.error("Register Failed");
            } else if (res.ok) {
                message.success("Register Successfully. Please Check Your Email...");
                setTimeout(() => {
                    window.location.href = '/admin/login';
                }, 4500);
            } else {
                message.error('Registration failed. Please try again.');

            }
        } catch (error) {
            console.error(error);
        }
    };

    const labelStyle = {
        color: colors.labelColor,
    };

    const inputStyle = {
        backgroundColor: colors.backgroundColor,
        color: colors.valueTextColor,
        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
        boxShadow: `0 2px 8px rgba(${hexToRgb(colors.border)}, 0.05), 0 2px 4px rgba(${hexToRgb(colors.border)}, 0.05) inset`,
        outline: 'none',
    };

    const buttonStyle = {
        outline: 'none',
        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
        boxShadow: `0 2px 8px rgba(${hexToRgb(colors.border)}, 0.05), 0 2px 4px rgba(${hexToRgb(colors.border)}, 0.05) inset`,
        backgroundColor: '#238636',
        color: '#ffffff',
    };

    return (
        <>
            <Form className="login-form justify-content-center align-items-center d-flex vh-100" onFinish={onFinish}
                style={{ backgroundColor: colors.backgroundColor, color: colors.textColor }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-4">

                            <div>
                                <img src={logoImage} alt="Logo" className="mb-5 mx-auto d-block user-select-none" style={{ width: '250px' }} />
                                <p className="mb-3 mt-3 text-center" style={{ color: colors.textColor, fontSize: '26px', letterSpacing: '1px' }}>
                                    Admin Sign in
                                </p>
                            </div>

                            <div className='m-2 ' style={{ boxShadow: 'none', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                                <div className="card-body p-4" style={{ backgroundColor: colors.backgroundColor }}>

                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="username" className="p-1">Username</label>
                                            <Form.Item name={'username'} rules={[
                                                {
                                                    required: true,
                                                    min: 3
                                                }
                                            ]}>
                                                <Input
                                                    type="text"
                                                    id="username"
                                                    placeholder="Enter your username"
                                                    prefix={<Person4OutlinedIcon style={{ color: colors.iconColor, fontSize: '20px', margin: '3px' }} className="site-form-item-icon" />}
                                                    style={inputStyle}
                                                    autoComplete="off"
                                                />
                                            </Form.Item>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="email" className="p-1">Email</label>
                                            <Form.Item name={'email'} rules={[
                                                {
                                                    required: true,
                                                }
                                            ]}>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    placeholder="Enter your email"
                                                    prefix={<MailOutlineOutlined style={{ color: colors.iconColor, fontSize: '20px', margin: '3px' }} className="site-form-item-icon" />}
                                                    style={inputStyle}
                                                    autoComplete="off"
                                                />
                                            </Form.Item>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password" className="p-1">Password</label>
                                            <Form.Item name={'password'} rules={[
                                                {
                                                    required: true,
                                                    min: 8,
                                                }
                                            ]}>
                                                <Input
                                                    type="password"
                                                    id="password"
                                                    placeholder="Enter your password"
                                                    prefix={<LockOutlinedIcon style={{ color: colors.iconColor, fontSize: '20px', margin: '3px' }} className="site-form-item-icon" />}
                                                    style={inputStyle}
                                                    autoComplete="off"
                                                />
                                            </Form.Item>
                                        </div>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="btn w-100 mt-2 btn-primary btn-block"
                                            style={buttonStyle}
                                        >
                                            Sign Up as a Admin
                                        </Button>

                                    </div>

                                    <Divider className='p-0 m-1' />

                                    <div className="text-center">
                                        <Link to="/admin/login" className="d-block d-sm-inline" style={{ color: colors.hashtagColor, fontSize: '14px' }}>
                                            Log in as a Admin
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className='d-flex justify-content-center align-content-center mt-5' style={{ cursor: 'pointer', marginTop: '20px' }}>
                                <div>
                                    <span onClick={toggleDarkMode} style={{ color: colors.textColor, fontSize: '12px', marginRight: '20px' }}>
                                        {isDarkMode ? <Brightness4Icon /> : <Brightness7Icon />}
                                    </span>
                                </div>
                                <div>
                                    <span style={{
                                        color: colors.textColor, fontSize: '12px', marginRight: '20px'
                                    }}>
                                        <Link to="/terms-and-conditions">Terms and Conditions</Link>
                                    </span>
                                    <span style={{ color: colors.textColor, fontSize: '12px', marginRight: '20px' }}>
                                        <Link to="/about-us">About Us</Link>
                                    </span>
                                    <span style={{ color: colors.textColor, fontSize: '12px' }}>
                                        <Link to="/contact-us">Contact Us</Link>
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div >
            </Form >
        </>
    );
};

export default AdminRegister;
