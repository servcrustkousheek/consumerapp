import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {SvgUri} from 'react-native-svg';
// import PaymentSuccessSVG from '../../Utils/PaymentSuccessSVG'; // Use your SVG component here
const successIcon =
  'https://d3b1cj4ht2fm8t.cloudfront.net/staging/Consumer_App_Final/payment_Success.svg';

const PaymentSuccess = ({navigation, route}) => {
  // Replace with dynamic order ID if available
  const orderId = route?.params?.orderId || 'TS18_13-2324-68';
  const handleContinue = () => {
    // Navigate to home, orders, or any desired screen
    // navigation.replace('Footer');
    Alert.alert('navigate to Dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* SVG Illustration Here */}
        {/* <PaymentSuccessSVG width={150} height={150} /> */}
        <View style={styles.svgPlaceholder}>
          {/* Remove if using real SVG */}
          {/* <Text style={{ fontSize: 80 }}>✅</Text> */}
          <SvgUri uri={successIcon} />
        </View>
        <Text style={styles.title}>YAY! Payment Successful</Text>
        <Text style={styles.desc}>
          Your Order has been placed successfully.{'\n'}
          Please use Order ID for further communication
        </Text>
        <Text style={styles.orderId}>*{orderId}*</Text>
        <Text style={styles.desc2}>Thanks for ordering with us.</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};
export default PaymentSuccess;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    marginBottom: 24,
  },
  svgPlaceholder: {
    marginBottom: 14,
    marginTop: 4,
    borderRadius: 99,
    backgroundColor: '#F4F8FA',
    padding: 20,
  },
  title: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  desc: {
    color: '#7A7A7A',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#128170',
    textAlign: 'center',
    marginVertical: 7,
    letterSpacing: 1,
  },
  desc2: {
    color: '#7A7A7A',
    fontSize: 14,
    textAlign: 'center',
    marginTop: -2,
  },
  button: {
    backgroundColor: '#128170',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 15,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },
});
