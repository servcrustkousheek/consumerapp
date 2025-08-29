import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {
  CallIcon,
  CancelIcon,
  ChallanIcon,
  FeedbackIcon,
  InvoicesIcon,
  OrderDetailsIcon,
} from '../../Utils/Icons';
import PageHeader from '../../Components/PageHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';

const ICON_SIZE = 56;
const ICON_BG = '#5a5a5a';

const OrderInfo = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id, name} = route.params || {};

  // Example click handlers
  const handleCall = () => Alert.alert('Call', 'Call action clicked!');
  const handleChallan = () => Alert.alert('Challan', 'Challan action clicked!');
  const handleFeedback = () => {
    // Alert.alert('Feedback', 'Feedback action clicked!');
    navigation.navigate('FeedbackPage');
  };
  const handleInvoices = () =>
    Alert.alert('Invoices', 'Invoices action clicked!');
  const handleOrderDetails = () => {
    navigation.navigate('OrderDetails');
  };
  const handleCancel = () => {
    navigation.navigate('CancelOrder');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.screen}>
        <PageHeader
          title="Order Info"
          onBack={() => navigation && navigation.goBack()}
        />
        <View style={styles.centeredContainer}>
          <View style={styles.card}>
            <Text style={styles.productText}>{name}</Text>
            <Text style={styles.idText}>
              ID: <Text style={styles.idHighlight}>{id}</Text>
            </Text>
            <View style={styles.iconRow}>
              <TouchableOpacity style={styles.iconButton} onPress={handleCall}>
                <View style={styles.iconCircle}>
                  <CallIcon />
                </View>
                <Text style={styles.iconLabel}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleChallan}>
                <View style={styles.iconCircle}>
                  <ChallanIcon />
                </View>
                <Text style={styles.iconLabel}>Challan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleFeedback}>
                <View style={styles.iconCircle}>
                  <FeedbackIcon />
                </View>
                <Text style={styles.iconLabel}>Feedback</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.iconRow, {marginTop: 20}]}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleInvoices}>
                <View style={styles.iconCircle}>
                  <InvoicesIcon />
                </View>
                <Text style={styles.iconLabel}>Invoices</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleOrderDetails}>
                <View style={styles.iconCircle}>
                  <OrderDetailsIcon />
                </View>
                <Text style={styles.iconLabel}>Order Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleCancel}>
                <View style={styles.iconCircle}>
                  <CancelIcon />
                </View>
                <Text style={styles.iconLabel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderInfo;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  centeredContainer: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  productText: {
    fontSize: 13,
    color: '#727d89',
    fontWeight: '500',
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  idText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0e6961',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  idHighlight: {
    fontWeight: '700',
    color: '#0e6961',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  iconButton: {
    width: ICON_SIZE,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    backgroundColor: ICON_BG,
    borderRadius: ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconLabel: {
    fontSize: 12,
    color: '#0e6961',
    textAlign: 'center',
  },
});
