import React from 'react';
import Button from '@mui/material/Button';

const ProfilePageSubmit = ({ colors, onClick, isDisabled }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      onClick={onClick}
      disabled={isDisabled}
      style={{ marginTop: '16px', backgroundColor: colors.backgroundColor, color: '#ec1b90' }}
    >
      Submit
    </Button>
  );
};

export default ProfilePageSubmit;
