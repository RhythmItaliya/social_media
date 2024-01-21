// BreadcrumbsComponent.js
import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Stack from '@mui/material/Stack';
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
  };
  
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

const BreadcrumbsComponent = ({ breadcrumbs, onBackButtonClick }) => {
    const { isDarkMode } = useDarkMode(); 
    return (
        <Stack spacing={2}>
            <Breadcrumbs separator={<NavigateNextIcon style={{ color: isDarkMode ? darkModeColors.iconColor : lightModeColors.iconColor, fontSize: '18px' }} />} aria-label="breadcrumb">
                {breadcrumbs}
                {breadcrumbs.length > 2 && (
                    <Button onClick={onBackButtonClick} style={{ textTransform: 'none' }}>
                        <ArrowBack style={{ marginRight: '5px' }} />
                        Back
                    </Button>
                )}
            </Breadcrumbs>
        </Stack>
    );
};
export default BreadcrumbsComponent;
