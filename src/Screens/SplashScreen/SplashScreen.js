import {View, Text, StyleSheet, StatusBar, Image, Platform} from 'react-native';
import React, {useEffect} from 'react';
import {BRANDCOLOR, COLORS} from '../../Utils/Colors';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../Utils/Dimensions';
import {SvgUri} from 'react-native-svg';
import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';
import DeviceInfo from 'react-native-device-info';

const SplashScreen = () => {
  const appVersion = DeviceInfo.getVersion();

  useEffect(() => {
    const inAppUpdates = new SpInAppUpdates(false);
    inAppUpdates
      .checkNeedsUpdate({curVersion: appVersion})
      .then(result => {
        if (result.shouldUpdate) {
          let updateOptions = {};
          if (Platform.OS === 'android') {
            updateOptions = {
              updateType: IAUUpdateKind.IMMEDIATE,
            };
          }
          inAppUpdates.startUpdate(updateOptions);
          // inAppUpdates.addStatusUpdateListener(listener);
        }
      })
      .catch(error => {
        console.log('Error', error);
      });
  }, [appVersion]);

  return (
    <>
      <StatusBar backgroundColor={BRANDCOLOR} barStyle="light-content" />
      <View style={[styles.container]}>
        <View style={styles.logoContainer}>
          {/* Logo SVG */}
          <SvgUri
            uri={
              'https://d3b1cj4ht2fm8t.cloudfront.net/staging/marketing+and+sales+app/logo_vertical.svg'
            }
            width={SCREEN_WIDTH / 2}
            height={SCREEN_HEIGHT / 4}
          />
        </View>

        {/* M&S Text */}
        <Text style={styles.msText}>Consumer App</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BRANDCOLOR,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  taglineText: {
    fontSize: 14,
    color: COLORS.white,
    marginTop: 5,
  },
  msText: {
    fontSize: 25,
    color: COLORS.white,
    position: 'absolute',
    bottom: SCREEN_HEIGHT / 3,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
