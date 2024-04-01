import React from 'react';
import { useParams } from 'react-router-dom';

const HashtagComponent = () => {
  const { hashtag } = useParams();

  return (
    <div>
      <h1>Hashtag: {hashtag}</h1>
    </div>
  );
}

export default HashtagComponent;
