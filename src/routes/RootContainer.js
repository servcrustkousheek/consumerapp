import React, { useEffect, useState } from 'react';

import AuthContainer from './AuthContainer';
import MainContainer from './MainContainer';
import SplashScreen from '../Screens/SplashScreen/SplashScreen';

const RootContainer = () => {
      const [loading, setIsLoading] = useState(false);
      const isAuthenticated = true;


  // Display appropriate container based on auth state
  if (loading) {
    return <SplashScreen />;
  } else if (isAuthenticated) {
    return <MainContainer />;
  } else {
    return <AuthContainer />;
  }
};

export default RootContainer;
