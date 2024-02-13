// Login.js
import { Form, Input, Button, Divider, message } from 'antd';
import { useDarkMode } from '../theme/Darkmode';
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { noop } from "antd/es/_util/warning";
import { MailOutlineOutlined } from '@material-ui/icons';

import './Form.css';

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


const ForgotPassword = () => {

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;
    const [loading, setLoading] = useState(false);

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
    };

    const forgotPasswordbtn = (evt) => {
        const mail = email.current.input.value;

        if (!mail) {
            message.warning("Please enter your email");
            return;
        }

        setLoading(true);

        fetch('http://localhost:8080/reset/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: mail }),
        })
            .then((res) => {
                if (res.ok) {
                    message.success("Check Your Email.");
                    setTimeout(() => window.location.href = "/login", 4500);
                } else {
                    setLoading(false);
                    message.error("Email Can't be delivered.");
                }
            });
    };

    let email = useRef();

    return (
        <>
            <Form className="login-form justify-content-center align-items-center d-flex vh-100"
                style={{ backgroundColor: colors.backgroundColor, color: colors.textColor }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-4">
                            <div className='m-2 ' style={{ boxShadow: 'none', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                                <div className="card-body p-4" style={{ backgroundColor: colors.backgroundColor }}>
                                    <h4 className="mb-2 text-center" style={{ color: colors.textColor }}>
                                        Forgot Password to Name
                                    </h4>
                                    <img src="" alt="" className="img-fluid" />
                                    <div>


                                        <div className="form-group">
                                            <label htmlFor="email" className="p-1">Email</label>
                                            <Form.Item name={'email'} rules={[
                                                {
                                                    required: true,
                                                    message: noop,
                                                },
                                            ]}>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    placeholder="Enter your email"
                                                    prefix={<MailOutlineOutlined style={{ color: colors.iconColor, fontSize: '20px', margin: '3px' }} className="site-form-item-icon" />}
                                                    style={inputStyle}
                                                    ref={email}
                                                />
                                            </Form.Item>
                                        </div>

                                        <Button
                                            type="submit"
                                            onClick={forgotPasswordbtn}
                                            className="btn w-100 mt-2 btn-primary btn-block"
                                            disabled={loading}
                                            style={buttonStyle}
                                        >
                                            submit
                                        </Button>

                                    </div>

                                    <Divider className='p-0 m-1' />

                                    <div className="text-center">
                                        <Link to="/login" className="d-block d-sm-inline user-select-none " style={{ color: colors.hashtagColor, fontSize: '14px' }}>
                                            Log in for Name
                                        </Link>
                                        <span className="mx-2 d-none d-sm-inline user-select-none" style={{ color: colors.textColor }}>|</span>
                                        <Link to="/register" className="d-block d-sm-inline" style={{ color: colors.hashtagColor, fontSize: '14px' }}>
                                            Sign up for Name
                                        </Link>
                                    </div>
                                </div>
                                {/* <Button onClick={toggleDarkMode} type="link" style={{ color: colors.textColor, backgroundColor: colors.backgroundColor }}>
                                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                </Button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </Form >

        </>
    );
};

export default ForgotPassword;
