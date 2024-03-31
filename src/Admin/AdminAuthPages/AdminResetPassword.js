// AdminResetPassword.js

import { Form, Input, Button, Divider, message } from 'antd';
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MailOutlineOutlined } from '@material-ui/icons';
import LoadingSpinner from '../../others/LoadingSpinner';
import { useDarkMode } from '../../theme/Darkmode';
import config from '../../configuration';

import logoImage from '../../assets/vortex.png';


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

const AdminResetPassword = () => {
    const [isValid, setIsValid] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useParams();

    const { isDarkMode } = useDarkMode();
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

    useEffect(() => {
        const checkLinkExpire = async () => {
            try {
                const res = await fetch(`${config.apiUrl}/admins/admin/resetlink/verify/${token}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const dataA = await res.json();

                if (res.ok) {
                    setIsValid(dataA.isValid);
                } else {
                    setIsValid(false);
                    setLoading(false);
                }
            } catch (e) {
                console.log(e);
                setLoading(false);
            }
        };

        if (token) {
            checkLinkExpire();
        } else {
            setIsValid(false);
            setLoading(false);
        }
    }, [token]);

    const resetpasswordbtn = async (evt) => {
        evt.target.disabled = true;
        try {
            const pass1 = password1.current.input.value;
            const pass2 = password2.current.input.value;

            if (!(pass1 === pass2)) {
                evt.target.disabled = false;
                return message.warning("Password Can't be matched");
            }

            const res = await fetch(`${config.apiUrl}/admins/admin/reset/password/${token}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password1: pass1, password2: pass2 }),
            });

            if (res.ok) {
                message.success("Password Reset Successfully. Redirecting...");
                setTimeout(() => (window.location.href = '/admin/login'), 4500);
            } else {
                message.error("The link has expired. Please try again. Redirecting...");
                setTimeout(() => (window.location.href = '/admin/forgotpassword'), 4500);
            }
        } catch (e) {
            evt.target.disabled = false;
            console.log(e);
        }
    };

    let password1 = useRef();
    let password2 = useRef();

    if (loading) {
        return <LoadingSpinner />;
    }


    if (isValid === false) {
        return (
            <div className="text-center mt-3">
                <h2 className="mb-2 text-center" style={{ color: colors.textColor }}>
                    Link is invalid...
                </h2>
                <Link to="/login" className="d-block d-sm-inline user-select-none " style={{ color: colors.hashtagColor, fontSize: '14px' }}>
                    Log in as a Admin
                </Link>
            </div>
        );
    } else {
        return (
            <Form className="login-form justify-content-center align-items-center d-flex vh-100"
                style={{ backgroundColor: colors.backgroundColor, color: colors.textColor }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-4">

                            <div>
                                <img src={logoImage} alt="Logo" className="mb-5 mx-auto d-block user-select-none" style={{ width: '250px' }} />
                                <p className="mb-3 mt-3 text-center" style={{ color: colors.textColor, fontSize: '16px' }}>
                                    Admin Reset password
                                </p>
                            </div>

                            <div className='m-2 ' style={{ boxShadow: 'none', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                                <div className="card-body p-4" style={{ backgroundColor: colors.backgroundColor }}>

                                    <div>
                                        <div>
                                            <div className="form-group">
                                                <label htmlFor="password1" className="p-1">Enter new password</label>
                                                <Form.Item name={'password1'} rules={[
                                                    {
                                                        required: true,
                                                        min: 8,
                                                    }
                                                ]}>
                                                    <Input
                                                        type="password"
                                                        id="password1"
                                                        placeholder="New password"
                                                        prefix={<MailOutlineOutlined className="site-form-item-icon me-2" />}
                                                        ref={password1}
                                                        style={inputStyle}

                                                    />
                                                </Form.Item>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="password2" className="p-1">Confirm your password</label>
                                                <Form.Item name={'password2'} rules={[
                                                    {
                                                        required: true,
                                                        min: 8,
                                                    }
                                                ]}>
                                                    <Input
                                                        type="password"
                                                        id="password2"
                                                        placeholder="Confirm password"
                                                        prefix={<MailOutlineOutlined className="site-form-item-icon me-2" />}
                                                        ref={password2}
                                                        style={inputStyle}
                                                    />
                                                </Form.Item>
                                            </div>

                                            <Button
                                                type="submit"
                                                onClick={resetpasswordbtn}
                                                className="btn w-100 mt-2 btn-primary btn-block"
                                                disabled={loading}
                                                style={buttonStyle}
                                            >
                                                Set New Password
                                            </Button>
                                        </div>
                                    </div>

                                    <Divider className='p-0 m-1' />

                                    <div className="text-center">
                                        <Link to="/admin/login" className="d-block d-sm-inline user-select-none " style={{ color: colors.hashtagColor, fontSize: '14px' }}>
                                            Log in as a Admin
                                        </Link>
                                        <span className="mx-2 d-none d-sm-inline user-select-none" style={{ color: colors.textColor }}>|</span>
                                        <Link to="/admin/register" className="d-block d-sm-inline" style={{ color: colors.hashtagColor, fontSize: '14px' }}>
                                            Sign up as a Admin
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

        )
    }
}



export default AdminResetPassword;