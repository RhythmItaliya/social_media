// Login.js
import { Form, Input, Button, Spin, Divider } from 'antd';
import { Link } from 'react-router-dom';
import './Form.css';
import { useDarkMode } from '../theme/Darkmode';

// Redux
import { connect } from 'react-redux';
import { registerUser } from '../actions/registerAuth';


import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';
import { MailOutlineOutlined } from '@material-ui/icons';

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


const Register = ({ registerUser, register, error, loading }) => {

    const onFinish = (values) => {
        registerUser(values);
    };

    const { isDarkMode, toggleDarkMode } = useDarkMode();
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
    };

    return (

        <Form className="login-form justify-content-center align-items-center d-flex vh-100" onFinish={onFinish}
            style={{ backgroundColor: colors.backgroundColor, color: colors.textColor }}>
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-4">
                        <div className='m-2 ' style={{ boxShadow: 'none', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                            <div className="card-body p-4" style={{ backgroundColor: colors.backgroundColor }}>
                                <h4 className="mb-2 text-center" style={{ color: colors.textColor }}>
                                    Login to Name
                                </h4>
                                <img src="" alt="" className="img-fluid" />


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
                                            />
                                        </Form.Item>
                                    </div>

                                    <Button
                                        type="primary"
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
                                    <Link to="/login" className="d-block d-sm-inline" style={{ color: colors.hashtagColor, fontSize: '14px' }}>
                                        Log in Name
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

    );
};

const mapStateToProps = (state) => ({
    // registering: state.register.registering,
    loading: state.register.loading,
    error: state.register.error,
});

export default connect(mapStateToProps, { registerUser })(Register);