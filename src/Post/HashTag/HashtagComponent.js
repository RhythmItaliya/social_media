import React from 'react';
import HashNavBar from './HashNavBar';
import HashName from './HashName';
import { useDarkMode } from '../../theme/Darkmode';

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
  transparentColor: 'rgba(255, 255, 255, 0.5)'
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
  transparentColor: 'rgba(255, 255, 255, 0.5)'
};

const HashtagComponent = () => {

  // Dark mode
  const { isDarkMode } = useDarkMode();
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  return (
    <div>
      <div>
        <HashNavBar colors={colors} />
      </div>
      <div style={{ marginTop: '85px', overflowY: 'hidden' }}>
        <HashName colors={colors} />
      </div>
    </div>
  );
}

export default HashtagComponent;
