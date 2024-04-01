// Settings.js
import React, { useState } from 'react';
import { useDarkMode } from '../theme/Darkmode';
import { Container, Grid, Paper, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import { ArrowForward } from '@mui/icons-material';
import SubOptionsComponent from './SubOptionsComponent';

function createData(name, subOptions) {
  return { name, subOptions };
}

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
  valueTextColor: '#ffffff',
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const dataMapping = {
  'Account Info': [
    { option: 'Username', subOptions: 'username' },
    { option: 'Avatar', subOptions: 'avatar' },
    { option: 'Name', subOptions: 'firstName lastName' },
    { option: 'Gender', subOptions: 'gender' },
    { option: 'Bio', subOptions: 'bio' },
    { option: 'Location', subOptions: 'location' },
    { option: 'Birthdate', subOptions: 'birthDate' },
  ],
  'Post Info': [
    { option: 'Delete Post', subOptions: 'delete post' },
  ],
};


export default function Settings() {
  const { isDarkMode } = useDarkMode();
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (index, name, subOptions) => {
    if (name) {
      setSelectedRow(index);
    }
  };

  const handleBackButtonClick = () => {
    setSelectedRow(null);
  };

  const rows = Object.entries(dataMapping).map(([name, subOptions]) => createData(name, subOptions));

  const SubOptionsComponentInstance = selectedRow !== null ? (
    <SubOptionsComponent
      subOptions={dataMapping[rows[selectedRow].name]}
      onBackButtonClick={handleBackButtonClick}
      colors={isDarkMode ? darkModeColors : lightModeColors}
    />
  ) : null;

  return (
    <Container maxWidth="md" style={{ minHeight: '100vh', padding: 16, border: `1px solid rgba(${hexToRgb(isDarkMode ? darkModeColors.border : lightModeColors.border)}, 0.5)` }}>
      <Stack spacing={2}>
        <Grid container component={Paper} elevation={3} style={{ backgroundColor: isDarkMode ? darkModeColors.backgroundColor : lightModeColors.backgroundColor, color: isDarkMode ? darkModeColors.textColor : lightModeColors.textColor }}>
          {SubOptionsComponentInstance || (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      style={{
                        borderBottom: `1px solid rgba(${hexToRgb(isDarkMode ? darkModeColors.border : lightModeColors.border)}, 0.5)`,
                        color: isDarkMode ? darkModeColors.textColor : lightModeColors.textColor,
                      }}>
                      Set Your Account
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={row.name}
                      onClick={() => handleRowClick(index, row.name, row.subOptions)}
                      style={{ cursor: 'pointer', backgroundColor: index === selectedRow ? isDarkMode ? darkModeColors.focusColor : lightModeColors.focusColor : 'inherit' }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        style={{
                          borderBottom: `1px solid rgba(${hexToRgb(isDarkMode ? darkModeColors.border : lightModeColors.border)}, 0.5)`,
                          color: isDarkMode ? darkModeColors.textColor : lightModeColors.textColor,
                        }}>
                        {row.name}
                        <ArrowForward
                          style={{
                            color: isDarkMode ? darkModeColors.iconColor : lightModeColors.iconColor,
                            fontSize: '18px',
                            marginLeft: '10px',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Stack>
    </Container>
  );
}