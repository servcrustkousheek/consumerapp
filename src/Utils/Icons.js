import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Svg, {Path, Rect, Circle, Line, Polygon, Text} from 'react-native-svg';

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

export const ChevronRightIcon = ({size = 24, color = '#000', style}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}>
      <Path
        d="M9 6L15 12L9 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const BackIcon = ({
  size = 32,
  color = 'black',
  backgroundColor = '#dadada',
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: 50,
            marginRight: 6,
            backgroundColor: backgroundColor,
          },
        ]}>
        <Svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none">
          {/* Arrowhead (chevron) */}
          <Path
            d="M13 6L7 12L13 18"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Tail (horizontal line) */}
          <Path
            d="M7 12H18"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};

export const CloseIcon = ({size = 24, color = 'black', onPress}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: 50,
            marginRight: 6,
            backgroundColor: '#dadada',
          },
        ]}>
        <Svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none">
          {/* X shape */}
          <Path
            d="M6 6L18 18"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Path
            d="M6 18L18 6"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Phone call icon inside circle
export const CallIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Path
      d="M6.62 10.79a15.09 15.09 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21 11.38 11.38 0 003.54.57 1 1 0 011 1v3.79a1 1 0 01-1 1A18 18 0 014 6a1 1 0 011-1h3.79a1 1 0 011 1 11.38 11.38 0 00.57 3.54 1 1 0 01-.21 1.11l-2.53 2.14z"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Challan icon (document with DC letter)
export const ChallanIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    {/* Document outline */}
    <Path
      d="M7 2h8a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Top bar */}
    <Path d="M7 8h10" stroke="white" strokeWidth={2} strokeLinecap="round" />
    {/* 'DC' Letters inside doc */}
    <Text
      x="9"
      y="15"
      fontSize="8"
      fontWeight="bold"
      fill="white"
      fontFamily="Arial">
      DC
    </Text>
  </Svg>
);

// Feedback icon (chat bubble with stars)
export const FeedbackIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    {/* Chat bubble */}
    <Path
      d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h12a2 2 0 012 2v10z"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Three stars */}
    <Path
      d="M8 10l-.618 1.902L5 12l1.69 1.17L6 15l1-1 1-2-1-.8z"
      fill="white"
    />
    <Path
      d="M12 10l-.618 1.902L9 12l1.69 1.17L10 15l1-1 1-2-1-.8z"
      fill="white"
    />
    <Path
      d="M16 10l-.618 1.902L13 12l1.69 1.17L14 15l1-1 1-2-1-.8z"
      fill="white"
    />
  </Svg>
);

// Download icon (arrow down)
export const InvoicesIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3v14m-4-4l4 4 4-4"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M4 21h16" stroke="white" strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// Order Details icon (list/table)
export const OrderDetailsIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    {/* Outer rectangle */}
    <Rect
      x="4"
      y="5"
      width="16"
      height="14"
      rx="2"
      ry="2"
      stroke="white"
      strokeWidth={2}
      fill="none"
    />
    {/* horizontal lines representing rows */}
    <Line x1="8" y1="9" x2="16" y2="9" stroke="white" strokeWidth={2} />
    <Line x1="8" y1="13" x2="16" y2="13" stroke="white" strokeWidth={2} />
    <Line x1="8" y1="17" x2="16" y2="17" stroke="white" strokeWidth={2} />
  </Svg>
);

// Cancel icon (cross)
export const CancelIcon = () => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
