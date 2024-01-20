import React, { useState } from 'react';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';

const SuggestedFriend = () => {
  const [friendName, setFriendName] = useState('');
  const [friendProfilePhoto, setFriendProfilePhoto] = useState(null);

  const handleInputChange = (e) => {
    setFriendName(e.target.value);
  };

  const handleSubmit = () => {
    // You can implement logic here to fetch the friend's profile photo based on the entered name.
    // For simplicity, I'm just setting a static image URL.
    const staticProfilePhotoURL = 'https://example.com/friend-profile-photo.jpg';
    setFriendProfilePhoto(staticProfilePhotoURL);
  };

  return (
    <div>
      <TextField
        label="Friend's Name"
        variant="outlined"
        value={friendName}
        onChange={handleInputChange}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Show Profile Photo
      </Button>

      {friendProfilePhoto && (
        <Card style={{ marginTop: '20px', maxWidth: '300px' }}>
          <img src={friendProfilePhoto} alt="Friend's Profile" style={{ width: '100%' }} />
          <CardContent>
            <Typography variant="h6">{friendName}'s Profile</Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SuggestedFriend;
