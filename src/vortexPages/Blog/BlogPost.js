import React, { useEffect, useState } from 'react';
import './css/styles.css';
import config from "../../configuration";
import { Alert } from 'antd';


const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};


const BlogPost = ({ colors }) => {
    const [blogs, setBlogs] = useState([]);
    const [latestBlog, setLatestBlog] = useState(null);
    const [keywordIndex, setKeywordIndex] = useState(0);
    const [titles, setTitles] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [name, setName] = useState('');


    const [formData, setFormData] = useState({
        name: '',

        message: ''
    });
    const [errors, setErrors] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        // Fetch all blogs
        fetch(`${config.apiUrl}/blogs/new/blogs`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (Array.isArray(data.blogs)) {
                        setBlogs(data.blogs);
                        if (data.blogs.length > 0) {
                            setLatestBlog(data.blogs[0]);
                        }
                    } else {
                        setLatestBlog(data.blog);
                    }
                } else {
                    console.error('Failed to fetch blogs:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching blogs:', error);
            })
            .finally(() => {
                setLoading(false);
            });

        // Fetch titles only
        fetch(`${config.apiUrl}/blogs/all/titles`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setTitles(data.titles);
                } else {
                    console.error('Failed to fetch titles:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching titles:', error);
            });
    }, []);

    const handleTitleClick = (id) => {
        fetch(`${config.apiUrl}/blogs/blogs/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setNewComment('');
                    setName('');
                    setSelectedBlog(data.blog);
                } else {
                    console.error('Failed to fetch blog post:', data.error);
                }
            })
            .catch(error => {
                console.error('Error fetching blog post:', error);
            });
    };


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

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
            valid = false;
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e, blogId) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch(`${config.apiUrl}/blogs/blogs/${blogId}/comments`, {
                    credentials: 'include',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        text: formData.message
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                setFormSubmitted(true);
                setFormData({
                    name: '',
                    message: ''
                });
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        }
    };

    return (
        <>
            <div className="container mt-5">
                <div className="row">
                    {/* Blog content */}
                    {loading ? (
                        <div className="col-lg-8 text-center mt-5">
                            <div className="loading-dots">
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    ) : selectedBlog || latestBlog ? (
                        <div className="col-lg-8">
                            <article>
                                <header className="mb-4">
                                    <h1 className="fw-bolder mb-1" style={{ color: '#ec1b90' }}>{selectedBlog ? selectedBlog.title : latestBlog.title}</h1>
                                    <div className="text-muted fst-italic mb-2" style={{ color: colors.labelColor }}>Posted on {new Date(selectedBlog ? selectedBlog.createdAt : latestBlog.createdAt).toLocaleDateString()} by Vortex</div>
                                    <div className='gap-3'>
                                        {(selectedBlog ? selectedBlog.keyword : latestBlog.keyword) && (
                                            typeof (selectedBlog ? selectedBlog.keyword : latestBlog.keyword) === 'string' ? (
                                                Object.values(JSON.parse(selectedBlog ? selectedBlog.keyword : latestBlog.keyword)).map(keyword => (
                                                    <span key={keyword} className="badge bg-secondary text-decoration-none text-light user-select-none" style={{ margin: '0 5px' }}>{keyword}</span>
                                                ))
                                            ) : (
                                                (selectedBlog ? selectedBlog.keyword : latestBlog.keyword).map((keyword, index) => (
                                                    <span key={index} className="badge bg-secondary text-decoration-none text-light user-select-none" style={{ margin: '0 5px' }}>{keyword}</span>
                                                ))
                                            )
                                        )}
                                    </div>
                                </header>
                                <figure className="mb-4"><img className="img-fluid rounded" src={`http://static.blogs.local/${selectedBlog ? selectedBlog.blogURL : latestBlog.blogURL}`} alt="..." /></figure>
                                <div className="card-body">
                                    <section className="mb-5">
                                        <div style={{ color: colors.textColor }} className="fs-5" dangerouslySetInnerHTML={{ __html: selectedBlog ? selectedBlog.contentarea : latestBlog.contentarea }} />
                                    </section>
                                </div>

                                <div>

                                    <div className="card mb-4">
                                        <div className="card-header" style={{ color: "#ec1b90" }}>Comments</div>
                                        <div className="card-body">
                                            <form onSubmit={(e) => handleSubmit(e, selectedBlog ? selectedBlog.id : latestBlog.id)}>
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
                                        </div>
                                    </div>


                                    {showSuccessMessage && (
                                        <Alert
                                            message="Thank you for Your Comment!"
                                            type="success"
                                            className='text-center mt-4 mb-5'
                                            style={{ color: colors.textColor, fontSize: '12px' }}
                                        />
                                    )}

                                    {(selectedBlog || latestBlog) && (selectedBlog ? selectedBlog.comments : latestBlog.comments) && (selectedBlog ? selectedBlog.comments : latestBlog.comments).map(comment => (
                                        <div key={comment.id} className="card mt-3 mb-3">
                                            <div className="card-body">
                                                <p className='fw-bold'>{comment.name}</p>
                                                <p className="card-text">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </article>
                        </div>
                    ) : (
                        <div className="col-lg-8">
                            <p style={{ color: colors.textColor }}>No blogs found.</p>
                        </div>
                    )}

                    {/* Sidebar */}
                    <div className="col-lg-4">
                        {/* Title */}
                        <div className="card mb-4">
                            <div className="card-header" style={{ color: "#ec1b90" }}>New Blogs</div>
                            <div className="card-body">
                                <ul id="blog-list">
                                    {/*  titles */}
                                    {titles && titles.length > 0 ? (
                                        titles.map(title => (
                                            <li key={title.id}>
                                                <span
                                                    className={`text-decoration-none ${selectedBlog && selectedBlog.id === title.id ? 'active-title' : ''}`}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleTitleClick(title.id)}
                                                >
                                                    {title.title}
                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No titles found.</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Keywords */}
                        <div className="card mb-4">
                            <div className="card-header" style={{ color: "#ec1b90" }}>Keywords</div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <ul className="list-unstyled mb-0">
                                            {/*  first 3 keywords */}
                                            {(selectedBlog || latestBlog) && (selectedBlog ? selectedBlog.keyword : latestBlog.keyword) && (
                                                typeof (selectedBlog ? selectedBlog.keyword : latestBlog.keyword) === 'string' ? (
                                                    Object.values(JSON.parse(selectedBlog ? selectedBlog.keyword : latestBlog.keyword)).slice(keywordIndex, keywordIndex + 3).map((keyword, index) => (
                                                        <li key={index}><span className='text-decoration-underline'>{keyword}</span></li>
                                                    ))
                                                ) : (
                                                    (selectedBlog ? selectedBlog.keyword : latestBlog.keyword).slice(keywordIndex, keywordIndex + 3).map((keyword, index) => (
                                                        <li key={index}><span className='text-decoration-underline'>{keyword}</span></li>
                                                    ))
                                                )
                                            )}
                                        </ul>
                                    </div>

                                    {/*  next 3 keywords */}
                                    {(selectedBlog || latestBlog) && (selectedBlog ? selectedBlog.keyword : latestBlog.keyword) && (selectedBlog ? selectedBlog.keyword : latestBlog.keyword).length > 3 && (
                                        <div className="col-sm-6">
                                            <ul className="list-unstyled mb-0">
                                                {typeof (selectedBlog ? selectedBlog.keyword : latestBlog.keyword) === 'string' ? (
                                                    Object.values(JSON.parse(selectedBlog ? selectedBlog.keyword : latestBlog.keyword)).slice(keywordIndex + 3, keywordIndex + 6).map((keyword, index) => (
                                                        <li key={index}><span className='text-decoration-underline'>{keyword}</span></li>
                                                    ))
                                                ) : (
                                                    (selectedBlog ? selectedBlog.keyword : latestBlog.keyword).slice(keywordIndex + 3, keywordIndex + 6).map((keyword, index) => (
                                                        <li key={index}><span className='text-decoration-underline'>{keyword}</span></li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >

            {/* Footer */}
            < footer className="py-5 card" >
                <div className="container">
                    <p className="m-0 text-center" style={{ color: '#ec1b90' }}>Copyright &copy; Vortex 2023</p>
                </div>
            </footer >
        </>
    );
}

export default BlogPost;
