import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from '@mui/material/Popover';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfilePosts } from '../actions/authActions';
import { useEffect } from 'react';
import { useDarkMode } from '../theme/Darkmode';
import { Link } from 'react-router-dom';

import Comment from './Comment';
import config from '../configuration';


import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';
import { Box, List, ListItem, ListItemText, Modal, TextareaAutosize } from '@mui/material';
import { message } from 'antd';

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

export default function FriendPost({ hashtag }) {
  const containerRef = React.useRef(null);

  const [mergedData, setMergedData] = React.useState([]);

  const [expandedPosts, setExpandedPosts] = React.useState({});
  const [expandedText, setExpandedText] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [comment, setComment] = React.useState('');
  const [commentCounts, setCommentCounts] = React.useState({});
  const [postComments, setPostComments] = React.useState({});

  const [likeCounts, setLikeCounts] = React.useState({});
  const [likedPosts, setLikedPosts] = React.useState([]);

  const [shareCounts, setShareCounts] = React.useState({});

  const [likedComments, setLikedComments] = React.useState([]);

  const dispatch = useDispatch();

  // Profile UUID
  const profileUUID = useSelector((state) => state.profileuuid.uuid);

  // Logo
  const setLogo = useSelector((state) => state.userPhoto.photoUrl);

  // Username
  const setUsername = useSelector((state) => state.name.username);

  // loading state
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [commentLoading, setCommentLoading] = React.useState(false);

  // Dark mode
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;


  // POST_FACTCH_FRIEND -------------------------------------------------
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${config.apiUrl}/hashtags/hashtags/${profileUUID}?hashtag=${hashtag}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const updatedUserProfile = {
          posts: data.friendsPosts.map((post) => ({
            id: post.id,
            userProfileId: post.userProfileId,
            postText: post.postText,
            isPhoto: post.isPhoto,
            caption: post.caption,
            location: post.location,
            isVisibility: post.isVisibility,
            postUploadURLs: post.postUploadURLs,
            hashtags: post.hashtags
              ? Array.isArray(post.hashtags)
                ? post.hashtags.map((hashtag) => `${hashtag}`).join(' ')
                : `${post.hashtags}`
              : '',
            uuid: post.uuid,
            createdAt: new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          })),
          likedPosts: data.likedPosts,
          friendPostIds: data.friendPostIds,
          otherPostIds: data.otherPostIds
        };

        const updatedUserinfo = {
          friends: data.friends.map((friend) => ({
            id: friend.id,
            username: friend.username,
            photoURL: friend.photoURL,
          })),
        };

        const updatedMergedData = updatedUserProfile.posts.map(post => {
          const userInfo = updatedUserinfo.friends.find(friend => friend.id === post.userProfileId);
          if (userInfo) {
            return {
              id: post.id,
              userProfileId: post.userProfileId,
              postText: post.postText,
              isPhoto: post.isPhoto,
              caption: post.caption,
              location: post.location,
              isVisibility: post.isVisibility,
              postUploadURLs: post.postUploadURLs,
              hashtags: post.hashtags,
              uuid: post.uuid,
              createdAt: post.createdAt,
              username: userInfo.username,
              photoURL: userInfo.photoURL,
            };
          }

          return null;
        }).filter(post => post !== null);

        setMergedData(updatedMergedData);
        setLoading(false);

        await Promise.all(updatedUserProfile.posts.map(async (post) => {
          await fetchUserData(post.id);
        }));

      } catch (error) {
        console.log('Error fetching posts:', error);
        setLoading(false);
        setError(error.message);
      }
    };

    fetchPosts();
  }, [profileUUID, hashtag]);




  useEffect(() => {
    dispatch(setUserProfilePosts(mergedData));
  }, [mergedData, dispatch]);


  // Like click ------------------------------------
  const [likeSuccess, setLikeSuccess] = React.useState(false);

  const getIcon = (postId) => {
    // Check if the post is liked
    const isLiked = likedPosts.includes(postId);
    // Determine which icon to display based on the liked status
    return isLiked ? <FavoriteTwoToneIcon style={{ color: colors.iconColor }} /> : <FavoriteBorderTwoToneIcon style={{ color: colors.iconColor }} />;
  };


  const handleLikeClick = async (postId) => {
    try {
      // Make a POST request to like/unlike the post
      const response = await fetch(`${config.apiUrl}/comments/post/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfileId: profileUUID,
          postId,
        }),
      });

      if (!response.ok) {
        console.error('Failed to update like status');
        return;
      }

      const responseData = await response.json();

      // Update likeCounts based on server response
      setLikeCounts((prevLikeCounts) => ({
        ...prevLikeCounts,
        [postId]: responseData.like ? (prevLikeCounts[postId] || 0) + 1 : (prevLikeCounts[postId] || 0) - 1,
      }));

      // Update likedPosts based on server response
      setLikedPosts((prevLikedPosts) => {
        if (responseData.like) {
          return [...prevLikedPosts, postId];
        } else {
          return prevLikedPosts.filter((id) => id !== postId);
        }
      });

      // Update mergedData to reflect the like status
      setMergedData((prevMergedData) => {
        const updatedMergedData = prevMergedData.map((existingPost) => {
          if (existingPost.id === postId) {
            const updatedLikedPosts = responseData.like
              ? [...(existingPost.likedPosts || []), profileUUID]
              : (existingPost.likedPosts || []).filter((id) => id !== profileUUID);
            return { ...existingPost, likedPosts: updatedLikedPosts };
          }
          return existingPost;
        });
        return updatedMergedData;
      });
    } catch (error) {
      console.error('Error in handleLikeClick:', error);
    }
  };




  // Share click ------------------------------------
  const handleShareClick = (postId) => {
    const updatedShareCounts = { ...shareCounts, [postId]: (shareCounts[postId] || 0) + 1 };
    setShareCounts(updatedShareCounts);
  };

  // Show More click ------------------------------------
  const handleShowMoreClick = (postId) => {
    setExpandedText((prevExpanded) => ({
      ...prevExpanded,
      [postId]: !prevExpanded[postId],
    }));
  };

  // COMMENT HANDLING ------------------------------------

  // Comment Count....................................................................................
  const fetchUserData = async (postId) => {
    try {
      const commentCountResponse = await fetch(`${config.apiUrl}/comments/api/post/comments/count/${postId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!commentCountResponse.ok) {
        throw new Error('Failed to fetch comment count');
      }

      const likeCountResponse = await fetch(`${config.apiUrl}/posts/api/post/likes/count/${postId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!likeCountResponse.ok) {
        throw new Error('Failed to fetch like count');
      }

      const commentData = await commentCountResponse.json();
      const likeData = await likeCountResponse.json();

      // Update state with both like and comment counts for the post
      setCommentCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: commentData.commentCount,
      }));

      setLikeCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: likeData.likeCount,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // Open Comment.....................................................................................
  const handleExpandClick = async (postId) => {
    try {

      setCommentLoading(true);

      // Fetch comments for the post
      const response = await fetch(`${config.apiUrl}/comments/find/api/post/comments/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const formattedComments = data.comments.map(comment => ({
        id: comment.id,
        commentText: comment.commentText,
        commentReaction: comment.commentReaction,
        reactionCount: comment.reactionCount,
        user: {
          username: comment.user.username,
          photoURL: comment.user.photoURL,
        },
      }));

      // Update local state with the formatted comments
      setPostComments((prevComments) => ({
        ...prevComments,
        [postId]: formattedComments,
      }));

      // Toggle the expanded state
      setExpandedPosts((prevExpanded) => ({
        ...prevExpanded,
        [postId]: !prevExpanded[postId],
      }));


      // Like comment 
      const likedCommentsResponse = await fetch(`${config.apiUrl}/comments/find/api/user/liked/comments/${profileUUID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!likedCommentsResponse.ok) {
        throw new Error(`HTTP error! Status: ${likedCommentsResponse.status}`);
      }

      const likedCommentsData = await likedCommentsResponse.json();

      const formattedLikedComments = likedCommentsData.likedComments.map(likedComment => ({
        id: likedComment.id,
      }));

      setLikedComments(formattedLikedComments);

    } catch (error) {
      console.error('Error fetching comments or user\'s liked comments:', error);

    } finally {
      setCommentLoading(false);
    }
  };


  // Comment Submit.....................................................................................
  const handleCommentSubmit = async (postId) => {
    try {
      // Check if comment is not empty
      if (!comment.trim()) {
        return;
      }

      setCommentLoading(true);

      // Make a POST request to the server to save the comment
      const response = await fetch(`${config.apiUrl}/comments/api/post/comment`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfileUUID: profileUUID,
          postId,
          commentText: comment,
          commentReaction: '',
          reactionCount: 0,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // After successfully posting the comment, fetch the updated comments for the post
      const commentsResponse = await fetch(`${config.apiUrl}/comments/find/api/post/comments/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!commentsResponse.ok) {
        throw new Error(`HTTP error! Status: ${commentsResponse.status}`);
      }

      const commentsData = await commentsResponse.json();

      const formattedComments = commentsData.comments.map(comment => ({
        id: comment.id,
        commentText: comment.commentText,
        commentReaction: comment.commentReaction,
        reactionCount: comment.reactionCount,
        user: {
          username: comment.user.username,
          photoURL: comment.user.photoURL,
        },
      }));

      // Update local state with the formatted comments
      setPostComments((prevComments) => ({
        ...prevComments,
        [postId]: formattedComments,
      }));

      // Update comment count
      setCommentCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: formattedComments.length,
      }));

      // Clear the comment input
      setComment('');

    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };


  // Comment like.....................................................................................
  const handleLikeComment = async (postId, commentId) => {
    try {

      // Make a POST request to the server to update the comment likes
      const likeResponse = await fetch(`${config.apiUrl}/comments/api/post/comment/like`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfileUUID: profileUUID,
          commentId,
        }),
      });

      if (!likeResponse.ok) {
        throw new Error(`HTTP error! Status: ${likeResponse.status}`);
      }

      // After successfully updating the comment likes, fetch the updated comments for the post
      const commentsResponse = await fetch(`${config.apiUrl}/comments/find/api/post/comments/${postId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!commentsResponse.ok) {
        throw new Error(`HTTP error! Status: ${commentsResponse.status}`);
      }

      const commentsData = await commentsResponse.json();

      const formattedComments = commentsData.comments.map(comment => ({
        id: comment.id,
        commentText: comment.commentText,
        commentReaction: comment.commentReaction,
        reactionCount: comment.reactionCount,
        user: {
          username: comment.user.username,
          photoURL: comment.user.photoURL,
        },
      }));

      // Update local state with the formatted comments
      setPostComments((prevComments) => ({
        ...prevComments,
        [postId]: formattedComments,
      }));

    } catch (error) {
      console.error('Error updating comment likes:', error);
    }
  };


  // Delete Comment.....................................................................................
  const handleDeleteComment = async (postId, commentId) => {
    try {

      setCommentLoading(true);

      // Make a DELETE request to the server to delete the comment
      const response = await fetch(`${config.apiUrl}/comments/api/delete/comment/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If the server confirms successful deletion, update the local state
      const updatedComments = (postComments[postId] || []).filter((comment) => comment.id !== commentId);

      setPostComments((prevComments) => ({
        ...prevComments,
        [postId]: updatedComments,
      }));

    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };


  // Reply Submit .....................................................................................
  const handleReplySubmit = (postId, replyText, commentId) => {
    // Assuming setUsername and setLogo are functions that set state variables
    const newReply = {
      id: Date.now(),
      username: setUsername, // Invoke the function to get the value
      avatar: setLogo, // Invoke the function to get the value
      text: replyText,
      likes: 0,
    };

    const updatedComments = (postComments[postId] || []).map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies || []; // Ensure replies is initialized as an array
        return {
          ...comment,
          replies: [...updatedReplies, newReply],
        };
      }
      return comment;
    });

    setPostComments((prevComments) => ({
      ...prevComments,
      [postId]: updatedComments,
    }));
  };


  // Reply like.....................................................................................
  const handleLikeReply = (postId, commentId, replyIndex) => {
    const updatedComments = (postComments[postId] || []).map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies.map((reply, index) => {
          if (index === replyIndex) {
            // Toggle like state
            const newLikes = reply.liked ? 0 : 1;
            return { ...reply, likes: newLikes, liked: !reply.liked };
          }
          return reply;
        });

        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });

    setPostComments((prevComments) => ({
      ...prevComments,
      [postId]: updatedComments,
    }));
  };

  // Reply Delete.....................................................................................
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

  const [openReportModal, setOpenReportModal] = React.useState(false);
  const [reportText, setReportText] = React.useState('');
  const [reportedPostId, setReportedPostId] = React.useState(null);

  const handleMoreVertClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreVertClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  // Report ===========================================================

  const handleOpenReportDialog = (postId) => {
    console.log(postId);
    setReportedPostId(postId); // Set the reported postId
    setOpenReportModal(true); // Open the report dialog
  };


  const handleReportSubmit = async () => {
    try {
      if (!reportText.trim()) {
        message.error('Report text is empty');
        return;
      }

      const response = await fetch(`${config.apiUrl}/reports/post/report`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfileUuid: profileUUID,
          postId: reportedPostId,
          reportText: reportText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to report post');
      }

      message.success('Post reported successfully');
      setReportText('');
      handleCloseReportDialog();
    } catch (error) {
      console.error('Error reporting post:', error);
    }
  };

  const handleCloseReportDialog = () => {
    setOpenReportModal(false);
  };

  // ==============================================================================================


  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        scrollToPreviousPost();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        scrollToNextPost();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [mergedData]);

  const scrollToPreviousPost = () => {
    if (containerRef.current) {
      const currentPosition = containerRef.current.scrollTop;
      const postHeight = 400;
      containerRef.current.scrollTo({
        top: currentPosition - postHeight,
        behavior: 'smooth',
      });
    }
  };

  const scrollToNextPost = () => {
    if (containerRef.current) {
      const currentPosition = containerRef.current.scrollTop;
      const postHeight = 400;
      containerRef.current.scrollTo({
        top: currentPosition + postHeight,
        behavior: 'smooth',
      });
    }
  };

  // ==============================================================================================

  const [isLargeView, setIsLargeView] = React.useState(false);

  const handleDoubleClickLargePost = () => {
    setIsLargeView(!isLargeView);
  };

  {/* ------------------------------------------------------------------------------------------------- */ }

  return (
    <div ref={containerRef} className={`vh-100 overflow-scroll ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {loading ? (
        <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '14px' }}>
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </p>
      ) : error ? (
        <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '14px' }}>Error: {error}</p>
      ) : mergedData.length === 0 ? (
        <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '16px', marginTop: '50px', border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, padding: '50px' }}>Post <span style={{ color: '#ec1b90', textDecoration: 'underline' }}>{`#${hashtag}`}</span> not found.</p>
      ) : (
        <div>
          {mergedData.map((post) => (
            <Card key={post.id} sx={{
              maxWidth: 420,
              marginBottom: 2,
              marginTop: 2,
              backgroundColor: colors.backgroundColor,
              border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            }}>

              <CardHeader

                avatar={
                  post.photoURL ? (
                    <Avatar
                      src={`http://static.profile.local/${post.photoURL}`}
                      alt="User Avatar"
                      loading='lazy'
                      sx={{
                        ...instagramStyles.roundedAvatar,
                        backgroundColor: colors.backgroundColor,
                        cursor: 'pointer',
                      }}
                    />
                  ) : (
                    <Avatar
                      alt={post.username}
                      style={{
                        cursor: 'pointer'
                      }}
                    />
                  )
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

                // USWRNAME
                title={post.username}

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
              {/* <CardMedia
                component="img"
                height="400"
                image={`http://static.post.local/${post.postUploadURLs}`}
                loading='lazy'
                alt="Post Image"
                sx={{
                  background: '#fffff',
                  borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                  cursor: 'pointer'
                }}
              /> */}

              <div onDoubleClick={handleDoubleClickLargePost}>
                {isLargeView ? (
                  <div>
                    <CardMedia
                      component="img"
                      height="500"
                      image={`http://static.post.local/${post.postUploadURLs}`}
                      loading='lazy'
                      alt="Post Image"
                      sx={{
                        background: '#fffff',
                        borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                ) : (
                  <CardMedia
                    component="img"
                    height="400"
                    image={`http://static.post.local/${post.postUploadURLs}`}
                    loading='lazy'
                    alt="Post Image"
                    sx={{
                      background: '#fffff',
                      borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                      cursor: 'pointer'
                    }}
                  />
                )}
              </div>

              {/* ------------------------------------------------------------------------------------------------- */}

              <CardContent className='p-1' sx={{
                ...instagramStyles.instagramCardContent,
                backgroundColor: colors.backgroundColor,
                width: '100%',
              }}>
                {post.hashtags && typeof post.hashtags === 'string' && post.hashtags.trim() !== '' && post.hashtags !== '[]' && post.hashtags !== "''" ? (
                  <Typography variant="body2" className='p-1 mt-2'>
                    {post.hashtags
                      .replace(/##/g, '#')
                      .replace(/[\[\]"\s]/g, '')
                      .split(',')
                      .map((hashtag, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && ' '}
                          <Link to={`/hashtags/${encodeURIComponent(hashtag)}`} style={{
                            color: colors.hashtagColor,
                          }}>
                            {`#${hashtag.replace(/^#/, '')}`}
                          </Link>
                        </React.Fragment>
                      ))}
                  </Typography>
                ) :
                  <span></span>
                }
              </CardContent>



              {/* ------------------------------------------------------------------------------------------------- */}

              {/* TEXT */}
              <CardContent className='p-1'
                sx={{
                  ...instagramStyles.instagramCardContent, backgroundColor: colors.backgroundColor, borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                }}>

                <div
                  className={`truncate-text ${expandedText[post.id] ? 'expanded' : ''}`}
                  style={{ maxHeight: expandedText[post.id] ? '100%' : '3em', overflow: 'hidden', position: 'relative' }}
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
                    onClick={() => handleShowMoreClick(post.id)}
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
                    {expandedText[post.id] ? 'Show Less' : 'Show More'}
                  </Link>
                )}
              </CardContent>

              {/* ------------------------------------------------------------------------------------------------- */}


              {/* ICON */}
              <CardActions classes='gap-1' disableSpacing className="justify-content-between d-flex">

                <CardActions classes='gap-1' disableSpacing className="justify-content-between d-flex">
                  <IconButton
                    aria-label="like"
                    onClick={() => handleLikeClick(post.id)}
                    sx={instagramStyles.instagramIcons}
                    style={{
                      color: colors.iconColor
                    }}
                  >
                    {likedPosts.includes(post.id) ? (
                      <FavoriteTwoToneIcon /> // Display filled heart icon if post is liked
                    ) : (
                      <FavoriteBorderTwoToneIcon /> // Display outlined heart icon if post is not liked
                    )}
                    <Typography sx={{ color: colors.labelColor, fontSize: '12px' }}>
                      {likeCounts[post.id] || 0}
                    </Typography>
                  </IconButton>
                  {/* Other icons for comment and share */}
                </CardActions>


                <IconButton style={{ color: colors.iconColor }} className='gap-1' aria-label="comment" onClick={() => handleExpandClick(post.id)} sx={instagramStyles.instagramIcons}>
                  <CommentIcon sx={{ color: colors.iconColor }} />
                  <Typography sx={{ color: colors.labelColor, fontSize: '12px' }}>
                    {commentCounts[post.id] || 0}
                  </Typography>
                </IconButton>

                <IconButton style={{ color: colors.iconColor }} className='gap-1' aria-label="share" onClick={() => handleShareClick(post.id)} sx={instagramStyles.instagramIcons}>
                  <ShareIcon sx={{ color: colors.iconColor }} />
                  <Typography sx={{ color: colors.labelColor, fontSize: '12px' }}>
                    {shareCounts[post.id] || 0}
                  </Typography>
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
                          borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`,
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
                    <IconButton style={{ color: colors.iconColor }} aria-label="submit comment" onClick={() => handleCommentSubmit(post.id)}>
                      <SendIcon sx={{ color: colors.iconColor, fontSize: '16px' }} />
                    </IconButton>
                  </div>

                  {commentLoading && <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '14px' }}>
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </p>}
                  {/* {commentLoading && <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '14px' }}></p>} */}


                  {(postComments[post.id] || []).map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      handleLikeComment={(commentId) => handleLikeComment(post.id, commentId)}
                      handleDeleteComment={(commentId) => handleDeleteComment(post.id, commentId)}
                      handleReplySubmit={(replyText, commentId) => handleReplySubmit(post.id, replyText, commentId)}
                      handleLikeReply={(commentId, replyIndex) => handleLikeReply(post.id, commentId, replyIndex)}
                      handleDeleteReply={(commentId, replyIndex) => handleDeleteReply(post.id, commentId, replyIndex)}
                      isLiked={likedComments.some(likedComment => likedComment.id === comment.id)}
                    />
                  ))}

                </CardContent>
              </Collapse>

              {/* POST SETTINGS */}
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleMoreVertClose}
                onExited={handleMoreVertClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                  top: 0,
                }}
                style={{
                  cursor: 'pointer'
                }}
              >
                <Box style={{ background: colors.backgroundColor, color: colors.textColor, border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)` }}>
                  <List>
                    <ListItem button onClick={() => handleOpenReportDialog(post.id)}>
                      <ListItemText primary="Report Post" />
                    </ListItem>
                  </List>
                </Box>

                <Modal
                  open={openReportModal}
                  onClose={handleCloseReportDialog}
                  aria-labelledby="report-modal-title"
                  aria-describedby="report-modal-description"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ backgroundColor: colors.backgroundColor, borderRadius: '8px', padding: '16px', outline: 'none' }}>
                    <TextareaAutosize
                      aria-label="Report Reason"
                      placeholder="Report Reason"
                      minRows={3}
                      maxRows={5}
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      style={{ width: '100%', marginBottom: '16px', padding: '12px', backgroundColor: colors.backgroundColor, color: colors.textColor }}
                    />
                    <IconButton onClick={handleReportSubmit} variant="contained" style={{ color: colors.iconColor }}>
                      <SendIcon />
                    </IconButton>
                  </div>
                </Modal>

              </Popover>
            </Card>
          ))}
        </div>
      )}
    </div >
  );
}