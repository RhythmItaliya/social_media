import React from 'react';
import Button from '@mui/material/Button';

const ProfilePageSubmit = ({ onClick, isDisabled }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={isDisabled}
      style={{ marginTop: '16px' }}
    >
      Submit
    </Button>
  );
};

export default ProfilePageSubmit;
