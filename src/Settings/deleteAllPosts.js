// deleteAllPosts.js

import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

const DeleteAllPosts = ({ onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDeleteAllPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      // Implement the logic for deleting all posts
      // Example: Call your delete API endpoint here
      // const response = await fetch('your_delete_all_posts_api_endpoint', {
      //   method: 'DELETE',
      // });

      // Check if the response is successful
      // if (!response.ok) {
      //   throw new Error('Failed to delete all posts');
      // }

      // const data = await response.json();
      // Handle success message
      // setSuccessMessage('All posts deleted successfully.');

      // Call the onDelete callback to inform the parent component
      // onDelete();

      // Example:
      // onDelete();

      // Simulating success for demonstration purposes
      setSuccessMessage('All posts deleted successfully.');
    } catch (error) {
      console.error('Error deleting all posts:', error);
      setError('Failed to delete all posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleDeleteAllPosts} 
        disabled={loading}
      >
        Delete All Posts
      </Button>
      {error && <Typography variant="caption" color="error">{error}</Typography>}
      {successMessage && <Typography variant="caption" color="success">{successMessage}</Typography>}
    </div>
  );
};

export default DeleteAllPosts;
