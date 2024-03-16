import * as React from 'react';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Popover, Box, Typography, List, ListItem, ListItemText, Card, Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions, Chip, Grid } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { setUserProfilePosts } from '../actions/authActions';
import { useEffect } from 'react';
import { useDarkMode } from '../theme/Darkmode';
import { Link } from 'react-router-dom';


import Comment from './Comment';
import LocationPicker from './LocationPicker';
import { AddCircleOutline } from '@material-ui/icons';

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

export default function InstagramCard() {

  const [newUserProfile, setNewUserProfile] = React.useState({});

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


  // POST_FACTCH -------------------------------------------------
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
        };

        setNewUserProfile(updatedUserProfile);
        await Promise.all(data.posts.map(async (post) => {
          await fetchUserData(post.id);
        }));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
        setError(error.message);
      }
    };

    fetchPosts();
  }, [profileUUID]);

  useEffect(() => {
    dispatch(setUserProfilePosts(newUserProfile));
  }, [newUserProfile, dispatch]);



  // Like click ------------------------------------
  const [likeSuccess, setLikeSuccess] = React.useState(false);
  const handleLikeClick = async (postId) => {
    try {
      const response = await fetch('http://localhost:8080/post/like', {
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
        setLikeSuccess(false);
        return;
      }

      setLikedPosts((prevLikedPosts) => {
        if (prevLikedPosts.includes(postId)) {
          return prevLikedPosts.filter((id) => id !== postId);
        } else {
          return [...prevLikedPosts, postId];
        }
      });

      setLikeCounts((prevLikeCounts) => {
        const updatedCounts = { ...prevLikeCounts };
        updatedCounts[postId] = likedPosts.includes(postId) ? updatedCounts[postId] - 1 : (updatedCounts[postId] || 0) + 1;
        return updatedCounts;
      });

      setLikeSuccess(true);
      console.log('likeSuccess:', likeSuccess);
      console.log('colors.iconColor:', colors.iconColor);
    } catch (error) {
      console.error('Error in handleLikeClick:', error);
      setLikeSuccess(false);
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
      const commentCountResponse = await fetch(`http://localhost:8080/api/post/comments/count/${postId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!commentCountResponse.ok) {
        console.error('Failed to fetch post count');
        throw new Error('Failed to fetch post count');
      }

      const commentData = await commentCountResponse.json();

      setCommentCounts((prevCounts) => ({
        ...prevCounts,
        [postId]: commentData.commentCount,
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
      const response = await fetch(`http://localhost:8080/find/api/post/comments/${postId}`, {
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
      const likedCommentsResponse = await fetch(`http://localhost:8080/find/api/user/liked-comments/${profileUUID}`, {
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
      const response = await fetch('http://localhost:8080/api/post/comment', {
        method: 'POST',
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
      const commentsResponse = await fetch(`http://localhost:8080/find/api/post/comments/${postId}`, {
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
      const likeResponse = await fetch('http://localhost:8080/api/post/comment/like', {
        method: 'POST',
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
      const commentsResponse = await fetch(`http://localhost:8080/find/api/post/comments/${postId}`, {
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

    } catch (error) {
      console.error('Error updating comment likes:', error);
    }
  };


  // Delete Comment.....................................................................................
  const handleDeleteComment = async (postId, commentId) => {
    try {

      setCommentLoading(true);

      const response = await fetch(`http://localhost:8080/api/delete/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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
    const newReply = {
      id: Date.now(),
      username: setUsername,
      avatar: setLogo,
      text: replyText,
      likes: 0,
    };

    const updatedComments = (postComments[postId] || []).map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies || [];
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


  // SETTING // ....................................................................................

  const handleMoreVertClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreVertClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // EDIT =======================================================================================

  const [oldhashtags, setOldHashtags] = React.useState([]);
  const [OldLocation, setOldLocation] = React.useState([]);

  const handleOpenEditDialog = async (postId) => {

    try {
      setLoading(true);

      const response = await fetch(`http://localhost:8080/api/posts/get/${postId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      const postToEdit = data.post;

      setEditedPostId(postId);
      setEditedData({
        caption: postToEdit.caption,
        postText: postToEdit.postText,
      });

      const parsedLocation = JSON.parse(data.post.location);
      setOldLocation(parsedLocation);

      const parsedHashtags = JSON.parse(data.post.hashtags);
      setOldHashtags(parsedHashtags);

      setEditDialogOpen(true);

    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.error('Error fetching post data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEditDialog = () => {
    setEditedPostId(null);
    setEditDialogOpen(false);
  };


  const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
  const [editedPostId, setEditedPostId] = React.useState(null);
  const [editedData, setEditedData] = React.useState({
    caption: '',
    postText: '',
    location: {
      city: '',
      country: '',
    },
    newHashtag: '',
  });
  const [hashtag, setHashtag] = React.useState([]);
  const [newHashtag, setNewHashtag] = React.useState('');
  const [addedHashtags, setAddedHashtags] = React.useState([]);
  const [location, setLocation] = React.useState({ city: null, country: null });

  const handleLocationChange = ({ city, country }) => {
    setLocation({ city, country });
  };

  const handleAddHashtag = () => {
    if (newHashtag) {
      const lowercaseHashtag = newHashtag.toLowerCase();
      setHashtag(prevHashtags => [...prevHashtags, lowercaseHashtag]);
      setAddedHashtags(prevAddedHashtags => [...prevAddedHashtags, lowercaseHashtag]);
      setNewHashtag('');
    }
  };

  const handleRemoveHashtag = (removedHashtag) => {
    setAddedHashtags(prevAddedHashtags => prevAddedHashtags.filter(tag => tag !== removedHashtag));
    setHashtag(prevHashtags => prevHashtags.filter(tag => tag !== removedHashtag));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://localhost:8080/api/posts/update/${editedPostId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption: editedData.caption,
          postText: editedData.postText,
          location: JSON.stringify([location.country, location.city]),
          hashtags: JSON.stringify(hashtag),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setNewUserProfile((prevUserProfile) => {
        const updatedPosts = prevUserProfile.posts.map((post) => {
          if (post.id === editedPostId) {
            return {
              ...post,
              caption: editedData.caption,
              postText: editedData.postText,
              location: JSON.stringify([location.country, location.city]),
              hashtags: JSON.stringify(hashtag),
            };
          }
          return post;
        });
        return {
          ...prevUserProfile,
          posts: updatedPosts,
        };
      });

    } catch (error) {
      setError(error.message);
      console.error('Error editing post:', error);
    } finally {
      setLoading(false);
      handleCloseEditDialog();
    }
  };




  // DELETE =======================================================================================
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = React.useState(false);
  const [postToDeleteId, setPostToDeleteId] = React.useState(null);

  const handleOpenDeleteConfirmation = (postId) => {
    setPostToDeleteId(postId);
    setDeleteConfirmationOpen(true);
  };
  const handleCloseDeleteConfirmation = () => {
    setPostToDeleteId(null);
    setDeleteConfirmationOpen(false);
  };
  const handleDeletePost = async (postId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/posts/delete/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setNewUserProfile((prevUserProfile) => {
        const updatedPosts = prevUserProfile.posts.filter((post) => post.id !== postId);
        return {
          ...prevUserProfile,
          posts: updatedPosts,
        };
      });
      setLoading(false);

    } catch (error) {
      setLoading(false);
      setError(error.message);
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
      handleCloseDeleteConfirmation();
    }
  };

  // HIDE =======================================================================================
  const [hideConfirmationOpen, setHideConfirmationOpen] = React.useState(false);
  const [postToHideId, setPostToHideId] = React.useState(null);

  const handleOpenHideConfirmation = (postId) => {
    setPostToHideId(postId);
    setHideConfirmationOpen(true);
  };

  const handleCloseHideConfirmation = () => {
    setPostToHideId(null);
    setHideConfirmationOpen(false);
  };

  const handleHidePost = async (postId) => {
    try {
      setLoading(true);
      // Assuming the following line of code sends the request to the server
      // Update the URL or parameters as needed
      const response = await fetch(`http://localhost:8080/api/posts/visibility/${postId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId,
          isVisibility: '1',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setNewUserProfile((prevUserProfile) => {
        const updatedPosts = prevUserProfile.posts.filter((post) => post.id !== postToHideId);
        return {
          ...prevUserProfile,
          posts: updatedPosts,
        };
      });

      handleCloseHideConfirmation();
    } catch (error) {
      setError(error.message);
      console.error('Error hiding post:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==============================================================================================

  const handleVisitProfile = () => {
    console.log('Visiting profile');
    handleMoreVertClose();
  };


  {/* ------------------------------------------------------------------------------------------------- */ }

  return (

    <div className={`vh-100 overflow-scroll ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {loading ? (
        <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '14px' }}>Loading...</p>
      ) : error ? (
        <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '14px' }}>Error: {error}</p>
      ) : newUserProfile.posts.length === 0 ? (
        <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '14px' }}>No posts found</p>
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

              <CardHeader

                // AVTAR
                avatar={
                  <Avatar
                    src={`http://static.profile.local/${newUserProfile.photoURL}`}
                    alt="User Avatar"
                    loading='lazy'
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
                    style={{ color: colors.iconColor }}
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
                loading='lazy'
                alt="Post Image"
                sx={{
                  background: '#fffff',
                  borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
                }}
              />

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
                            color: colors.hashtagColor, textDecoration: 'none'
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
                <IconButton
                  style={{
                    color: likeSuccess ? '#ff7f00' : colors.iconColor,
                  }}
                  aria-label="like"
                  onClick={() => handleLikeClick(post.id)}
                  sx={instagramStyles.instagramIcons}
                >
                  <FavoriteIcon sx={{ color: likeCounts[post.id] === 1 ? '#7f7f7f' : colors.iconColor }} />
                  <Typography sx={{ color: colors.labelColor, fontSize: '12px' }}>
                    {likeCounts[post.id] || 0}
                  </Typography>
                </IconButton>


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
              < Collapse in={expandedPosts[post.id]} timeout="auto" unmountOnExit sx={{ borderTop: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
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

                  {/* {commentLoading && <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '14px' }}>Loading...</p>} */}
                  {commentLoading && <p style={{ color: colors.textColor, textAlign: 'center', fontSize: '14px' }}></p>}

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
                    <ListItem button onClick={() => handleOpenEditDialog(post.id)}>
                      <ListItemText primary="Edit Post" />
                    </ListItem>

                    <Dialog
                      open={isEditDialogOpen}
                      onClose={handleCloseEditDialog}
                      aria-labelledby="edit-dialog-title"
                      aria-describedby="edit-dialog-description"
                      style={{
                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`,
                        backgroundColor: colors.transparentColor
                      }}
                    >
                      <DialogTitle style={{ color: colors.textColor, backgroundColor: colors.backgroundColor }} id="edit-dialog-title">
                        {"Edit Post"}
                      </DialogTitle>
                      <DialogContent sx={{ backgroundColor: colors.backgroundColor }}>
                        <div style={{ marginBottom: '16px', marginTop: '20px' }}>
                          <TextField
                            label="Caption"
                            value={editedData.caption}
                            onChange={(e) => setEditedData({ ...editedData, caption: e.target.value })}
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
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                          <TextField
                            label="Post Text"
                            value={editedData.postText}
                            onChange={(e) => setEditedData({ ...editedData, postText: e.target.value })}
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
                        </div>

                        <div className='w-100' style={{ marginBottom: '16px' }}>
                          <LocationPicker
                            onLocationChange={handleLocationChange}
                            setLocation={setLocation}
                          />
                        </div>

                        <div className='w-100' style={{ marginBottom: '16px' }}>
                          <Grid className='mt-1' item container spacing={2} alignItems="center" xs={12}>
                            <Grid item xs={10}>
                              <TextField
                                fullWidth
                                label="New Hashtag"
                                variant="standard"
                                size="small"
                                value={newHashtag}
                                onChange={(e) => setNewHashtag(e.target.value)}
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
                            </Grid>

                            <Grid item xs={2}>
                              <IconButton
                                type="button"
                                color="primary"
                                onClick={handleAddHashtag}
                                style={{
                                  color: colors.iconColor
                                }}
                              >
                                <AddCircleOutline />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </div>

                        <Grid item container spacing={1} alignItems="center" xs={12}>
                          {[...oldhashtags, ...addedHashtags].map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag.startsWith('#') ? tag : `#${tag}`}
                              onDelete={() => handleRemoveHashtag(tag)}
                              color="primary"
                            />
                          ))}
                        </Grid>

                      </DialogContent>
                      <DialogContent className='d-flex justify-content-around align-content-center p-2' sx={{ backgroundColor: colors.backgroundColor }}>
                        <Button onClick={handleCloseEditDialog} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={handleSaveChanges} color="success" autoFocus>
                          Save Changes
                        </Button>
                      </DialogContent>
                    </Dialog>

                    {/* VISIT PROFILE */}
                    <ListItem button onClick={handleVisitProfile}>
                      <ListItemText primary="Visit Profile" />
                    </ListItem>

                    {/* HIDE POST */}
                    <ListItem button onClick={() => handleOpenHideConfirmation(post.id)}>
                      <ListItemText primary="Hide Post" />
                    </ListItem>

                    <Dialog
                      open={hideConfirmationOpen}
                      onClose={handleCloseHideConfirmation}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      style={{
                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`,
                        backgroundColor: colors.transparentColor
                      }}
                    >
                      <DialogTitle style={{ color: colors.textColor, backgroundColor: colors.backgroundColor }} id="alert-dialog-title">{"Confirm Hide"}</DialogTitle>
                      <DialogContent sx={{ backgroundColor: colors.backgroundColor }}>
                        <DialogContentText id="alert-dialog-description" style={{ color: colors.textColor }}>
                          Are you sure you want to hide this post?
                        </DialogContentText>
                      </DialogContent>
                      <DialogContent className='d-flex justify-content-around align-content-center p-2' sx={{ backgroundColor: colors.backgroundColor }}>
                        <Button onClick={handleCloseHideConfirmation} color="primary" disabled={loading}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleHidePost(postToHideId)} color="warning" autoFocus disabled={loading}>
                          Hide
                        </Button>
                      </DialogContent>
                    </Dialog>

                    {/* DELETE POST */}
                    <ListItem button onClick={() => handleOpenDeleteConfirmation(post.id)}>
                      <ListItemText primary="Delete Post" />
                    </ListItem>

                    <Dialog
                      open={deleteConfirmationOpen}
                      onClose={handleCloseDeleteConfirmation}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      style={{
                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`,
                        backgroundColor: colors.transparentColor
                      }}
                    >
                      <DialogTitle style={{ color: colors.textColor, backgroundColor: colors.backgroundColor }} id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                      <DialogContent sx={{ backgroundColor: colors.backgroundColor }}>
                        <DialogContentText id="alert-dialog-description" style={{ color: colors.textColor }}>
                          Are you sure you want to delete this post?
                        </DialogContentText>
                      </DialogContent>
                      <DialogContent className='d-flex justify-content-around align-content-center p-2' sx={{ backgroundColor: colors.backgroundColor }}>
                        <Button onClick={handleCloseDeleteConfirmation} color="primary" disabled={loading}>
                          Cancel
                        </Button>
                        <Button onClick={() => handleDeletePost(postToDeleteId)} color="warning" autoFocus disabled={loading}>
                          Delete
                        </Button>
                      </DialogContent>
                    </Dialog>

                  </List>
                </Box>
              </Popover>

            </Card>
          ))
          }
        </div >
      )
      }
    </div >
  );
}