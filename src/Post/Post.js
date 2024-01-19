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
import { red } from '@mui/material/colors';
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

import Logo from '../assets/Millie.png';

import { useDispatch, useSelector } from 'react-redux';
import { setUserProfilePosts } from '../actions/authActions';
import { useEffect } from 'react';

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
  const [expanded, setExpanded] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [comments, setComments] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [newUserProfile, setNewUserProfile] = React.useState({});
  const dispatch = useDispatch();
  const profileUUID = useSelector((state) => state.profileuuid.uuid);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
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
            hashtags: post.hashtags,
            uuid: post.uuid,
            createdAt: new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          })),
        };

        setNewUserProfile(updatedUserProfile);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [profileUUID]);

  useEffect(() => {
    dispatch(setUserProfilePosts(newUserProfile));
  }, [newUserProfile, dispatch]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    const newComment = {
      id: Date.now(),
      username: 'User123',
      avatar: Logo,
      text: comment,
      likes: 0,
      replies: [],
    };

    setComments([...comments, newComment]);
    setComment('');
  };

  const handleLikeComment = (commentId) => {
    const updatedComments = comments.map((comment) =>
      comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
    );

    setComments(updatedComments);
  };

  const handleLikeReply = (commentId, replyIndex) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies.map((reply, index) =>
          index === replyIndex ? { ...reply, likes: reply.likes + 1 } : reply
        );

        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });

    setComments(updatedComments);
  };

  const handleMoreVertClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreVertClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className='vh-100 overflow-scroll'>
      {newUserProfile.posts && newUserProfile.posts.map((post) => (
        <Card key={post.id} sx={{ maxWidth: 420, marginBottom: 2 }}>
          <CardHeader
            avatar={
              <Avatar
                src={`http://static.profile.local/${newUserProfile.photoURL}`}
                alt="User Avatar"
                sx={{ ...instagramStyles.roundedAvatar, width: 40, height: 40 }}
              />
            }
            action={
              <IconButton
                aria-label="settings"
                sx={instagramStyles.instagramIcons}
                onClick={handleMoreVertClick}
              >
                <MoreVertIcon />
              </IconButton>
            }
            title={newUserProfile.username}
            subheader={post.createdAt}
          />

          <CardMedia
            component="img"
            height="400"
            image={`http://static.post.local/${post.postUploadURLs}`}
            alt="Post Image"
          />

          <CardContent sx={instagramStyles.instagramCardContent}>
            <Typography variant="body2" color="text.secondary">
              {post.postText}
            </Typography>
          </CardContent>

          <CardActions disableSpacing className="justify-content-between d-flex">
            <IconButton aria-label="add to favorites" sx={instagramStyles.instagramIcons}>
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share" sx={instagramStyles.instagramIcons}>
              <ShareIcon />
            </IconButton>
            <IconButton aria-label="comment" onClick={handleExpandClick} sx={instagramStyles.instagramIcons}>
              <CommentIcon />
            </IconButton>
          </CardActions>

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <TextField
                label="Add a comment"
                multiline
                fullWidth
                value={comment}
                onChange={handleCommentChange}
                variant="outlined"
              />
              <IconButton aria-label="submit comment" onClick={handleCommentSubmit}>
                <SendIcon />
              </IconButton>

              {comments.map((comment, index) => (
                <div key={comment.id}>
                  <CardHeader
                    avatar={<Avatar src={comment.avatar} alt="User Avatar" sx={instagramStyles.roundedAvatar} />}
                    title={comment.username}
                    subheader={comment.text}
                    action={
                      <IconButton
                        aria-label="like comment"
                        onClick={() => handleLikeComment(comment.id)}
                        sx={instagramStyles.instagramIcons}
                      >
                        <ThumbUpIcon />
                        <Typography variant="caption">{comment.likes}</Typography>
                      </IconButton>
                    }
                  />

                  {comment.replies.map((reply, replyIndex) => (
                    <CardHeader
                      key={replyIndex}
                      avatar={<Avatar src={reply.avatar} alt="User Avatar" sx={instagramStyles.roundedAvatar} />}
                      title={reply.username}
                      subheader={reply.text}
                      action={
                        <IconButton
                          aria-label="like reply"
                          onClick={() => handleLikeReply(comment.id, replyIndex)}
                          sx={instagramStyles.instagramIcons}
                        >
                          <ThumbUpIcon />
                          <Typography variant="caption">{reply.likes}</Typography>
                        </IconButton>
                      }
                    />
                  ))}
                </div>
              ))}
            </CardContent>
          </Collapse>

          <Popover
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
              {/* Add your settings about post content here */}
              <Typography>Settings about post</Typography>
            </Box>
          </Popover>
        </Card>
      ))}
    </div>
  );
}
