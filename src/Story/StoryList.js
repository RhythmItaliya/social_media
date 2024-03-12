// StoryList.js
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Avatar, IconButton } from '@mui/material';
import { useSelector } from 'react-redux';
import UserStory from './UserStory';
import FriendStory from './FriendStory';

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const StoryList = ({ colors }) => {
  const [openModalFriend, setOpenModalFriend] = useState(false);
  const [openModalUser, setOpenModalUser] = useState(false);

  const [dynamicProfiles, setDynamicProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const profileuuid = useSelector((state) => state.profileuuid.uuid);
  const userPhotoUrl = useSelector((state) => state.userPhoto.photoUrl);
  const loginUserUsername = useSelector((state) => state.name.username);

  useEffect(() => {
    const generateRandomProfiles = () => {
      const numberOfProfiles = 7;

      const newProfiles = Array.from({ length: numberOfProfiles }, (_, index) => ({
        id: index + 1,
        name: `User${index + 1}`,
        route: `/user${index + 1}`,
        image: `https://picsum.photos/200/200?random=${index + 1}`,
        storyText: `This is User${index + 1}'s story text.`,
      }));

      setDynamicProfiles(newProfiles);
    };

    generateRandomProfiles();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (openModalFriend || openModalUser) {
        if (event.key === 'ArrowRight') {
          navigateProfile(1);
        } else if (event.key === 'ArrowLeft') {
          navigateProfile(-1);
        }
      }
    };

    const handleTouchStart = (event) => {
      if (openModalFriend || openModalUser) {
        touchStartX = event.touches[0].clientX;
      }
    };

    const handleTouchMove = (event) => {
      if (openModalFriend || openModalUser) {
        touchEndX = event.touches[0].clientX;
      }
    };

    const handleTouchEnd = () => {
      if (openModalFriend || openModalUser) {
        const touchDiff = touchStartX - touchEndX;

        if (touchDiff > 50) {
          navigateProfile(1);
        } else if (touchDiff < -50) {
          navigateProfile(-1);
        }
      }
    };

    const navigateProfile = (direction) => {
      const currentIndex = dynamicProfiles.findIndex((profile) => profile === selectedUser);
      const newIndex = (currentIndex + direction + dynamicProfiles.length) % dynamicProfiles.length;

      setSelectedUser(dynamicProfiles[newIndex]);
    };

    let touchStartX = 0;
    let touchEndX = 0;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [openModalFriend, openModalUser, dynamicProfiles, selectedUser]);

  const handleOpenModalForFriend = (profile) => {
    setSelectedUser(profile);
    setOpenModalFriend(true);
  };

  const handleCloseModalForFriend = () => {
    setSelectedUser(null);
    setOpenModalFriend(false);
  };

  const handleOpenModalForUser = (profile) => {
    setSelectedUser(profile);
    setOpenModalUser(true);
  }

  const handleCloseModalUser = () => {
    setOpenModalUser(false);
  }

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    arrows: true,
    swipe: true,
    initialSlide: 0,
    slidesToShow: 6,
  };

  if (window.innerWidth < 600) {
    sliderSettings.slidesToShow = 2;
  } else if (window.innerWidth < 900) {
    sliderSettings.slidesToShow = 4;
  }

  return (
    <div style={{ border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`, backgroundColor: colors.backgroundColor }} className='w-100 p-3 mt-4 d-flex justify-content-around align-items-center'>

      {/* userStory */}
      <div style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <IconButton style={{ color: colors.iconColor }} onClick={() => handleOpenModalForUser(selectedUser)}>
            <Avatar style={{ cursor: 'pointer' }} alt={loginUserUsername} src={userPhotoUrl} />
          </IconButton>
        </div>
        <div style={{ color: colors.textColor, textAlign: 'center' }}>
          {loginUserUsername}
        </div>
      </div>

      {/* friendStory */}
      <Slider {...sliderSettings} className='w-50 mx-auto'>
        {dynamicProfiles.map((profile) => (
          <div key={profile.id} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <IconButton style={{ color: colors.iconColor }} onClick={() => handleOpenModalForFriend(profile)}>
                <Avatar style={{ cursor: 'pointer' }} alt={profile.name} src={profile.image} />
              </IconButton>
            </div>
            <div style={{ color: colors.textColor, textAlign: 'center' }}>
              {profile.name}
            </div>
          </div>
        ))}
      </Slider>

      {/* New UserModal component */}
      <FriendStory open={openModalFriend} onClose={handleCloseModalForFriend} selectedUser={selectedUser} colors={colors} uuid={profileuuid} />

      {/* New UserModal component */}
      <UserStory open={openModalUser} onClose={handleCloseModalUser} selectedUser={selectedUser} colors={colors} uuid={profileuuid} username={loginUserUsername} />

    </div>
  );
};

export default StoryList;
