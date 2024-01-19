import React from 'react';
import NewPost from './NewPost';
import { useDarkMode } from '../theme/Darkmode';
import PostFrom from './PostFrom';
import { Grid } from '@mui/material';


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
  valueTextColor: '#ffffff'
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const CreatePost = () => {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item lg={6}>
        <div
          style={{
            width: '550px',
            height: 'auto',
            margin: 'auto',
            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            borderRadius: '10px'
          }}
        >
          <NewPost />
        </div>
      </Grid>

      <Grid item lg={6}>
        <div
          style={{
            width: '550px',
            height: 'auto',
            margin: 'auto',
            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            borderRadius: '10px'
          }}
        >
          <PostFrom />
        </div>
      </Grid>
    </Grid >
  );
};

export default CreatePost;