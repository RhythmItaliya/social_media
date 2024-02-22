// LocationPicker.js
import React, { useState } from 'react';
import { IconButton, TextField, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { message } from 'antd';
import { useDarkMode } from '../theme/Darkmode';


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

const LocationPicker = ({ onLocationChange, setValidationMessage, setLocation }) => {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    const { isDarkMode } = useDarkMode();
    const colors = isDarkMode ? darkModeColors : lightModeColors;

    const handleLocationClick = async () => {
        if (navigator.permissions) {
            try {
                const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });

                if (permissionStatus.state === 'denied') {
                    setValidationMessage('Please allow location access in your browser settings.');
                    return;
                }

                if (permissionStatus.state === 'prompt') {
                    const result = await navigator.permissions.request({ name: 'geolocation' });

                    if (result.state === 'denied') {
                        setValidationMessage('Location permission denied. Please allow access.');
                        return;
                    }
                }
            } catch (error) {
                console.error('Error checking geolocation permission:', error.message);
            }
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    setLocation({ lat: latitude, lng: longitude });

                    try {
                        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`);
                        const data = await response.json();

                        if (data.address) {
                            const cityValue = data.address.city || data.address.town || data.address.village;
                            const countryValue = data.address.country;

                            message.success({
                                content: `Location fetched successfully: ${city}, ${country}`,
                                duration: 3,
                            });

                            setCity(cityValue);
                            setCountry(countryValue);

                            // Assuming `onLocationChange` is a prop passed from the parent component
                            onLocationChange({ city: cityValue, country: countryValue });
                        }
                    } catch (error) {
                        message.error({
                            content: 'Failed  getting location. Please try again.',
                            duration: 3,
                        });
                        console.error('Error getting location information:', error.message);
                    }
                },
                (error) => {
                    message.error({
                        content: 'Failed  getting location. Please try again.',
                        duration: 3,
                    });
                    console.error('Error getting location:', error.message);
                }
            );
        } else {
            message.error({
                content: 'Failed  getting location. Please try again.',
                duration: 3,
            });
            console.error('Geolocation is not supported by this browser.');
        }
    };

    return (
        <Grid className='mt-1' item container spacing={2} alignItems="center" xs={12}>
            <Grid item xs={10}>
                <TextField
                    fullWidth
                    label="Location"
                    variant="standard"
                    value={(city && country) ? `${city},${country}` : ''}
                    InputProps={{
                        style: {
                            color: colors.textColor,
                            borderBottom: `1px solid ${colors.border}`,
                            '&:focus': {
                                color: colors.focusColor,
                            },
                        }
                    }}
                    InputLabelProps={{
                        style: {
                            color: colors.labelColor,
                        },
                    }}
                />
            </Grid>
            <Grid item xs={2}>
                <IconButton
                    type="button"
                    color="primary"
                    onClick={handleLocationClick}
                    style={{ color: colors.iconColor }}
                >
                    <LocationOnIcon />
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default LocationPicker;