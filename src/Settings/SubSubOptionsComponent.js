import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
};

const SubSubOptionsComponent = ({ backbutton, subSubOptions, colors }) => {
    const subOptionsArray = Array.isArray(subSubOptions) ? subSubOptions : [];

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ color: colors.textColor, borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)` }}>
                                <IconButton
                                    style={{
                                        color: colors.iconColor,
                                        marginRight: '10px',
                                    }}
                                    onClick={backbutton}
                                >
                                    <ArrowBack />
                                </IconButton>
                                {`Set Your ${subSubOptions}`}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subOptionsArray.map((subOption, index) => (
                            <TableRow key={index}>
                                <TableCell style={{ borderBottom: `1px solid rgba(${hexToRgb(colors.border)}, 0.7)`, color: colors.textColor }}>
                                    {`Set Your ${subOption}`}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default SubSubOptionsComponent;
