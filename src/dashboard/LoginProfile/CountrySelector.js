import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const CountrySelector = ({ onSelectCountry, onSelectState, onSelectCity }) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [countries, setCountries] = useState([]);
  const [statesByCountry, setStatesByCountry] = useState({});
  const [citiesByState, setCitiesByState] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('https://api.countrystatecity.in/v1/countries', {
      headers: {
        'X-CSCAPI-KEY': 'dzFrNFdBb00xRnpjYlRSdXlBQ1hJMFd4aWM5b2RCREQ0Y09Vc1VUdA=='
      }
    })
      .then(response => {
        setCountries(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        setLoading(false);
      });
  }, []);

  const fetchStatesByCountry = (iso2) => {
    setLoading(true);
    axios.get(`https://api.countrystatecity.in/v1/countries/${iso2}/states`, {
      headers: {
        'X-CSCAPI-KEY': 'dzFrNFdBb00xRnpjYlRSdXlBQ1hJMFd4aWM5b2RCREQ0Y09Vc1VUdA=='
      }
    })
      .then(response => {
        setStatesByCountry(prevStates => ({
          ...prevStates,
          [iso2]: response.data.map(state => state)
        }));
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching states for ${iso2}:`, error);
        setLoading(false);
      });
  };

  const fetchCitiesByState = (iso2) => {
    setLoading(true);
    axios.get(`https://api.countrystatecity.in/v1/countries/${selectedCountry}/states/${iso2}/cities`, {
      headers: {
        'X-CSCAPI-KEY': 'dzFrNFdBb00xRnpjYlRSdXlBQ1hJMFd4aWM5b2RCREQ0Y09Vc1VUdA=='
      }
    })
      .then(response => {
        setCitiesByState(response.data.map(city => city));
        setLoading(false);
      })
      .catch(error => {
        console.error(`Error fetching cities for ${iso2}:`, error);
        setLoading(false);
      });
  };

  useEffect(() => {
    onSelectCountry(countries.find(country => country.iso2 === selectedCountry)?.name || '');
  }, [selectedCountry, countries, onSelectCountry]);

  useEffect(() => {
    onSelectState(statesByCountry[selectedCountry]?.find(state => state.iso2 === selectedState)?.name || '');
  }, [selectedState, selectedCountry, statesByCountry, onSelectState]);

  useEffect(() => {
    onSelectCity(citiesByState.find(city => city.name === selectedCity)?.name || '');
  }, [selectedCity, citiesByState, onSelectCity]);


  const handleCountryChange = (event) => {
    const countryIso2 = event.target.value;
    setSelectedCountry(countryIso2);
    setSelectedState('');
    setSelectedCity('');
    fetchStatesByCountry(countryIso2);
  };

  const handleStateChange = (event) => {
    const stateIso2 = event.target.value;
    setSelectedState(stateIso2);
    setSelectedCity('');
    fetchCitiesByState(stateIso2);
  };

  const handleCityChange = (event) => {
    const cityValue = event.target.value;
    setSelectedCity(cityValue);
  };

  return (
    <div style={{ width: '300px' }}>
      <FormControl fullWidth>
        <InputLabel className='mb-3' id="country-label">Country</InputLabel>
        <Select
          labelId="country-label"
          id="country-select"
          value={selectedCountry}
          onChange={handleCountryChange}
        >
          {loading ? (
            <MenuItem disabled>Loading...</MenuItem>
          ) : (
            countries.map((country) => (
              <MenuItem key={country.iso2} value={country.iso2}>
                {country.name}
              </MenuItem>
            ))
          )}
        </Select>
      </FormControl>

      {selectedCountry && (
        <FormControl fullWidth style={{ marginTop: '16px' }}>
          <InputLabel className='mb-3' id="state-label">State</InputLabel>
          <Select
            labelId="state-label"
            id="state-select"
            value={selectedState}
            onChange={handleStateChange}
          >
            {loading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              statesByCountry[selectedCountry]?.map((state) => (
                <MenuItem key={state.iso2} value={state.iso2}>
                  {state.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      )}

      {selectedState && (
        <FormControl fullWidth style={{ marginTop: '16px' }}>
          <InputLabel className='mb-3' id="city-label">City</InputLabel>
          <Select
            labelId="city-label"
            id="city-select"
            value={selectedCity}
            onChange={handleCityChange}
          >
            {loading ? (
              <MenuItem disabled>Loading...</MenuItem>
            ) : (
              citiesByState.map((city) => (
                <MenuItem key={city.id} value={city.name}>
                  {city.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default CountrySelector;