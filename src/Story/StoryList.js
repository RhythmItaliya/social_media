import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Avatar, IconButton, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import UserStory from './UserStory';
import FriendStory from './FriendStory';
import config from '../configuration';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import './story.css';

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
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingAvatar, setLoadingAvatar] = useState({});

  const profileuuid = useSelector((state) => state.profileuuid.uuid);
  const userPhotoUrl = useSelector((state) => state.userPhoto.photoUrl);
  const loginUserUsername = useSelector((state) => state.name.username);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/stories/api/friendships/users/story/${profileuuid}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDynamicProfiles(data.friends);
          setLoadingProfiles(false);
        } else {
          console.error('Failed to fetch profiles');
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();

    const handleResize = () => {
      if (window.innerWidth < 600) {
        setSliderSettings({ ...sliderSettings, slidesToShow: 2 });
      } else if (window.innerWidth < 900) {
        setSliderSettings({ ...sliderSettings, slidesToShow: 4 });
      } else {
        setSliderSettings({ ...sliderSettings, slidesToShow: 5 });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [profileuuid]);

  const handleAvatarLoad = (profileId) => {
    setLoadingAvatar((prevLoadingAvatar) => ({
      ...prevLoadingAvatar,
      [profileId]: false,
    }));
  };

  const handleOpenModalForFriend = (profile) => {
    setSelectedUser(profile);
    setOpenModalFriend(true);
  };

  const handleCloseModalForFriend = () => {
    setSelectedUser(null);
    setOpenModalFriend(false);
  };

  const handleOpenModalForUser = () => {
    setOpenModalUser(true);
  };

  const handleCloseModalUser = () => {
    setOpenModalUser(false);
  };

  const [sliderSettings, setSliderSettings] = useState({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToScroll: 1,
    arrows: true,
    swipe: true,
    initialSlide: 0,
    slidesToShow: 5,
    vertical: false,
  });

  const CustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-arrow prev-arrow" onClick={onClick}>
        <IconButton style={{ cursor: 'pointer' }}>
          <NavigateBeforeIcon style={{ color: '#ec1b90' }} />
        </IconButton>
      </div>
    );
  };

  const CustomNextArrow = (props) => {
    const { onClick } = props;
    return (
      <div className="custom-arrow next-arrow" onClick={onClick}>
        <IconButton style={{ cursor: 'pointer' }}>
          <NavigateNextIcon style={{ color: '#ec1b90' }} />
        </IconButton>
      </div>
    );
  };

  const customSliderSettings = {
    ...sliderSettings,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };


  return (
    <div>
      {loadingProfiles ? (
        <p style={{ color: colors.textColor, justifyContent: 'center', display: 'flex', alignContent: 'center' }}>
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </p>
      ) : (
        <div style={{ border: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`, backgroundColor: colors.backgroundColor }} className='w-100 p-3 mt-4 d-flex justify-content-around align-items-center'>
          {/* User Story */}
          <div style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <IconButton style={{ color: colors.iconColor }} onClick={handleOpenModalForUser}>
                {loadingAvatar[userPhotoUrl] ? (
                  <CircularProgress size={30} style={{ color: colors.iconColor }} />
                ) : (
                  <Avatar style={{ cursor: 'pointer' }} alt={loginUserUsername} src={userPhotoUrl} onLoad={() => handleAvatarLoad(userPhotoUrl)} />
                )}
              </IconButton>
            </div>
            <div style={{ color: colors.textColor, textAlign: 'center' }}>
              {loginUserUsername}
            </div>
          </div>

          {/* Friend Stories */}
          <Slider {...customSliderSettings} {...sliderSettings} className='w-50 mx-auto' style={{ flexDirection: 'row' }}>
            {dynamicProfiles.map((profile) => (
              <div key={profile.uuid} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <IconButton style={{ color: colors.iconColor }} onClick={() => handleOpenModalForFriend(profile)}>
                    {loadingAvatar[profile.photoURL] ? (
                      <CircularProgress size={30} style={{ color: colors.iconColor }} />
                    ) : (
                      profile.photoURL ? (
                        <Avatar
                          style={{ cursor: 'pointer' }}
                          alt={profile.username}
                          src={profile.photoURL}
                          onLoad={() => handleAvatarLoad(profile.photoURL)}
                        />
                      ) : (
                        <Avatar
                          style={{ cursor: 'pointer' }}
                          alt={profile.username}
                          onLoad={() => handleAvatarLoad(profile.photoURL)}
                        />
                      )
                    )}
                  </IconButton>
                </div>
                <div style={{ color: colors.textColor, textAlign: 'center' }}>
                  {profile.username}
                </div>
              </div>
            ))}
          </Slider>

          {/* Friend Story Modal */}
          <FriendStory open={openModalFriend} onClose={handleCloseModalForFriend} colors={colors} uuid={profileuuid} selectedUser={selectedUser} />

          {/* User Story Modal */}
          <UserStory open={openModalUser} onClose={handleCloseModalUser} selectedUser={selectedUser} colors={colors} uuid={profileuuid} username={loginUserUsername} />
        </div>
      )}
    </div>
  );
};

export default StoryList;
