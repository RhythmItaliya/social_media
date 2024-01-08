import { Form, Input, message } from 'antd';
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MailOutlined } from '@ant-design/icons';
import './Form.css';
import LoadingSpinner from '../others/LoadingSpinner';

const ResetPassword = () => {
    const [isValid, setIsValid] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useParams();

    useEffect(() => {
        const checkLinkExpire = async () => {
            try {
                const res = await fetch(`http://localhost:8080/resetlink/verify/${token}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                );

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
    }, []);

    const resetpasswordbtn = async (evt) => {
        evt.target.disabled = true;
        try {
            const pass1 = password1.current.input.value;
            const pass2 = password2.current.input.value;


            if (!(pass1 == pass2)) {
                evt.target.disabled = false;
                return message.warning("Password Can't be matched");
            }

            const res = await fetch(`http://localhost:8080/reset/password/${token}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password1: pass1, password2: pass2 }),
            });

            if (res.ok) {
                message.success("Password Reset Successfully. Redirecting...");
                setTimeout(() => window.location.href = '/login', 3000);
            } else {
                message.error("The link has expired. Please try again. Redirecting...");
                setTimeout(() => window.location.href = '/forgotpassword', 3000);
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

    if (isValid == false) {
        return <div className="text-center mt-3">
            <h2>Link is invalid...</h2>
            <Link to="/login">Go to Home</Link>
        </div>
    } else {
        return (
            <Form className='login-form'>
                <div className="container">
                    <div className="row justify-content-center mt-5">
                        <div className="col-sm-12 col-md-8 col-lg-4">
                            <div className="card">
                                <div className="card-body p-4">
                                    <img
                                        src=""
                                        alt=""
                                        className="img-fluid mb-4"
                                    />
                                    <h4 className="mb-4 text-center">Reset your password</h4>

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
                                                    prefix={<MailOutlined className="site-form-item-icon me-2" />}
                                                    ref={password1}
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
                                                    prefix={<MailOutlined className="site-form-item-icon me-2" />}
                                                    ref={password2}
                                                />
                                            </Form.Item>
                                        </div>

                                        <button
                                            type="submit"
                                            onClick={resetpasswordbtn}
                                            className="btn w-100 mt-2 btn-primary btn-block">
                                            Set New Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Form >
        )
    }
}



export default ResetPassword;