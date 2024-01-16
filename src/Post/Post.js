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

import Logo from '../assets/Millie.png'
// import Logo from '../../assets/orkut-logo.png'
// import Logo from '../../assets/girl-user-icon-simple-vector-18149176.jpg'

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
      avatar: Logo, // Change this to the user's avatar
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
    <Card sx={{ maxWidth: 420 }}>
      <CardHeader
        avatar={
          <Avatar
            src={Logo} // Change this to the user's profile image
            alt="User Avatar"
            sx={{ ...instagramStyles.roundedAvatar, width: 40, height: 40 }}
          />
        }
        action={
          <IconButton aria-label="settings" sx={instagramStyles.instagramIcons} onClick={handleMoreVertClick}>
            <MoreVertIcon />
          </IconButton>
        }
        title="User123" // Change this to the user's username
        subheader="September 14, 2016" // Change this to the post timestamp
      />
      <CardMedia component="img" height="400" image={Logo} alt="Post Image" />
      <CardContent sx={instagramStyles.instagramCardContent}>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.
        </Typography>
      </CardContent>

      <CardActions disableSpacing className='justify-content-between d-flex'>
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
                avatar={
                  <Avatar src={comment.avatar} alt="User Avatar" sx={instagramStyles.roundedAvatar} />
                }
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
                  avatar={
                    <Avatar src={reply.avatar} alt="User Avatar" sx={instagramStyles.roundedAvatar} />
                  }
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
  );
}
