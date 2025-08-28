import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const PaymentFailed = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {/* Circle with cross */}
        <View style={styles.circle}>
          <View style={[styles.crossLine, styles.crossLine1]} />
          <View style={[styles.crossLine, styles.crossLine2]} />
        </View>

        {/* Text content */}
        <Text style={styles.title}>Oops! Payment Failed</Text>
        <Text style={styles.subtitle}>
          Please try again or contact support.
        </Text>

        {/* Retry Payment Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.retryBtn}
          onPress={() => alert('Retry Payment')}>
          <Text style={styles.retryBtnText}>Retry Payment</Text>
        </TouchableOpacity>

        {/* Contact Support */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => alert('Contact Support')}>
          <Text style={styles.contactText}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CIRCLE_SIZE = 72;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F9F9F9', // optional: background for full screen
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 25,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
    width: '90%', // or fixed width like 320
    maxWidth: 360,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  crossLine: {
    position: 'absolute',
    width: 28,
    height: 4,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  crossLine1: {
    transform: [{rotate: '45deg'}],
  },
  crossLine2: {
    transform: [{rotate: '-45deg'}],
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
    color: '#1C1C1E',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  retryBtn: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  retryBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  contactText: {
    color: '#FF3B30',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default PaymentFailed;
