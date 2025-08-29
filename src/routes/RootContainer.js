import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthContainer from './AuthContainer';
import MainContainer from './MainContainer';
import SplashScreen from '../Screens/SplashScreen/SplashScreen';
import OnboardingScreen from '../pages/OnboardingScreens/OnboardingScreen';

const RootContainer = () => {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Get auth state from Redux
  const {isAuthenticated} = useSelector(state => state.Auth);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      // Check if user has seen onboarding
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

      // Show splash for 3 seconds
      setTimeout(() => {
        setLoading(false);

        // If user hasn't seen onboarding, show it
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }
      }, 3000);
    } catch (error) {
      console.error('Error checking app state:', error);
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  };

  // Flow: Splash → Onboarding → Auth → Main
  if (loading) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (isAuthenticated) {
    return <MainContainer />;
  }

  return <AuthContainer />;
};

export default RootContainer;
