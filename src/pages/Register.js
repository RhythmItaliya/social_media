
// Register.js
import { Form, Input } from 'antd';
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import './Form.css';

// Redux
import { connect } from 'react-redux';
import { registerUser } from '../actions/registerAuth';

const Register = ({ registerUser, register, error, loading }) => {

    const onFinish = (values) => {
        registerUser(values);
    };

    return (
        <Form className='login-form' onFinish={onFinish}>
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
                                <h4 className="mb-4 text-center">Sign in to Name</h4>

                                {/* Login Form */}
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
                                                prefix={<UserOutlined className="site-form-item-icon me-2" />}
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
                                                prefix={<LockOutlined className="site-form-item-icon me-2" />}
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
                                                prefix={<MailOutlined className="site-form-item-icon me-2" />}
                                            />
                                        </Form.Item>
                                    </div>

                                    <button type='submit' className='btn w-100 mt-2 btn-primary btn-block'>
                                        {loading ? 'Signing up...' : 'Sign up'}
                                    </button>
                                </div>

                                <hr />

                                {/* Additional Options */}
                                <div className="text-center">
                                    <Link to="/login" className="d-block d-sm-inline">Login for Name</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </Form >
    );
};

const mapStateToProps = (state) => ({
    // registering: state.register.registering,
    loading: state.register.loading,
    error: state.register.error,
});

export default connect(mapStateToProps, { registerUser })(Register);