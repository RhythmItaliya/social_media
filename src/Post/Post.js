import * as React from 'react';
import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';

import Logo from '../assets/Millie.png';

import { useDispatch, useSelector } from 'react-redux';
import { setUserProfilePosts } from '../actions/authActions';
import { useEffect } from 'react';
import { useDarkMode } from '../theme/Darkmode';
import { Link } from 'react-router-dom';


import Comment from './Comment'; // Import the Comment component

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
  hashtagColor: '#8A2BE2', // Ch
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const instagramStyles = {
  roundedAvatar: {
    borderRadius: '50%',
  },
  instagramIcons: {
    color: '#262626',
  },
  instagramCardContent: {
    paddingTop: 0,
  },
};

export default function InstagramCard() {
  const [expandedPosts, setExpandedPosts] = React.useState({});
  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState('');
  const [postComments, setPostComments] = React.useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [expandedText, setExpandedText] = React.useState(false);
  const [newUserProfile, setNewUserProfile] = React.useState({});
  const dispatch = useDispatch();
  const profileUUID = useSelector((state) => state.profileuuid.uuid);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  useEffect(() => {
    const fetchPosts = async () => {

      try {

        setLoading(true);

        const response = await fetch(`http://localhost:8080/find/api/posts/${profileUUID}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const updatedUserProfile = {
          id: data.userProfile.id,
          username: data.userProfile.username,
          photoURL: data.userProfile.photoURL,
          posts: data.posts.map((post) => ({
            id: post.id,
            postText: post.postText,
            isPhoto: post.isPhoto,
            caption: post.caption,
            location: post.location,
            isVisibility: post.isVisibility,
            postUploadURLs: post.postUploadURLs,
            hashtags: post.hashtags ? `#${JSON.parse(post.hashtags).join(' #')}` : '',
            uuid: post.uuid,
            createdAt: new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          })),
        };

        setNewUserProfile(updatedUserProfile);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Set loading to false on error
        setLoading(false);
        // Set error state to display an error message to the user
        setError(error.message);
      }
    };

    fetchPosts();
  }, [profileUUID]);

  useEffect(() => {
    dispatch(setUserProfilePosts(newUserProfile));
  }, [newUserProfile, dispatch]);


  // COMMENT HANDLING ------------------------------------

  const handleExpandClick = (postId) => {
    setExpandedPosts((prevExpanded) => ({
      ...prevExpanded,
      [postId]: !prevExpanded[postId],
    }));
  };

  const handleCommentSubmit = (postId) => {
    const newComment = {
      id: Date.now(),
      username: 'User123',
      avatar: Logo,
      text: comment,
      likes: 0,
      replies: [],
    };

    setPostComments((prevComments) => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), newComment],
    }));

    setComment('');
  };

  const handleLikeComment = (postId, commentId) => {
    const updatedComments = (postComments[postId] || []).map((comment) =>
      comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
    );

    setPostComments((prevComments) => ({
      ...prevComments,
      [postId]: updatedComments,
    }));
  };

  const handleDeleteComment = (postId, commentId) => {
    const updatedComments = (postComments[postId] || []).filter((comment) => comment.id !== commentId);

    setPostComments((prevComments) => ({
      ...prevComments,
      [postId]: updatedComments,
    }));
  };

  const handleReplySubmit = (postId, replyText, commentId) => {
    const newReply = {
      id: Date.now(),
      username: 'User123',
      avatar: Logo,
      text: replyText,
      likes: 0,
    };

    const updatedComments = (postComments[postId] || []).map((comment) =>
      comment.id === commentId ? { ...comment, replies: [...comment.replies, newReply] } : comment
    );

    setPostComments((prevComments) => ({
      ...prevComments,
      [postId]: updatedComments,
    }));
  };

  const handleLikeReply = (postId, commentId, replyIndex) => {
    const updatedComments = (postComments[postId] || []).map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies.map((reply, index) =>
          index === replyIndex ? { ...reply, likes: reply.likes + 1 } : reply
        );

        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });

    setPostComments((prevComments) => ({
      ...prevComments,
      [postId]: updatedComments,
    }));
  };

  const handleDeleteReply = (postId, commentId, replyIndex) => {
    const updatedComments = (postComments[postId] || []).map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies.filter((_, index) => index !== replyIndex);
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });

    setPostComments((prevComments) => ({
      ...prevComments,
      [postId]: updatedComments,
    }));
  };


  // ------------------------------------

  const handleMoreVertClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreVertClose = () => {
    setAnchorEl(null);
  };


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (

    <div className={`vh-100 overflow-scroll ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          {newUserProfile.posts && newUserProfile.posts.map((post) => (
            <Card key={post.id} sx={{
              maxWidth: 420,
              marginBottom: 2,
              marginTop: 2,
              backgroundColor: colors.backgroundColor,
              border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            }}>

              {/* ------------------------------------------------------------------------------------------------- */}
              <CardHeader

                // AVTAR
                avatar={
                  <Avatar
                    src={`http://static.profile.local/${newUserProfile.photoURL}`}
                    alt="User Avatar"
                    sx={{
                      ...instagramStyles.roundedAvatar,
                      width: 40,
                      height: 40,
                      backgroundColor: colors.backgroundColor,

                    }}
                  />
                }

                // POST ACTION
                action={
                  <IconButton
                    aria-label="settings"
                    sx={{
                      ...instagramStyles.roundedAvatar,
                      color: colors.iconColor,
                    }}
                    onClick={handleMoreVertClick}
                  >

                    <MoreVertIcon
                      sx={{ color: colors.iconColor }}
                    />
                  </IconButton>
                }


                // USERNAME
                title={newUserProfile.username}

                // DATE
                subheader={post.createdAt}


                sx={{
                  color: colors.textColor,
                  borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                  '& .MuiCardHeader-subheader': {
                    color: colors.labelColor,
                  },
                }}

              />


              {/* ------------------------------------------------------------------------------------------------- */}

              {/* POST */}
              <CardMedia
                component="img"
                height="400"
                image={`http://static.post.local/${post.postUploadURLs}`}
                alt="Post Image"
                sx={{
                  background: '#fffff',
                  borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                }}
              />

              {/* ------------------------------------------------------------------------------------------------- */}

              {/* HASHTAGE */}
              <CardContent className='p-0' sx={{
                ...instagramStyles.instagramCardContent,
                backgroundColor: colors.backgroundColor,
                width: '95%',
                margin: 'auto',

              }}>
                <Typography variant="body2" className='p-1 mt-2'>
                  {post.hashtags.split(' ').map((hashtag, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && ' '}
                      <Link to={`/hashtags/${encodeURIComponent(hashtag)}`} style={{
                        color: colors.hashtagColor,
                      }}>
                        {`${hashtag}`}
                      </Link>
                    </React.Fragment>
                  ))}
                </Typography>
              </CardContent>

              {/* ------------------------------------------------------------------------------------------------- */}

              {/* TEXT */}
              <CardContent className='p-0'
                sx={{
                  ...instagramStyles.instagramCardContent, backgroundColor: colors.backgroundColor, borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                }}>

                <div
                  className={`truncate-text ${expandedText ? 'expanded' : ''}`}
                  style={{ maxHeight: expandedText ? '100%' : '3em', overflow: 'hidden', position: 'relative' }}
                >
                  <Typography variant="body2" className='p-1' sx={{ color: colors.labelColor, textAlign: 'start' }}>
                    {post.postText}
                  </Typography>
                </div>

                {/* "Show More" link */}
                {post.postText.split('\n').length > 3 && (
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setExpandedText(!expandedText)}
                    className="show-more-link"
                    style={{
                      color: colors.linkColor,
                      fontSize: '12px',
                      justifyContent: 'end',
                      display: 'flex',
                      alignContent: 'end',
                      width: '85%',
                      margin: 'auto',
                      padding: '5px',
                      textDecoration: 'none'
                    }}
                  >
                    {expandedText ? 'Show Less' : 'Show More'}
                  </Link>
                )}
              </CardContent>

              {/* ------------------------------------------------------------------------------------------------- */}


              {/* ICON */}
              <CardActions disableSpacing className="justify-content-between d-flex">
                <IconButton aria-label="add to favorites" sx={instagramStyles.instagramIcons}>
                  <FavoriteIcon sx={{ color: colors.iconColor }} />
                </IconButton>

                <IconButton aria-label="comment" onClick={() => handleExpandClick(post.id)} sx={instagramStyles.instagramIcons}>
                  <CommentIcon sx={{ color: colors.iconColor }} />
                </IconButton>

                <IconButton aria-label="share" sx={instagramStyles.instagramIcons}>
                  <ShareIcon sx={{ color: colors.iconColor }} />
                </IconButton>
              </CardActions>

              {/* ------------------------------------------------------------------------------------------------- */}

              {/* COMMENT HANDALING */}
              <Collapse in={expandedPosts[post.id]} timeout="auto" unmountOnExit sx={{ borderTop: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                <CardContent>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      label="Add a comment"
                      multiline
                      fullWidth
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      variant="standard"
                      size="small"
                      InputProps={{
                        style: {
                          color: colors.textColor,
                          borderBottom: `1px solid ${colors.border}`,
                          '&:focus': {
                            color: colors.focusColor,
                          },
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: colors.labelColor,
                        },
                      }}
                    />
                    <IconButton aria-label="submit comment" onClick={() => handleCommentSubmit(post.id)}>
                      <SendIcon sx={{ color: colors.iconColor }} />
                    </IconButton>
                  </div>
                  {(postComments[post.id] || []).map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      handleLikeComment={(commentId) => handleLikeComment(post.id, commentId)}
                      handleDeleteComment={(commentId) => handleDeleteComment(post.id, commentId)}
                      handleReplySubmit={(replyText, commentId) => handleReplySubmit(post.id, replyText, commentId)}
                      handleLikeReply={(commentId, replyIndex) => handleLikeReply(post.id, commentId, replyIndex)}
                      handleDeleteReply={(commentId, replyIndex) => handleDeleteReply(post.id, commentId, replyIndex)}
                      isUser123={comment.username === 'User123'}
                    />
                  ))}
                </CardContent>
              </Collapse>

              {/* POST SETTINGS */}
              < Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleMoreVertClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography>Settings about post</Typography>
                </Box>
              </Popover >
            </Card>
          ))
          }
        </div >
      )}
    </div >
  );
}