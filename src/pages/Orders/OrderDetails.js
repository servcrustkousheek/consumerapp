import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PageHeader from '../../Components/PageHeader'; // adjust import as per project
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const OrderDetails = () => {
  const navigation = useNavigation();

  // You can pass these as props or from route.params
  const details = {
    product: 'Stone- 60MM Product',
    orderId: 'TS18_13-2324-68',
    status: 'DISPATCH',
    quantity: 300,
    amount: 3200,
    distance: '12 KM',
    payMode: 'UPI',
    payStatus: 'Successful',
    orderedOn: '25-06-2024',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <PageHeader title="Order Details" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.product}>{details.product}</Text>
        <View style={styles.divider} />

        <KeyValue label="Order ID" value={details.orderId} boldRight />
        <KeyValue
          label="Order Status"
          value={
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{details.status}</Text>
            </View>
          }
        />
        <KeyValue label="Quantity" value={details.quantity} />
        <KeyValue label="Invoice Amount" value={`₹ ${details.amount}`} />
        <KeyValue label="Distance" value={details.distance} />
        <KeyValue label="Pay Mode" value={details.payMode} />
        <KeyValue label="Pay Status" value={details.payStatus} />
        <KeyValue label="Ordered On" value={details.orderedOn} />

        <TouchableOpacity style={styles.trackBtn}>
          <Text style={styles.trackText}>Track Shipment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const KeyValue = ({label, value, boldRight}) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Text style={[styles.value, boldRight && styles.bold]}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );
};
export default OrderDetails;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    // backgroundColor: '#fff',
    margin: 18,
    marginTop: 12,
    // borderRadius: 14,
    padding: 18,
    alignItems: 'stretch',
    // elevation: 2,
  },
  product: {
    color: '#128170',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ececec',
    marginVertical: 10,
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
    flex: 1.5,
  },
  value: {
    color: '#1a1a1a',
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  bold: {
    fontWeight: 'bold',
    color: '#181818',
    letterSpacing: 0.2,
  },
  statusBadge: {
    backgroundColor: '#d7f2f6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 2,
    alignSelf: 'flex-end',
  },
  statusText: {
    color: '#128170',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 1,
  },
  trackBtn: {
    backgroundColor: '#17897E',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  trackText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  cancelBtn: {
    backgroundColor: '#e7e7e7',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 11,
  },
  cancelText: {
    color: '#888',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.4,
  },
});
