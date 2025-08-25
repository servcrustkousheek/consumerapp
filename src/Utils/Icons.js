import React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
 
export const DeleteIcon = ({width = 24, height = 24, color = 'red'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 7h12M9 7v10a1 1 0 001 1h4a1 1 0 001-1V7M10 11v4M14 11v4M8 7V5a1 1 0 011-1h6a1 1 0 011 1v2"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
 
export const LocationIcon = ({width = 24, height = 24, color = '#148B7E'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z"
      fill={color}
    />
    <Circle cx="12" cy="8" r="2" fill="white" />
  </Svg>
);
 