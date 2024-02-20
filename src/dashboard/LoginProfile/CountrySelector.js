// CountrySelector.js
import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const CountrySelector = ({ onSelectCountry, onSelectState }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const countries = ['Country 1', 'Country 2', 'Country 3'];
  const statesByCountry = {
    'Country 1': ['State 1', 'State 2', 'State 3'],
    'Country 2': ['State A', 'State B', 'State C'],
    'Country 3': ['State X', 'State Y', 'State Z'],
  };

  useEffect(() => {
    onSelectCountry(selectedCountry);
    onSelectState(selectedState);
  }, [selectedCountry, selectedState, onSelectCountry, onSelectState]);

  const handleCountryChange = (event) => {
    const countryValue = event.target.value;
    setSelectedCountry(countryValue);
    setSelectedState('');
  };

  const handleStateChange = (event) => {
    const stateValue = event.target.value;
    setSelectedState(stateValue);
  };

  return (
    <div style={{ width: '300px' }}>
      <FormControl fullWidth>
        <InputLabel
          className='mb-3'
          id="country-label">Country</InputLabel>
        <Select
          labelId="country-label"
          id="country-select"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedCountry && (
        <FormControl fullWidth style={{ marginTop: '16px' }}>
          <InputLabel
            className='mb-3'
            id="state-label">State</InputLabel>
          <Select
            labelId="state-label"
            id="state-select"
            value={selectedState}
            onChange={handleStateChange}
          >
            {statesByCountry[selectedCountry].map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default CountrySelector;
