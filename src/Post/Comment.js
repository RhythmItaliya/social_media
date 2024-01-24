import React, { useState } from 'react';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { useDarkMode } from '../theme/Darkmode';

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
  hashtagColor: '#8A2BE2',
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};


const Comment = ({ comment, handleLikeComment, handleDeleteComment, isUser123, handleReplySubmit, handleLikeReply, handleDeleteReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [reply, setReply] = useState('');


  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  const handleReplySubmitInternal = () => {
    handleReplySubmit(reply, comment.id);
    setReply('');
  };

  return (
    <div key={comment.id}>
      <CardHeader
        avatar={<Avatar src={comment.avatar} alt="User Avatar" sx={{ borderRadius: '50%', width: '30px', height: '30px' }} />}
        title={comment.username}
        subheader={<Typography style={{ color: colors.labelColor }}>{comment.text}</Typography>}
        action={
          <>
            <IconButton aria-label="like comment" onClick={() => handleLikeComment(comment.id)}>
              <ThumbUpIcon sx={{ fontSize: '14px', color: colors.iconColor }} />
              <Typography variant="caption" sx={{ fontSize: '12px', margin: '5px', color: colors.labelColor }}>
                {comment.likes}
              </Typography>
            </IconButton>

            {isUser123 && (
              <IconButton aria-label="delete comment" onClick={() => handleDeleteComment(comment.id)}>
                <DeleteIcon sx={{ fontSize: '14px', color: colors.iconColor }} />
              </IconButton>
            )}

            <IconButton aria-label="toggle replies" onClick={toggleReplies}>
              <ReplyIcon sx={{ fontSize: '14px', color: colors.iconColor }} />
            </IconButton>
          </>
        }
        sx={{
          borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignContent: 'center',
          display: 'flex',
          color: colors.textColor
        }}
      />

      {/* Replies */}
      {showReplies && (
        <div style={{ marginLeft: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              label="Reply to comment"
              multiline
              fullWidth
              value={reply}
              onChange={handleReplyChange}
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
            <IconButton aria-label="submit comment" onClick={handleReplySubmitInternal}>
              <SendIcon sx={{ color: colors.iconColor }} />
            </IconButton>
          </div>

          {/* Replies */}
          {comment.replies.map((reply, replyIndex) => (
            <CardHeader
              key={replyIndex}
              avatar={<Avatar src={reply.avatar} alt="User Avatar" sx={{ borderRadius: '50%', width: '30px', height: '30px' }} />}
              title={reply.username}
              subheader={<Typography style={{ color: colors.labelColor }}>{reply.text}</Typography>}
              action={
                <>
                  <IconButton aria-label="like reply" onClick={() => handleLikeReply(comment.id, replyIndex)}>
                    <ThumbUpIcon sx={{ fontSize: '14px', color: colors.iconColor }} />
                    <Typography sx={{ margin: '5px', fontSize: '12px', color: colors.labelColor }}>{reply.likes}</Typography>
                  </IconButton>

                  {isUser123 && (
                    <IconButton aria-label="delete reply" onClick={() => handleDeleteReply(comment.id, replyIndex)}>
                      <DeleteIcon sx={{ fontSize: '14px', color: colors.iconColor }} />
                    </IconButton>
                  )}
                </>
              }
              sx={{
                borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`,
                justifyContent: 'center',
                alignContent: 'center',
                display: 'flex',
                color: colors.textColor
              }}
              InputLabelProps={{
                style: {
                  color: colors.labelColor
                },
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
