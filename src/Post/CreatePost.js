import React from 'react';
import NewPost from './NewPost';
import { useDarkMode } from '../theme/Darkmode';
import PostFrom from './PostFrom';
import { Grid } from '@mui/material';

const lightModeColors = {
  backgroundColor: '#ffffff',
  searchBarColor: '#ffffff',
  iconColor: 'rgb(0,0,0)',
  placeholderColor: 'rgb(0,0,0)',
  inputTextColor: 'rgb(0,0,0)',
  focusColor: 'rgb(0,0,0)',
  border: '#CCCCCC',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1) inset',
};

const darkModeColors = {
  backgroundColor: 'rgb(0,0,0)',
  searchBarColor: 'rgb(0,0,0)',
  iconColor: 'rgb(0,0,0)',
  placeholderColor: '#ffffff',
  inputTextColor: 'rgb(0,0,0)',
  focusColor: '#ffffff',
  border: '#333333',
  boxShadow: '0 2px 8px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1) inset',
};

const CreatePost = () => {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12} lg={6}>
        <div
          style={{
            width: '550px',
            margin: 'auto',
            height: '550px',
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.backgroundColor,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <NewPost />
        </div>
      </Grid>

      <Grid item xs={12} lg={6}>
        <PostFrom />
      </Grid>
    </Grid>
  );
};

export default CreatePost;