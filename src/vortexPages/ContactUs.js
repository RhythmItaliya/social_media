import React, { useEffect, useState } from 'react';
import VortexNav from './VortexNav';
import config from "../configuration";
import './vortexnav.css';
import { Alert } from 'antd';

const lightModeColors = {
    backgroundColor: '#ffffff',
    iconColor: 'rgb(0,0,0)',
    textColor: 'rgb(0,0,0)',
    focusColor: 'rgb(0,0,0)',
    border: '#CCCCCC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
    spinnerColor: 'rgb(0,0,0)',
    labelColor: '#8e8e8e',
    valueTextColor: 'rgb(0,0,0)',
    linkColor: '#000',
    hashtagColor: 'darkblue',
    transparentColor: 'rgba(255, 255, 255, 0.5)'
};

const darkModeColors = {
    backgroundColor: 'rgb(0,0,0)',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    focusColor: '#ffffff',
    border: '#333333',
    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
    spinnerColor: '#ffffff',
    labelColor: '#CCC',
    valueTextColor: '#ffffff',
    linkColor: '#CCC8',
    hashtagColor: '#8A2BE2',
    transparentColor: 'rgba(255, 255, 255, 0.5)'
};

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const ContactUs = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem('mode');
        setIsDarkMode(savedMode === 'dark');
    }, []);

    useEffect(() => {
        localStorage.setItem('mode', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const colors = isDarkMode ? darkModeColors : lightModeColors;
    
    useEffect(() => {
        if (formSubmitted) {
            setShowSuccessMessage(true);

            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [formSubmitted]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            valid = false;
        } else if (formData.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters';
            valid = false;
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
            valid = false;
        } else if (formData.message.trim().length < 20) {
            newErrors.message = 'Message must be at least 20 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            fetch(`${config.apiUrl}/contactsus/contactsus`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    note: formData.message
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    setFormSubmitted(true);
                    setFormData({
                        name: '',
                        email: '',
                        message: ''
                    });
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }
    };

    return (
        <>
            <div>
                <VortexNav />
            </div>
            <div className="container" style={{ marginTop: '80px', backgroundColor: colors.backgroundColor }}>
                <div className="contact3 py-5">
                    <div className="row no-gutters">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="card-shadow">
                                    <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/2.jpg" className="img-fluid" alt="Contact Image" />
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="contact-box ml-3 ">
                                    <h1 className="font-weight-light mt-5" style={{ color: "#ec1b90" }}>Quick Contact</h1>
                                    <div style={{ marginTop: '50px' }}>
                                        <form onSubmit={handleSubmit}>
                                            <div className="inputField">
                                                {errors.name && <span className="error text-danger">{errors.name}</span>}
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    placeholder="Your name"
                                                    autoComplete="off"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        padding: '10px',
                                                        width: '100%',
                                                        boxSizing: 'border-box',
                                                        borderRadius: '5px',
                                                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                                                        marginBottom: '10px'
                                                    }}
                                                />
                                            </div>
                                            <div className="inputField">
                                                {errors.email && <span className="error text-danger">{errors.email}</span>}
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder="Your email"
                                                    autoComplete="off"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        padding: '10px',
                                                        width: '100%',
                                                        boxSizing: 'border-box',
                                                        borderRadius: '5px',
                                                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                                                        marginBottom: '10px',
                                                    }}
                                                />
                                            </div>
                                            <div className="inputField">
                                                {errors.message && <span className="error text-danger">{errors.message}</span>}
                                                <textarea
                                                    name="message"
                                                    id="message"
                                                    placeholder="Your message"
                                                    value={formData.message}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        padding: '10px',
                                                        width: '100%',
                                                        boxSizing: 'border-box',
                                                        borderRadius: '5px',
                                                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                                                        marginBottom: '10px'
                                                    }}
                                                ></textarea>
                                            </div>
                                            <div className="inputField btn">
                                                <button
                                                    type="submit"
                                                    id="form-submit"
                                                    className="main-gradient-button"
                                                    disabled={formSubmitted}
                                                    style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                                >
                                                    {formSubmitted ? 'Message Sent!' : 'Send a message'}
                                                </button>
                                            </div>
                                        </form>

                                        {showSuccessMessage && (
                                            <Alert
                                                message="Thank you for reaching out!"
                                                description="Your message has been successfully sent. Our team will review it and get back to you as soon as possible."
                                                type="success"
                                                className='text-center mt-4'
                                                style={{ color: colors.textColor, fontSize: '12px' }}
                                            />
                                        )}

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="card mt-4 border-0 mb-4">
                                    <div className="row">
                                        <div className="col-lg-4 col-md-4">
                                            <div className="card-body d-flex align-items-center c-detail gap-3">
                                                <div className="mr-3 align-self-center" style={{ cursor: 'pointer' }}>
                                                    <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon1.png" alt="Address Icon" />
                                                </div>
                                                <div className="" style={{ color: colors.textColor }}>
                                                    <h6 className="font-weight-medium" style={{ color: "#ec1b90" }}>Address</h6>
                                                    <p className="">601 Sherwood Ave.
                                                        <br /> San Bernandino</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4">
                                            <div className="card-body d-flex align-items-center c-detail gap-3">
                                                <div className="mr-3 align-self-center" style={{ cursor: 'pointer' }}>
                                                    <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon2.png" alt="Phone Icon" />
                                                </div>
                                                <div className="" style={{ color: colors.textColor }}>
                                                    <h6 className="font-weight-medium" style={{ color: "#ec1b90" }}>Phone</h6>
                                                    <p className="">251 546 9442
                                                        <br /> 630 446 8851</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4">
                                            <div className="card-body d-flex align-items-center c-detail gap-3">
                                                <div className="mr-3 align-self-center" style={{ cursor: 'pointer' }}>
                                                    <img src="https://www.wrappixel.com/demos/ui-kit/wrapkit/assets/images/contact/icon3.png" alt="Email Icon" />
                                                </div>
                                                <div className="" style={{ color: colors.textColor }}>
                                                    <h6 className="font-weight-medium" style={{ color: "#ec1b90" }}>Email</h6>
                                                    <p className="">
                                                        info@wrappixel.com
                                                        <br /> 123@wrappixel.com
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactUs;
