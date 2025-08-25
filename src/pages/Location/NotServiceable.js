import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Circle, Path, Line, Polyline} from 'react-native-svg';
 
const MAIN_COLOR = '#159487';
 
const NotServiceable = ({onBack}) => (
  <View style={{flex: 1}}>
    {/* Header */}
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        {/* SVG Back Arrow */}
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Polyline
            points="15,6 9,12 15,18"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>
    </View>
 
    {/* Body */}
    <View style={styles.body}>
      <View style={styles.iconContainer}>
        <Svg width={130} height={130} viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="60" fill="#F0F2F3" />
          {/* Location Pin */}
          <Path
            d="M60 40c-9 0-16 7-16 16 0 10 16 28 16 28s16-18 16-28c0-9-7-16-16-16zm0 23a7 7 0 1 1 0-14 7 7 0 0 1 0 14z"
            fill={MAIN_COLOR}
          />
          {/* Diagonal Slash */}
          <Line
            x1="36"
            y1="36"
            x2="84"
            y2="84"
            stroke={MAIN_COLOR}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </Svg>
      </View>
 
      <Text style={styles.title}>Location Not Serviceable</Text>
      <Text style={styles.subtitle}>
        We're sorry, but we don't offer service in your area yet. We're
        expanding quickly and hope to reach you soon!
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Try Different Location</Text>
      </TouchableOpacity>
    </View>
  </View>
);
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  header: {
    height: 120,
    backgroundColor: MAIN_COLOR,
    justifyContent: 'center',
    paddingLeft: 8,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    marginTop: 12,
  },
  iconContainer: {
    marginBottom: 36,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#8B8B8B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: MAIN_COLOR,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 250,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
 
export default NotServiceable;