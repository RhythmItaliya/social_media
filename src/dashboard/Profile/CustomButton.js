import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Tooltip,
  Drawer,
  Grid,
  Container,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useDarkMode } from '../../theme/Darkmode';
import './ProfileSet.css';
import { CloseOutlined } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { Close } from '@mui/icons-material';


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

const CustomButton = () => {
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  const profileUUID = useSelector(state => state.profileuuid.uuid);

  const [friend, setFriend] = useState([]);
  const [friendCount, setFriendCount] = useState(0);
  const [friendDrawerOpen, setFriendDrawerOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isFriendAvatarModalOpen, setIsFriendAvatarModalOpen] = useState(false);

  const [crushes, setCrushes] = useState([]);
  const [crushCount, setCrushCount] = useState(0);
  const [crushDrawerOpen, setCrushDrawerOpen] = useState(false);
  const [selectedCrushes, setSelectedCrushes] = useState(null);
  const [isCrushAvatarModalOpen, setIsCrushAvatarModalOpen] = useState(false);

  const [ignores, setIgnores] = useState([]);
  const [ignoreCount, setIgnoreCount] = useState(0);
  const [ignoreDrawerOpen, setIgnoreDrawerOpen] = useState(false);
  const [selectedIgnore, setSelectedIgnore] = useState(null);
  const [isIgnoreAvatarModalOpen, setIsIgnoreAvatarModalOpen] = useState(false);


  const [messageDrawerOpen, setMessageDrawerOpen] = useState(false);





  const handleDrawerOpen = async (drawerType) => {
    setFriendDrawerOpen(false);
    setMessageDrawerOpen(false);
    setCrushDrawerOpen(false);
    setIgnoreDrawerOpen(false);

    switch (drawerType) {
      case 'friendCount':
        setFriendDrawerOpen(true);
        if (friend.length === 0) {
          try {
            const friendsListResponse = await fetch(`http://localhost:8080/api/friendships/users/${profileUUID}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const friendsListData = await friendsListResponse.json();
            if (friendsListResponse.ok) {
              const fetchedFriendsList = friendsListData.friends;
              setFriend(fetchedFriendsList);
            } else {
              console.error('Error:', friendsListData.error);
            }
          } catch (error) {
            console.error(error);
          }
        }
        break;
      case 'ratting':
        setMessageDrawerOpen(true);
        break;
      case 'crush':
        setCrushDrawerOpen(true);
        if (crushes.length === 0) {
          try {
            const crushResponse = await fetch(`http://localhost:8080/get/userProfileCrushes/${profileUUID}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (crushResponse.ok) {
              const crushData = await crushResponse.json();
              setCrushes(crushData.crushesInfo);
            } else {
              console.error('Failed to fetch crushes data');
            }
          } catch (error) {
            console.error(error);
          }
        }
        break;
      case 'ignore':
        setIgnoreDrawerOpen(true);
        if (ignores.length === 0) {
          try {
            const ignoreResponse = await fetch(`http://localhost:8080/get/userProfileIgnores/${profileUUID}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (ignoreResponse.ok) {
              const ignoreData = await ignoreResponse.json();
              setIgnores(ignoreData.ignoreInfo);
            } else {
              console.error('Failed to fetch ignores data');
            }
          } catch (error) {
            console.error(error);
          }
        }
        break;
      default:
        break;
    }
  };


  const handleDrawerClose = (drawerType) => {
    switch (drawerType) {
      case 'friendCount':
        setFriendDrawerOpen(false);
        break;
      case 'ratting':
        setMessageDrawerOpen(false);
        break;
      case 'crush':
        setCrushDrawerOpen(false);
        break;
      case 'ignore':
        setIgnoreDrawerOpen(false);
        break;
      default:
        break;
    }
  };

  const renderCloseIcon = (drawerType) => (
    <Tooltip sx={{ color: colors.textColor }} title={`Close ${drawerType} Drawer`} arrow>
      <IconButton
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          color: colors.iconColor,

        }}
        onClick={() => handleDrawerClose(drawerType)}
      >
        <CloseOutlined />
      </IconButton>
    </Tooltip>
  );

  // About Friend
  useEffect(() => {
    const fetchFriendCount = async () => {
      try {
        const friendCountResponse = await fetch(`http://localhost:8080/api/friendships-crushes-ignores/count/${profileUUID}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!friendCountResponse.ok) {
          console.error('Failed to fetch friend count');
          throw new Error('Failed to fetch friend count');
        }

        const postfriendData = await friendCountResponse.json();
        setFriendCount(postfriendData.friendshipCount);
        setCrushCount(postfriendData.crushCount);
        setIgnoreCount(postfriendData.ignoreCount)
      } catch (error) {
        console.error(error);
      }
    };

    fetchFriendCount();
  }, [profileUUID]);


  return (
    <>
      <div className='col-12'>
        <Grid item className='d-flex gap-4 p-3 justify-content-around'>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton sx={{ color: colors.iconColor }} onClick={() => handleDrawerOpen('ratting')}>
              <Typography style={{ fontSize: '30px', color: colors.textColor }}>50</Typography>
            </IconButton>
            <Typography style={{ fontSize: "10px", color: colors.labelColor }}>
              Ratting
            </Typography>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton sx={{ color: colors.iconColor }} onClick={() => handleDrawerOpen('friendCount')}>
              <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>
                {friendCount.toString().padStart(2, '0')}
              </Typography>
            </IconButton>
            <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
              Friend
            </Typography>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton sx={{ color: colors.iconColor }} onClick={() => handleDrawerOpen('crush')}>
              <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>
                {crushCount.toString().padStart(2, '0')}
              </Typography>
            </IconButton>
            <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
              Crush
            </Typography>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton sx={{ color: colors.iconColor }} onClick={() => handleDrawerOpen('ignore')}>
              <Typography style={{ fontSize: '30px', color: colors.textColor, textTransform: 'uppercase' }}>
                {ignoreCount.toString().padStart(2, '0')}
              </Typography>
            </IconButton>
            <Typography style={{ fontSize: "10px", color: colors.labelColor, textTransform: 'uppercase' }}>
              Ignore
            </Typography>
          </div>
        </Grid>
      </div>


      <Drawer anchor="right" open={friendDrawerOpen} onClose={() => handleDrawerClose('friendCount')}>
        <Container maxWidth="sm " className="custom-drawer-container" style={{ backgroundColor: colors.backgroundColor, borderLeft: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)`, boxShadow: colors.boxShadow }}>
          {renderCloseIcon('friendCount')}
          <div id="friendDrawerContent" className="drawer-content" style={{ color: colors.textColor }}>
            <h3 className='d-flex justify-content-center align-content-center p-2 mt-2' style={{ borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)` }}>Your Friends</h3>
            {friend && friend.length === 0 ? (
              <p className='mt-3' style={{ color: colors.labelColor }}>No friends available.</p>
            ) : (
              <div className='d-flex mt-3 flex-column'>
                {friend.map((friend) => (
                  <div key={friend.uuid} className='d-flex gap-3 m-1 p-2 rounded-2' style={{ cursor: 'pointer', borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.4)` }}>
                    <div className="d-flex justify-content-center align-content-center" style={{ flex: '20%' }}>
                      <Avatar
                        src={friend.photoURL || 'https://via.placeholder.com/200'}
                        alt={`${friend.firstName}'s Avatar`}
                        style={{ width: '42px', height: '42px' }}
                        onClick={() => {
                          setSelectedFriend(friend);
                          setIsFriendAvatarModalOpen(true);
                        }}
                      />
                    </div>
                    <div style={{ flex: '80%' }}>
                      <div className="flex-column  justify-content-start align-items-center">
                        <div className="pointer-event" style={{ fontSize: "14px", color: colors.textColor, fontWeight: '500' }}>
                          {`${(friend.firstName || '').charAt(0).toUpperCase() + (friend.firstName || '').slice(1)} ${(friend.lastName || '').charAt(0).toUpperCase() + (friend.lastName || '').slice(1)}`}
                        </div>
                        <div className='pointer-event' style={{ fontSize: '12px', color: colors.labelColor }}>
                          {friend.user?.username ? `@${friend.user.username}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Drawer>


      <Drawer anchor="right" open={crushDrawerOpen} onClose={() => handleDrawerClose('crush')}>
        <Container maxWidth="sm" className="custom-drawer-container" style={{ backgroundColor: colors.backgroundColor, border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
          {renderCloseIcon('crush')}
          <div id="crushDrawerContent" className="drawer-content" style={{ color: colors.textColor }}>
            <h3 className='d-flex justify-content-center align-content-center p-2 mt-2' style={{ borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)` }}>Crush</h3>
            {crushes && crushes.length === 0 ? (
              <p className='mt-3' style={{ color: colors.labelColor }}>No crushes available.</p>
            ) : (
              <div className='d-flex mt-3 flex-column'>
                {crushes.map((crush) => (
                  <div key={crush.userProfile2.uuid} className='d-flex gap-3 m-1 p-2 rounded-2' style={{ cursor: 'pointer', borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.4)` }}>
                    <div className="d-flex justify-content-center align-content-center" style={{ flex: '20%' }}>
                      <Avatar
                        src={`http://static.profile.local/${crush.userProfile2.profilePhote?.photoURL || ''}` || 'https://via.placeholder.com/200'}
                        alt={`${crush.userProfile2.firstName}'s Avatar`}
                        style={{ width: '42px', height: '42px' }}
                        onClick={() => {
                          setSelectedCrushes(crush);
                          setIsCrushAvatarModalOpen(true);
                        }}
                      />
                    </div>
                    <div style={{ flex: '80%' }}>
                      <div className="flex-column  justify-content-start align-items-center">
                        <div className="pointer-event" style={{ fontSize: "14px", color: colors.textColor, fontWeight: '500' }}>
                          {`${crush.userProfile2.firstName.charAt(0).toUpperCase() + crush.userProfile2.firstName.slice(1)} ${crush.userProfile2.lastName.charAt(0).toUpperCase() + crush.userProfile2.lastName.slice(1)}`}
                        </div>
                        <div className='pointer-event' style={{ fontSize: '12px', color: colors.labelColor }}>
                          {crush.userProfile2.user?.username ? `@${crush.userProfile2.user.username}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Drawer>


      <Drawer anchor="right" open={ignoreDrawerOpen} onClose={() => handleDrawerClose('ignore')}>
        <Container maxWidth="sm" className="custom-drawer-container" style={{ backgroundColor: colors.backgroundColor, border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
          {renderCloseIcon('ignore')}
          <div id="ignoreDrawerContent" className="drawer-content" style={{ color: colors.textColor }}>
            <h3 className='d-flex justify-content-center align-content-center p-2 mt-2' style={{ borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.9)` }}>Ignore</h3>
            {ignores && ignores.length === 0 ? (
              <p className='mt-3' style={{ color: colors.labelColor }}>No ignores available.</p>
            ) : (
              <div className='d-flex mt-3 flex-column'>
                {ignores.map((ignore) => (
                  <div key={ignore.userProfile2.uuid} className='d-flex gap-3 m-1 p-2 rounded-2' style={{ cursor: 'pointer', borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.4)` }}>
                    <div className="d-flex justify-content-center align-content-center" style={{ flex: '20%' }}>
                      <Avatar
                        src={`http://static.profile.local/${ignore.userProfile2.profilePhote?.photoURL || ''}` || 'https://via.placeholder.com/200'}
                        alt={`${ignore.userProfile2.firstName}'s Avatar`}
                        style={{ width: '42px', height: '42px' }}
                        onClick={() => {
                          setSelectedIgnore(ignore);
                          setIsIgnoreAvatarModalOpen(true);
                        }}
                      />
                    </div>
                    <div style={{ flex: '80%' }}>
                      <div className="flex-column  justify-content-start align-items-center">
                        <div className="pointer-event" style={{ fontSize: "14px", color: colors.textColor, fontWeight: '500' }}>
                          {`${ignore.userProfile2.firstName.charAt(0).toUpperCase() + ignore.userProfile2.firstName.slice(1)} ${ignore.userProfile2.lastName.charAt(0).toUpperCase() + ignore.userProfile2.lastName.slice(1)}`}
                        </div>
                        <div className='pointer-event' style={{ fontSize: '12px', color: colors.labelColor }}>
                          {ignore.userProfile2.user?.username ? `@${ignore.userProfile2.user.username}` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Drawer>


      {/* Friend Avatar Modal */}
      <Dialog open={isFriendAvatarModalOpen} onClose={() => setIsFriendAvatarModalOpen(false)}>
        <DialogTitle style={{
          color: colors.textColor,
          backgroundColor: colors.backgroundColor,
          textAlign: 'center',
          border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
          borderBottom: 'none',
          boxShadow: colors.boxShadow,
        }}>
          {`@${selectedFriend?.user?.username || ''}`}
        </DialogTitle>

        <DialogContent
          style={{
            backgroundColor: colors.backgroundColor,
            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            borderBottom: 'none',
            padding: '20px',
            boxShadow: colors.boxShadow,
          }}>
          {selectedFriend && (
            <Avatar
              src={selectedFriend.photoURL || 'https://via.placeholder.com/200'}
              alt={`${selectedFriend.firstName}'s Avatar`}
              style={{
                width: '130px',
                height: '130px',
                margin: 'auto',
              }}
            />
          )}
        </DialogContent>

        <DialogActions
          style={{
            backgroundColor: colors.backgroundColor,
            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            boxShadow: colors.boxShadow,
          }}>
          <IconButton
            style={{
              color: colors.iconColor
            }} onClick={() => setIsFriendAvatarModalOpen(false)}>
            <Close />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Crush Avatar Modal */}
      <Dialog open={isCrushAvatarModalOpen} onClose={() => setIsCrushAvatarModalOpen(false)}>
        <DialogTitle style={{
          color: colors.textColor,
          backgroundColor: colors.backgroundColor,
          textAlign: 'center',
          border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
          borderBottom: 'none',
          boxShadow: colors.boxShadow,
        }}>
          {`@${selectedCrushes?.userProfile2?.user?.username || ''}`}
        </DialogTitle>

        <DialogContent
          style={{
            backgroundColor: colors.backgroundColor,
            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            borderBottom: 'none',
            padding: '20px',
            boxShadow: colors.boxShadow,
          }}>
          {selectedCrushes && (
            <Avatar
              src={`http://static.profile.local/${selectedCrushes.userProfile2?.profilePhote?.photoURL || ''}` || 'https://via.placeholder.com/200'}
              alt={`${selectedCrushes.userProfile2?.firstName}'s Avatar`}
              style={{
                width: '130px',
                height: '130px',
                margin: 'auto',
              }}
            />
          )}
        </DialogContent>

        <DialogActions
          style={{
            backgroundColor: colors.backgroundColor,
            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            boxShadow: colors.boxShadow,
          }}>
          <IconButton
            style={{
              color: colors.iconColor
            }} onClick={() => setIsCrushAvatarModalOpen(false)}>
            <Close />
          </IconButton>
        </DialogActions>
      </Dialog>

      {/* Ignore Avatar Modal */}
      <Dialog open={isIgnoreAvatarModalOpen} onClose={() => setIsIgnoreAvatarModalOpen(false)}>
        <DialogTitle style={{
          color: colors.textColor,
          backgroundColor: colors.backgroundColor,
          textAlign: 'center',
          border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
          borderBottom: 'none',
          boxShadow: colors.boxShadow,
        }}>
          {`@${selectedIgnore?.userProfile2?.user?.username || ''}`}
        </DialogTitle>

        <DialogContent
          style={{
            backgroundColor: colors.backgroundColor,
            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            borderBottom: 'none',
            padding: '20px',
            boxShadow: colors.boxShadow,
          }}>
          {selectedIgnore && (
            <Avatar
              src={`http://static.profile.local/${selectedIgnore.userProfile2?.profilePhote?.photoURL || ''}` || 'https://via.placeholder.com/200'}
              alt={`${selectedIgnore.userProfile2?.firstName}'s Avatar`}
              style={{
                width: '130px',
                height: '130px',
                margin: 'auto',
              }}
            />
          )}
        </DialogContent>

        <DialogActions
          style={{
            backgroundColor: colors.backgroundColor,
            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
            boxShadow: colors.boxShadow,
          }}>
          <IconButton
            style={{
              color: colors.iconColor
            }} onClick={() => setIsIgnoreAvatarModalOpen(false)}>
            <Close />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomButton;