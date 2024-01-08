
// Login.js
import { Form, Input, Button, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

// Redux
import { connect } from 'react-redux';
import { loginUser } from '../actions/loginAuth';
import './Form.css';


const Login = ({ loginUser, loading, loggingIn, login, error }) => {

    const onFinish = async (values) => {
        await loginUser(values);
    };

    return (
        <Form className="login-form" onFinish={onFinish}>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-sm-12 col-md-8 col-lg-4">
                        <div className="card">
                            <div className="card-body p-4">
                                <img src="" alt="" className="img-fluid mb-4" />
                                <h4 className="mb-4 text-center">Login to Name</h4>

                                {/* Login Form */}
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="username" className="p-1">
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
                                                prefix={<UserOutlined className="site-form-item-icon me-2" />}
                                            />
                                        </Form.Item>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password" className="p-1">
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
                                                prefix={<LockOutlined className="site-form-item-icon me-2" />}
                                            />
                                        </Form.Item>
                                    </div>

                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="btn w-100 mt-2 btn-primary btn-block"
                                        disabled={loading}
                                    >
                                        {loading ? <Spin size="small" /> : 'Log in'}
                                    </Button>
                                </div>


                                <hr />

                                {/* Additional Options */}
                                <div className="text-center">
                                    <Link to="/forgotpassword" className="d-block d-sm-inline">
                                        Forgot password?
                                    </Link>
                                    <span className="mx-2 d-none d-sm-inline">|</span>
                                    <Link to="/register" className="d-block d-sm-inline">
                                        Sign up for Name
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    );
};


const mapStateToProps = (state) => ({
    loggingIn: state.login.loggingIn,
    error: state.login.error,
    loading: state.login.loading,
});


export default connect(mapStateToProps, { loginUser })(Login);