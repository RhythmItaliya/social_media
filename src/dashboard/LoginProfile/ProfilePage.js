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
import FormLabel from '@mui/material/FormLabel';
import { useDarkMode } from '../../theme/Darkmode';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CountrySelector from './CountrySelector';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ProfileAvatarSelector from './ProfileAvatarSelector';
import ProfilePageSubmit from './ProfilePageSubmit';
import CryptoJS from 'crypto-js';
import './profilepage.css';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import LoadingBar from 'react-top-loading-bar';


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
    'Make Your Profile',
    'First and Last Name',
    'Birth Date',
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
      if (!selectedCountry || !selectedState) {
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
    console.log('Decrypted UUID:', decryptedUuid);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      for (let progress = 0; progress <= 100; progress++) {
        setLoadingBarProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const response = await fetch(`http://localhost:8080/api/profilepage/create/${isdecryptedUuid}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          location: selectedCountry,
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




  return (
    <Container
      component="main"
      maxWidth="sm"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <animated.div style={{ ...springProps }}>
        <Card
          style={{
            boxShadow: colors.boxShadow,
            minHeight: 'auto',
            minWidth: 'auto',
            width: '100%',
            position: 'relative',
            backgroundColor: colors.backgroundColor,
            border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`,
          }}
        >
          <CardContent>
            {validationError && (
              <Typography variant="body2" color="error" style={{ marginBottom: '16px' }}>
                {validationError}
              </Typography>
            )}

            <Typography variant="h5" gutterBottom style={{ marginBottom: '16px', color: colors.textColor }}>
              {steps[currentStep]}
            </Typography>

            {/* fristlast name */}
            {currentStep === 1 && (
              <>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  style={{
                    color: colors.textColor,
                    border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`,
                    marginTop: '16px',
                  }}
                />
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={lastName}
                  onChange={handleLastNameChange}
                  style={{
                    color: colors.textColor,
                    border: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`,
                    marginTop: '16px',
                  }}
                />
              </>
            )}

            {/* birthdate */}
            {currentStep === 2 && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{ marginTop: '16px' }}>
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

            {/* gender */}
            {currentStep === 3 && (
              <div style={{ marginTop: '16px' }}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" style={{ color: colors.textColor }}>Gender</FormLabel>
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

            {currentStep === 4 && (
              <CountrySelector
                onSelectCountry={handleCountrySelect}
                onSelectState={handleStateSelect}
              />
            )}

            {currentStep === 5 && (
              <div style={{ marginTop: '16px' }}>
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
                  }}
                />
              </div>
            )}

            {currentStep === 6 && (
              <ProfileAvatarSelector onCroppedImage={handleAvatarSelect} />
            )}

            <div className='d-flex justify-content-around align-content-center mt-3'>
              {currentStep !== 0 && (
                <IconButton
                  type="button"
                  variant="text"
                  onClick={handleBackClick}
                  startIcon={<ArrowBackIcon style={{ color: colors.iconColor }} />}
                  style={{ color: colors.textColor }}
                >
                  Back
                </IconButton>
              )}

              {currentStep < steps.length - 1 && (
                <IconButton type="button" variant="contained" color="primary" onClick={handleNextClick}>
                  {currentStep === 0 ? "Let's Start" : "Next"}
                </IconButton>
              )}

              {currentStep === steps.length - 1 && (
                <ProfilePageSubmit onClick={handleSubmit} isDisabled={isSubmitDisabled || loading} />
              )}
            </div>

          </CardContent>
        </Card>

        <LoadingBar progress={loadingBarProgress} height={3} color="#f11946" onLoaderFinished={() => setLoadingBarProgress(0)} />

      </animated.div>
    </Container>
  );
};

export default ProfilePage;