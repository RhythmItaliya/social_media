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
} from '@mui/material';
import { ArrowForward, Update } from '@mui/icons-material';
import SubSubOptionsComponent from './SubSubOptionsComponent';
import { useSelector } from 'react-redux';
import ProfilePhoto from '../dashboard/Profile/ProfilePhotoUpload';
import DatePicker from 'react-datepicker'; // Importing react-datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Importing styles

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const SubOptionsComponent = ({ subOptions, colors }) => {
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const profileuuid = useSelector((state) => state.profileuuid.uuid);

  const handleSubOptionClick = (index) => {
    setSelectedSubOption(index);
  };

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDatePickerOpen(false);
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
          <div className='p-2 w-75 mx-auto d-flex justify-content-center align-content-center'>
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
          <div className='p-2 w-75 mx-auto d-flex justify-content-center align-content-center'>
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

      if (selectedSubOptionLabel.toLowerCase() === 'birthdate') {
        const formattedDate = `${('0' + selectedDate.getDate()).slice(-2)}/${('0' + (selectedDate.getMonth() + 1)).slice(-2)}/${selectedDate.getFullYear()}`;

        return (
          <div className='p-2 w-75 mx-auto d-flex justify-content-center align-content-center'>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              open={isDatePickerOpen}
              onOpen={() => setDatePickerOpen(true)}
              dateFormat="dd/MM/yyyy" // Set the desired date format
              customInput={
                <TextField
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
              }
            />
            <IconButton
              style={{
                color: colors.iconColor,
              }}
              onClick={() => handleUpdateButtonClick('birthDate')}
            >
              <Update />
            </IconButton>
          </div>
        );
      }

      if (selectedSubOptionLabel.toLowerCase() !== 'avatar') {
        return (
          <div className='p-2 w-75 mx-auto d-flex justify-content-center align-content-center'>
            <TextField
              variant="standard"
              label={`Set Your ${selectedSubOptionLabel}`}
              value={defaultValue}
              onChange={(e) => handleInputChange(selectedSubOptionLabel.toLowerCase(), e.target.value)}
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
          className='w-50 mx-auto d-flex justify-content-center align-content-center p-4'
          style={{
            borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`
          }}
        >
          {apiData && apiData.photoURL ? (
            <Avatar
              src={apiData.photoURL}
              alt="Avatar"
              style={{ width: '100px', height: '100px' }}
            />
          ) : null}

          <ProfilePhoto />
        </div>
      );
    }
    return null;
  };

  const handleUpdateButtonClick = async (subOption) => {
    try {
      let dataToUpdate = {};

      if (subOption.toLowerCase() === 'name') {
        dataToUpdate = { firstName, lastName };
      } else if (subOption.toLowerCase() === 'gender') {
        dataToUpdate = { gender: selectedGender };
      } else if (subOption.toLowerCase() === 'birthdate') {
        const formattedServerDate = selectedDate.toISOString();
        dataToUpdate = { [subOption.toLowerCase()]: formattedServerDate };
      } else {
        dataToUpdate = { [subOption.toLowerCase()]: apiData[subOption.toLowerCase()] };
      }

      const response = await fetch(`http://localhost:8080/userProfile/update/${profileuuid}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToUpdate),
      });

      // Handle the response as needed...

    } catch (error) {
      console.error('Server error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/userProfile/get/${profileuuid}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setApiData(data);
          setSelectedGender(data.gender || '');
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');

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

  return (
    <>
      {selectedSubOption !== null ? (
        <>
          <SubSubOptionsComponent subSubOptions={subOptions[selectedSubOption].subOptions} colors={colors} />
          {renderInputRow()}
          {renderAvatar()}
        </>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" style={{ color: colors.textColor, borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)` }}>
                  Set Your Account
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
                    <TableCell style={{ borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`, color: colors.textColor }}>
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
