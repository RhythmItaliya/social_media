// SubOptionsComponent.js
import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material';
import { ArrowForward, Update } from '@mui/icons-material';
import SubSubOptionsComponent from './SubSubOptionsComponent';
import { useSelector } from 'react-redux';
import ProfilePhotoUpload from '../dashboard/Profile/ProfilePhotoUpload';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowBackIos } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import config from '../configuration';
import { message } from 'antd';
import { TextareaAutosize } from '@mui/material';

import CountrySelector from '../dashboard/LoginProfile/CountrySelector';

import 'react-datepicker/dist/react-datepicker.css';
import DeleteAllPosts from './deleteAllPosts';


const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const SubOptionsComponent = ({ subOptions, colors, onBackButtonClick }) => {
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [bio, setBio] = useState('');

  const [validationMessage, setValidationMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const profileuuid = useSelector((state) => state.profileuuid.uuid);

  const handleSubOptionClick = (index) => {
    setSelectedSubOption(index);
  };

  const handleBackButtonClick = () => {
    setSelectedSubOption(null);
    setValidationMessage('');
  };

  const handleBackButtonClickMain = () => {
    setSelectedSubOption(null);
    setValidationMessage('');
    onBackButtonClick();
  }

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/settings/userProfile/get/${profileuuid}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setApiData(data);

          setSelectedGender(data.gender || '');
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');

          setBio(data.bio || '');

          if (data.birthDate) {
            const serverDate = new Date(data.birthDate);
            setSelectedDate(serverDate);
          }
        } else {
          const error = await response.text();
          console.error('Error fetching user profile data:', error);
        }
      } catch (error) {
        console.error('Server error:', error);
      }
    };

    fetchData();
  }, [profileuuid]);


  const handleInputChange = (subOption, value) => {
    if (subOption === 'firstName') {
      setFirstName(value);
    } else if (subOption === 'lastName') {
      setLastName(value);
    } else {
      setApiData((prevData) => ({
        ...prevData,
        [subOption]: value,
      }));
    }
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleLocationChange = (field, value) => {
    setApiData(prevData => ({
      ...prevData,
      location: {
        ...prevData.location,
        [field]: value
      }
    }));
  };

  const handleUpdateButtonClick = async (subOption) => {
    try {
      let dataToUpdate = {};
      let isValid = true;
      let fieldDisplayName = '';

      if (subOption.toLowerCase() === 'name') {
        if (firstName && lastName) {
          dataToUpdate = { firstName, lastName };
          fieldDisplayName = 'Name';
        } else {
          isValid = false;
          setValidationMessage('First name and last name cannot be empty.');
        }

      } else if (subOption.toLowerCase() === 'gender') {
        if (selectedGender) {
          dataToUpdate = { gender: selectedGender };
          fieldDisplayName = 'Gender';
        } else {
          isValid = false;
          setValidationMessage('Gender cannot be empty.');
        }

      } else if (subOption.toLowerCase() === 'birthdate') {
        if (selectedDate) {
          const formattedServerDate = selectedDate.toISOString();
          dataToUpdate = { [subOption.toLowerCase()]: formattedServerDate };
          fieldDisplayName = 'Birthdate';
        } else {
          isValid = false;
          setValidationMessage('Birthdate cannot be empty.');
        }

      } else if (subOption.toLowerCase() === 'location') {
        if (country && state && city) {
          dataToUpdate = {
            location: JSON.stringify({ country, state, city })
          };
          fieldDisplayName = 'Location';
        } else {
          isValid = false;
          setValidationMessage('Country, state, and city cannot be empty.');
        }

      } else if (subOption.toLowerCase() === 'bio') {
        if (bio) {
          dataToUpdate = { bio: bio };
          fieldDisplayName = 'Bio';
        }

      } else {
        dataToUpdate = { [subOption.toLowerCase()]: apiData[subOption.toLowerCase()] };
      }

      if (isValid) {
        const response = await fetch(`${config.apiUrl}/settings/userProfile/update/${profileuuid}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToUpdate),
        });

        if (response.ok) {
          setSuccessMessage(`Update successful for ${fieldDisplayName}!`);
          message.success(`Update successful for ${fieldDisplayName}!`);
        } else {
          setValidationMessage('Failed to update. Please try again.');
        }
      }
    } catch (error) {
      console.error('Server error:', error);
      setValidationMessage('Failed to update. Please try again.');
    }
  };

  const renderValidationMessage = () => {
    if (validationMessage) {
      return <Typography variant="caption" color="error">{validationMessage}</Typography>;
    }
    return null;
  };



  const renderInputRow = () => {
    if (selectedSubOption !== null) {
      const selectedSubOptionLabel = subOptions[selectedSubOption].option;

      let defaultValue = '';
      if (apiData) {
        defaultValue = apiData[selectedSubOptionLabel.toLowerCase()] || '';
      }

      if (selectedSubOptionLabel.toLowerCase() === 'name') {
        return (
          <div className='p-2 w-100 mx-auto d-flex justify-content-center align-content-center'>
            <TextField
              variant="standard"
              label="First Name"
              value={firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              InputProps={{
                style: {
                  color: colors.textColor,
                  borderBottom: `1px solid ${colors.border}`,
                  '&:focus': {
                    color: colors.focusColor,
                  },
                },
              }}
              InputLabelProps={{
                style: {
                  color: colors.labelColor,
                },
              }}
            />
            <TextField
              variant="standard"
              label="Last Name"
              value={lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              InputProps={{
                style: {
                  color: colors.textColor,
                  borderBottom: `1px solid ${colors.border}`,
                  '&:focus': {
                    color: colors.focusColor,
                  },
                },
              }}
              InputLabelProps={{
                style: {
                  color: colors.labelColor,
                },
              }}
            />
            <IconButton
              style={{
                color: colors.iconColor,
              }}
              onClick={() => handleUpdateButtonClick('name')}
            >
              <Update />
            </IconButton>
          </div>
        );
      }

      if (selectedSubOptionLabel.toLowerCase() === 'gender') {
        return (
          <div className='p-2 w-100 mx-auto d-flex justify-content-center align-content-center'>
            <FormControlLabel
              control={
                <div>
                  <Radio
                    checked={selectedGender === 'male'}
                    onChange={() => handleGenderChange('male')}
                  />
                  Male
                  <Radio
                    checked={selectedGender === 'female'}
                    onChange={() => handleGenderChange('female')}
                  />
                  Female
                  <Radio
                    checked={selectedGender === 'other'}
                    onChange={() => handleGenderChange('other')}
                  />
                  Other
                </div>
              }
              style={{
                color: colors.labelColor,
              }}
            />
            <IconButton
              style={{
                color: colors.iconColor,
              }}
              onClick={() => handleUpdateButtonClick(selectedSubOptionLabel.toLowerCase())}
            >
              <Update />
            </IconButton>
          </div>
        );
      }

      if (selectedSubOptionLabel.toLowerCase() === 'bio') {
        return (
          <div className='p-2 w-100 mx-auto d-flex justify-content-center align-content-center'>
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
            <IconButton
              style={{
                color: colors.iconColor,
              }}
              onClick={() => handleUpdateButtonClick('bio')}
            >
              <Update />
            </IconButton>
          </div>
        );
      }

      if (selectedSubOptionLabel.toLowerCase() === 'birthdate') {
        return (
          <div className='p-2 w-100 mx-auto d-flex justify-content-center align-content-center'>
            <DatePicker
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy" />
            <IconButton
              style={{
                color: colors.iconColor,
              }}
              onClick={() => handleUpdateButtonClick('birthdate')}
            >
              <Update />
            </IconButton>
          </div>
        );
      }


      if (selectedSubOptionLabel.toLowerCase() === 'location') {
        return (
          <div className='p-2 w-100 mx-auto d-flex justify-content-center align-content-center'>
            <CountrySelector
              colors={colors}
              onSelectCountry={(selectedCountry) => {
                handleLocationChange('country', selectedCountry);
                setCountry(selectedCountry); // Update the selected country in the component state
              }}
              onSelectState={(selectedState) => {
                handleLocationChange('state', selectedState);
                setState(selectedState); // Update the selected state in the component state
              }}
              onSelectCity={(selectedCity) => {
                handleLocationChange('city', selectedCity);
                setCity(selectedCity); // Update the selected city in the component state
              }}
            />
            <IconButton
              style={{
                color: colors.iconColor,
              }}
              onClick={() => handleUpdateButtonClick('location')}
            >
              <Update />
            </IconButton>
          </div>
        );
      }

      if (selectedSubOptionLabel.toLowerCase() !== 'avatar') {
        return (
          <div className='p-2 w-100 mx-auto d-flex justify-content-center align-content-center'>
            <TextField
              variant="standard"
              label={`Set Your ${selectedSubOptionLabel} `}
              value={defaultValue}
              onChange={(e) => handleInputChange(selectedSubOptionLabel.toLowerCase(), e.target.value)}
              InputProps={{
                style: {
                  color: colors.textColor,
                  borderBottom: `1px solid ${colors.border} `,
                  '&:focus': {
                    color: colors.focusColor,
                  },
                },
              }}
              InputLabelProps={{
                style: {
                  color: colors.labelColor,
                },
              }}
            />
            <IconButton
              style={{
                color: colors.iconColor,
              }}
              onClick={() => handleUpdateButtonClick(selectedSubOptionLabel.toLowerCase())}
            >
              <Update />
            </IconButton>
          </div>
        );
      }
    }

    return null;
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
  };

  const renderAvatar = () => {
    const subOptionLabel = selectedSubOption !== null ? subOptions[selectedSubOption].option.toLowerCase() : '';

    if (subOptionLabel === 'avatar') {
      return (
        <div
          className='w-100 mx-auto d-flex justify-content-center align-content-center p-4'
          style={{
            borderBottom: `1px solid rgba(${hexToRgb(colors.border)
              }, 0.5)`
          }}
        >
          <ProfilePhotoUpload colors={colors} />
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {selectedSubOption !== null ? (
        <>
          <SubSubOptionsComponent backbutton={handleBackButtonClick} subSubOptions={subOptions[selectedSubOption].subOptions} colors={colors} />
          {renderInputRow()}
          {renderAvatar()}
          {renderValidationMessage()}
        </>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>

                <TableCell align="center" style={{
                  borderBottom: `1px solid rgba(${hexToRgb(colors.border)
                    }, 0.5)`
                }}>
                  <div style={{ color: colors.textColor }}>
                    <IconButton onClick={handleBackButtonClickMain}>
                      <ArrowBackIos />
                    </IconButton>
                    Set Your Account
                  </div>
                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {subOptions.map((subOption, index) => (
                <React.Fragment key={index}>
                  <TableRow
                    onClick={() => handleSubOptionClick(index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell style={{
                      borderBottom: `1px solid rgba(${hexToRgb(colors.border)
                        }, 0.5)`, color: colors.textColor
                    }}>
                      {subOption.option}
                      <ArrowForward style={{ color: colors.iconColor, fontSize: '18px', marginLeft: '10px' }} />
                    </TableCell>
                  </TableRow>
                  {index === selectedSubOption && renderInputRow()}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default SubOptionsComponent;
