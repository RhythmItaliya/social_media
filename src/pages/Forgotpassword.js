import { useRef } from "react";
import { Link } from "react-router-dom";
import { Form, Input, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import './Form.css';
import { noop } from "antd/es/_util/warning";

const ForgotPassword = () => {
    const forgotPasswordbtn = (evt) => {

        const mail = email.current.input.value

        if(!mail){
            message.warning("Please enter your email");
            return;
        }

        evt.target.disabled = true;

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
                    evt.target.disabled = false;
                    message.error("Email Can't be delivred.");
                }
            });
    };

    let email = useRef();

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
                                        <label htmlFor="email" className="p-1">Enter your email</label>
                                        <Form.Item name="email" rules={[
                                            {
                                                required: true,
                                                message:noop,
                                            },
                                        ]}>
                                            <Input
                                                type="email"
                                                id="email"
                                                placeholder="Enter your Email"
                                                prefix={<MailOutlined className="site-form-item-icon me-2" />}
                                                ref={email}
                                            />
                                        </Form.Item>
                                    </div>

                                    <button
                                        type="submit"
                                        onClick={forgotPasswordbtn}
                                        className="btn mt-2 w-100 btn-primary btn-block">
                                        Submit
                                    </button>

                                    <hr />

                                    <div className="text-center">
                                        <Link to="/login" className="d-block d-sm-inline">Login for Name</Link>
                                        <span className="mx-2 d-none d-sm-inline">|</span>
                                        <Link to="/register" className="d-block d-sm-inline">Sign up for Name</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    )
}

export default ForgotPassword;