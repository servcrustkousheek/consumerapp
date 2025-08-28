import {View, Text, StyleSheet, Platform} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Svg, Path, G, SvgUri} from 'react-native-svg';

import axios from 'axios';
import CustomButton from '../../Components/CustomButton';
import Orders from './Orders';
import Rewards from './Rewards';
import DashBoard from './DashBoard';
import Referrals from './Referrals';
import Profile from './Profile';
import Header from '../../Components/Header';

const Tab = createBottomTabNavigator();

const ICON_URLS = {
  Orders:
    'https://d3b1cj4ht2fm8t.cloudfront.net/staging/marketing+and+sales+app/priceanalysis.svg',
  Rewards:
    'https://d3b1cj4ht2fm8t.cloudfront.net/staging/marketing+and+sales+app/b2cleads.svg',
  //dashboard: 'https://d3b1cj4ht2fm8t.cloudfront.net/staging/SC-P+V2/Dashboard.svg',
  Referrals:
    'https://d3b1cj4ht2fm8t.cloudfront.net/staging/marketing+and+sales+app/performance.svg',
  Profile:
    'https://d3b1cj4ht2fm8t.cloudfront.net/staging/marketing+and+sales+app/locationfilled.svg',
};

// Custom component that fetches and renders SVG with color override
const ColorableSvgIcon = ({url, color, style}) => {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await axios.get(url);
        setSvgContent(response.data);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSvg();
  }, [url]);

  if (!svgContent) {
    return null;
  }

  // Extract SVG path data using regex (simplified approach)
  const pathMatch = svgContent.match(/<path[^>]*d="([^"]*)"[^>]*>/g);
  const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  if (!pathMatch) {
    return null;
  }

  return (
    <Svg
      width={style.width || 24}
      height={style.height || 24}
      viewBox={viewBox}
      style={style}>
      <G fill={color}>
        {pathMatch.map((pathStr, index) => {
          const dMatch = pathStr.match(/d="([^"]*)"/);
          if (dMatch) {
            return <Path key={index} d={dMatch[1]} fill={color} />;
          }
          return null;
        })}
      </G>
    </Svg>
  );
};

const Footer = () => {
  return (
    <>
      <Tab.Navigator
        initialRouteName="dashboard"
        screenOptions={({navigation, route}) => ({
          // headerShown: false,
          header: () => <Header route={route} navigation={navigation} />,
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 80,
            backgroundColor: '#282A37',
            borderTopWidth: 0,
            borderTopEndRadius: 30,
            borderTopStartRadius: 30,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            // paddingBottom: Platform.OS === 'android' && 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginTop: Platform.OS === 'ios' ? 3 : 0,
            marginBottom: Platform.OS === 'ios' ? 0 : 4,
          },
        })}>
        <Tab.Screen
          name="Orders"
          component={Orders}
          options={{
            title: 'Orders',
            tabBarIcon: ({focused}) => (
              <ColorableSvgIcon
                url={ICON_URLS.Orders}
                color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                style={{width: 24, height: 24}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Rewards"
          component={Rewards}
          options={{
            title: 'Rewards',
            tabBarIcon: ({focused}) => (
              <ColorableSvgIcon
                url={ICON_URLS.Rewards}
                color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                style={{width: 24, height: 24}}
              />
            ),
          }}
        />

        <Tab.Screen
          name="dashboard"
          component={DashBoard}
          options={{
            tabBarHideOnKeyboard: true,
            title: '',

            tabBarIcon: () => (
              <View style={styles.centerIconContainer}>
                <SvgUri
                  uri={
                    'https://d3b1cj4ht2fm8t.cloudfront.net/staging/SC-P+V2/Dashboard.svg'
                  }
                  style={styles.centerIcon}
                />
              </View>
            ),
            tabBarButton: props => <CustomButton {...props} />,
          }}
        />

        <Tab.Screen
          name="Referrals"
          component={Referrals}
          options={{
            title: 'Referrals',
            tabBarIcon: ({focused}) => (
              <ColorableSvgIcon
                url={ICON_URLS.Referrals}
                color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                style={{width: 24, height: 24}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            title: 'Profile',
            tabBarIcon: ({focused}) => (
              <ColorableSvgIcon
                url={ICON_URLS.Profile}
                color={focused ? '#fff' : 'rgba(255,255,255,0.6)'}
                style={{width: 24, height: 24}}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  centerIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  centerIcon: {
    width: 60,
    height: 60,
  },
});

export default Footer;
