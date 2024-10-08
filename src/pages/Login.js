// Login.js
import { Form, Input, Button, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
// Redux
import { connect } from 'react-redux';
import { loginUser } from '../actions/loginAuth';
import './Form.css';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';

import logoImage from '../assets/vortex.png';

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


const Login = ({ loginUser, loading, loggingIn, login, error }) => {

    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        const savedMode = localStorage.getItem('mode');
        setIsDarkMode(savedMode === 'dark');
    }, []);

    useEffect(() => {
        localStorage.setItem('mode', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const colors = isDarkMode ? darkModeColors : lightModeColors;

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

    const onFinish = async (values) => {
        await loginUser(values);
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
                                    Log in to Vortex
                                </p>
                            </div>

                            <div className='m-2 rounded-1' style={{ boxShadow: 'none', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                                <div className="card-body p-4" style={{ backgroundColor: colors.backgroundColor }}>
                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="username" className="p-1" style={labelStyle}>
                                                Username or email address
                                            </label>
                                            <Form.Item
                                                name="username"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input your username!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    type="text"
                                                    id="username"
                                                    placeholder="Enter your username or email"
                                                    prefix={<Person4OutlinedIcon style={{ color: colors.iconColor, fontSize: '20px', margin: '3px' }} className="site-form-item-icon" />}
                                                    style={inputStyle}
                                                    className="placeholder-style"
                                                    autoComplete="off"
                                                />
                                            </Form.Item>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password" className="p-1" style={labelStyle}>
                                                Password
                                            </label>
                                            <Form.Item
                                                name="password"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input your password!',
                                                    },
                                                ]}
                                            >
                                                <Input.Password
                                                    type="password"
                                                    id="password"
                                                    placeholder="Enter your password"
                                                    prefix={<LockOutlinedIcon style={{ color: colors.iconColor, fontSize: '20px', margin: '3px' }} className="site-form-item-icon" />}
                                                    style={inputStyle}
                                                    className="placeholder-style"
                                                    autoComplete="off"
                                                />
                                            </Form.Item>
                                        </div>

                                        <Button
                                            htmlType="submit"
                                            className="btn w-100 mt-2 btn-primary btn-block"
                                            disabled={loading}
                                            style={buttonStyle}
                                        >
                                            {loading ? 'Loading...' : 'Log in'}
                                        </Button>

                                    </div>

                                    <Divider className='p-0 m-1' />

                                    <div className="text-center">
                                        <Link to="/forgotpassword" className="d-block d-sm-inline user-select-none " style={{ color: colors.hashtagColor, fontSize: '14px' }}>
                                            Forgot password?
                                        </Link>
                                        <span className="mx-2 d-none d-sm-inline user-select-none" style={{ color: colors.textColor }}>|</span>
                                        <Link to="/register" className="d-block d-sm-inline" style={{ color: colors.hashtagColor, fontSize: '14px' }}>
                                            Sign up for Vortex
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
                                    <span style={{ color: colors.textColor, fontSize: '12px', marginRight: '20px' }}>
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
                </div>
            </Form >

        </>
    );
};

const mapStateToProps = (state) => ({
    loggingIn: state.login.loggingIn,
    error: state.login.error,
    loading: state.login.loading,
});

export default connect(mapStateToProps, { loginUser })(Login);