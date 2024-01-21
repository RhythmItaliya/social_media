// BackButton.jsx
import React from 'react';
import { Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const BackButton = ({ onClick, colors }) => (
    <Button
        startIcon={<ArrowBack style={{ color: colors.iconColor, fontSize: '18px' }} />}
        onClick={onClick}
    >
        Back
    </Button>
);

export default BackButton;
