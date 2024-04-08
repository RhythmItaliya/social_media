import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDarkMode } from '../../theme/Darkmode';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CountrySelector from './CountrySelector';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ProfileAvatarSelector from './ProfileAvatarSelector';
import ProfilePageSubmit from './ProfilePageSubmit';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';
import { ArrowForward } from '@mui/icons-material';
import config from '../../configuration';
import './profilepage.css';

import ProfilePageNav from './ProfilePageNav';

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
  linkColor: '#000',
  hashtagColor: 'darkblue',
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
  linkColor: '#CCC8',
  hashtagColor: '#8A2BE2',
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const ProfilePage = () => {
  const [steps, setSteps] = useState([
    '',
    'First & Last Name',
    'Birthdate',
    'Gender',
    'Location',
    'Bio',
    'Select Avatar',
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [dateSelected, setDateSelected] = useState(false);
  const [gender, setGender] = useState('');
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;
  const [validationError, setValidationError] = useState('');

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [bio, setBio] = useState('');

  const [avatar, setAvatar] = useState('');

  const [isdecryptedUuid, setDecryptedUuid] = useState(null);

  const [loading, setLoading] = useState(0);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);

  const springProps = useSpring({
    opacity: 1,
    height: 'auto',
  });

  const navigate = useNavigate();

  const handleNextClick = () => {
    setValidationError('');

    if (currentStep === 1 && (!firstName || !lastName)) {
      setValidationError('Please fill in both First Name and Last Name');
      return;
    }

    if (currentStep === 2 && !dateSelected) {
      setValidationError('Please select a birth date');
      return;
    }

    if (currentStep === 3 && !gender) {
      setValidationError('Please select a gender');
      return;
    }

    if (currentStep === 4) {
      if (!selectedCountry || !selectedState || !selectedCity) {
        setValidationError('Please select a Country and State');
        return;
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handleBackClick = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleBirthDateChange = (date) => {
    setBirthDate(date);
    setDateSelected(true);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleCountrySelect = (selectedCountry) => {
    setSelectedCountry(selectedCountry)
    console.log('Selected Country:', selectedCountry);
  };

  const handleStateSelect = (selectedState) => {
    setSelectedState(selectedState)
    console.log('Selected State:', selectedState);
  };

  const handleCitySelect = (selectedCity) => {
    setSelectedCity(selectedCity);
    console.log('Selected City:', selectedCity);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleAvatarSelect = (resizedBase64) => {
    setAvatar(resizedBase64)
    console.log('Selected Avatar Base64:', resizedBase64);
  };

  const isSubmitDisabled = !firstName || !lastName || !dateSelected || !gender || !selectedCountry || !selectedState;

  const encryptionKey = 'ASDCFVBNLKMNBSDFVBNJNBCV';

  useEffect(() => {
    const encryptedUuidCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      .split('=')[1];

    const decryptedUuidBytes = CryptoJS.AES.decrypt(encryptedUuidCookie, encryptionKey);
    const decryptedUuid = decryptedUuidBytes.toString(CryptoJS.enc.Utf8);
    setDecryptedUuid(decryptedUuid);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      for (let progress = 0; progress <= 100; progress++) {
        setLoadingBarProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const response = await fetch(`${config.apiUrl}/create/api/profilepage/create/${isdecryptedUuid}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          location: JSON.stringify({
            country: selectedCountry,
            state: selectedState,
            city: selectedCity
          }),
          birthdate: birthDate,
          gender: gender,
          bio: bio,
          data: avatar,
        }),
      });

      if (response.ok) {
        setLoadingBarProgress(100);
        navigate('/home');
      } else {
        console.error('Failed to send profile data to the server. Status:', response.status, 'Message:', response.statusText);
      }
    } catch (error) {
      console.error('Error while sending profile data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleStepClick = (stepIndex) => {
    setValidationError('');
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
      return;
    }

    switch (currentStep) {
      case 1:
        if (!firstName || !lastName) {
          setValidationError('Please fill in both First Name and Last Name');
          return;
        }
        break;
      case 2:
        if (!dateSelected) {
          setValidationError('Please select a birth date');
          return;
        }
        break;
      case 3:
        if (!gender) {
          setValidationError('Please select a gender');
          return;
        }
        break;
      case 4:
        if (!selectedCountry || !selectedState || !selectedCity) {
          setValidationError('Please select a Country and State');
          return;
        }
        break;
      default:
        break;
    }

    setCurrentStep(stepIndex);
  };

  return (
    <div>
      <ProfilePageNav colors={colors} />
      <div
        className='vh-100'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.backgroundColor
        }}>

        {currentStep !== 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', textAlign: 'center', marginBottom: '20px', marginTop: '10px' }}>
            {steps.map((step, index) => (
              index !== 0 &&
              <div key={index} className='w-100' style={{ margin: '0 5px' }}>
                <IconButton
                  style={{
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    backgroundColor: currentStep === index ? '#ec1b90' : 'transparent',
                    color: currentStep === index ? '#ffffff' : 'rgb(0,0,0)',
                    fontSize: '16px'
                  }}
                  onClick={() => handleStepClick(index)}
                >
                  {index}
                </IconButton>
              </div>
            ))}
          </div>
        )}

        <Container
          component="main"
          maxWidth="sm"
        >
          <animated.div style={{ ...springProps }}>
            <Card
              style={{
                minHeight: 'auto',
                minWidth: 'auto',
                width: '100%',
                position: 'relative',
                backgroundColor: colors.backgroundColor,
                padding: '10px',
                boxShadow: 'none',
                border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`,
                borderRadius: 0
              }}
              className='rounded-1'
            >
              <CardContent>

                <Typography style={{ color: '#ec1b90', fontSize: '22px', textAlign: 'center' }}>
                  {steps[currentStep]}
                </Typography>

                {/* Frist & Last name */}
                {currentStep === 1 && (
                  <>
                    <TextField
                      // label="First Name"
                      placeholder='Frist Name'
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      style={{
                        color: colors.textColor,
                        marginTop: '16px',
                      }}
                    />
                    <TextField
                      // label="Last Name"
                      placeholder='Last Name'
                      variant="outlined"
                      fullWidth
                      margin="dense"
                      value={lastName}
                      onChange={handleLastNameChange}
                      style={{
                        color: colors.textColor,
                        marginTop: '16px',
                      }}
                    />
                  </>
                )}

                {/* Birthdate */}
                {currentStep === 2 && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div style={{ marginTop: '16px', padding: 0 }}>
                      <StaticDatePicker
                        orientation="landscape"
                        value={birthDate}
                        onChange={handleBirthDateChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="normal"
                            fullWidth
                            label="Birth Date"
                            style={{
                              color: colors.textColor,
                              border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`,
                            }}
                          />
                        )}
                      />
                    </div>
                  </LocalizationProvider>
                )}

                {/* Gender */}
                {currentStep === 3 && (
                  <div style={{ marginTop: '16px', textAlign: 'center', padding: 0 }}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="gender"
                        value={gender}
                        onChange={handleGenderChange}
                      >
                        <FormControlLabel value="male" control={<Radio />} label="Male" style={{ color: colors.textColor }} />
                        <FormControlLabel value="female" control={<Radio />} label="Female" style={{ color: colors.textColor }} />
                        <FormControlLabel value="other" control={<Radio />} label="Other" style={{ color: colors.textColor }} />
                      </RadioGroup>
                    </FormControl>
                  </div>
                )}

                {/* Location */}
                {currentStep === 4 && (
                  <CountrySelector
                    onSelectCountry={handleCountrySelect}
                    onSelectState={handleStateSelect}
                    onSelectCity={handleCitySelect}
                    colors={colors}
                    style={{
                      textAlign: 'center',
                    }}
                  />
                )}

                {/* Bio */}
                {currentStep === 5 && (
                  <div style={{ marginTop: '16px', padding: 0 }}>
                    <TextareaAutosize
                      minRows={3}
                      maxRows={5}
                      aria-label="Bio"
                      placeholder="Write your bio here..."
                      value={bio}
                      onChange={handleBioChange}
                      style={{
                        width: '100%',
                        color: colors.textColor,
                        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`,
                        padding: '10px'
                      }}
                      className='rounded-2'
                    />
                  </div>
                )}

                {/* Avatar */}
                {currentStep === 6 && (
                  <ProfileAvatarSelector colors={colors} onCroppedImage={handleAvatarSelect} />
                )}

                {/* Error */}
                {validationError && (
                  <Typography variant="body2" color="error" style={{ marginTop: '16px', textAlign: 'center' }}>
                    {validationError}
                  </Typography>
                )}

                {/* Back */}
                <div className='d-flex justify-content-around align-content-center mt-3 mb-0'>
                  {currentStep !== 0 && (
                    <Tooltip title="Back" placement="left">
                      <IconButton
                        type="button"
                        variant="text"
                        onClick={handleBackClick}
                        startIcon={<ArrowBackIcon style={{ color: colors.iconColor }} />}
                        style={{ color: colors.textColor }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    </Tooltip>
                  )}

                  {/* Next */}
                  {currentStep < steps.length - 1 && (
                    <span
                      style={{
                        cursor: 'pointer',
                        color: '#ec1b90',
                        fontSize: '26px',
                        fontWeight: currentStep === 0 ? 500 : 400,
                        marginLeft: currentStep === 0 ? '5px' : '0',
                        transition: 'font-weight 0.3s ease',
                        textDecoration: 'underline'
                      }}
                      onClick={handleNextClick}
                      className='mb-0'
                    >
                      {currentStep === 0 ? "Let's Start" :
                        <Tooltip title="Next" placement="right">
                          <IconButton style={{ color: colors.iconColor }}>
                            <ArrowForward />
                          </IconButton>
                        </Tooltip>

                      }
                    </span>
                  )}


                  {/* Submit */}
                  {currentStep === steps.length - 1 && (
                    <ProfilePageSubmit colors={colors} onClick={handleSubmit} isDisabled={isSubmitDisabled || loading} />
                  )}
                </div>

              </CardContent>
            </Card>

            <LoadingBar progress={loadingBarProgress} height={3} color="#ec1b90" onLoaderFinished={() => setLoadingBarProgress(0)} />

          </animated.div>
        </Container>
      </div>
    </div>
  );
};

export default ProfilePage;