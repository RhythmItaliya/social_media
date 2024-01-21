import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import SubSubOptionsComponent from './SubSubOptionsComponent';
import { useSelector } from 'react-redux';

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

  const profileuuid = useSelector((state) => state.profileuuid.uuid);

  const handleSubOptionClick = (index) => {
    setSelectedSubOption(index);
  };

  const handleInputChange = (subOption, value) => {
    setApiData((prevData) => ({
      ...prevData,
      [subOption]: value,
    }));
  };

  const renderInputRow = () => {
    if (selectedSubOption !== null && subOptions[selectedSubOption].option.toLowerCase() !== 'avatar') {
      const selectedSubOptionLabel = subOptions[selectedSubOption].option;
      let defaultValue = '';

      if (apiData) {
        if (selectedSubOptionLabel.toLowerCase() === 'name') {
          defaultValue = `${apiData.firstName} ${apiData.lastName}`;
        } else {
          defaultValue = apiData[selectedSubOptionLabel.toLowerCase()];
        }
      }

      return (
        <TextField
          className='w-75 mx-auto p-2'
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
      );
    }
    return null;
  };

  const renderAvatar = () => {
    if (apiData && selectedSubOption !== null) {
      const subOptionLabel = subOptions[selectedSubOption].option.toLowerCase();
      if (subOptionLabel === 'avatar' && apiData.photoURL) {
        return (
          <img
            src={apiData.photoURL}
            alt="Avatar"
            style={{ width: '100px', height: '100px', borderRadius: '50%', border: `2px solid ${colors.border}` }}
          />
        );
      }
    }
    return null;
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
        } else {
          const error = await response.json();
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
