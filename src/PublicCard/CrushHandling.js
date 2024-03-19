// CrushHandling.js
import React, { useEffect, useState } from "react";
import { Grid, IconButton, Tooltip } from "@mui/material";
import config from "../configuration";

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const CrushHandling = ({ colors, uuid, profileUUID }) => {
    const [loading, setLoading] = useState(true);
    const [isCrushAdded, setCrushAdded] = useState(false);
    const [data, setData] = useState({ success: false, status: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCrushInfo = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${config.apiUrl}/crushes/get/public/crushesRequest/?senderId=${uuid}&receiverId=${profileUUID}`);

                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.status}`);
                }

                const fetchedData = await response.json();
                setData(fetchedData);

                if (fetchedData.success) {
                    setCrushAdded(fetchedData.status === "1" || fetchedData.status === "2");
                } else {
                    setCrushAdded(false);
                }
            } catch (error) {
                console.error('Error fetching crush information:', error.message);
                setError('Error fetching crush information. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (uuid && profileUUID) {
            fetchCrushInfo();
        }
    }, [uuid, profileUUID]);

    const handleAddToCrush = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${config.apiUrl}/crushes/public/crushesRequest`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: uuid,
                    receiverId: profileUUID,
                }),
            });

            if (response.ok) {
                if (isCrushAdded) {
                    console.log('Crush removed successfully');
                } else {
                    console.log('Crush added successfully');
                }
            } else {
                console.error('Failed to handle crush information');
                setError('Failed to handle crush information. Please try again.');
            }
        } catch (error) {
            console.error('Error handling crush information:', error);
            setError('Error handling crush information. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const buttonStyle = {
        fontSize: '16px',
        color: colors.textColor,
        backgroundColor: isCrushAdded ? colors.backgroundColor : colors.backgroundColor,
        border: `1px solid rgba(${hexToRgb(colors.border)}, 0.5)`,
    };

    return (
        <>
            {loading && <p style={{ color: colors.textColor }}>
                <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <Grid container justifyContent="space-around">
                    <Tooltip title={isCrushAdded ? 'Crush Added' : 'Add to Crush'} arrow>
                        <IconButton
                            className='rounded-1'
                            style={buttonStyle}
                            onClick={handleAddToCrush}
                        >
                            {isCrushAdded ? 'Crush Added' : 'Crush'}
                        </IconButton>
                    </Tooltip>
                </Grid>
            )}
        </>
    );
}

export default CrushHandling;
