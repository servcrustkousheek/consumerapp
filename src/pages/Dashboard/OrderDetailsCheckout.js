import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import {SCREEN_HEIGHT} from '../../Utils/Dimensions'; // Use your utility or hardcoded value
import {SvgUri} from 'react-native-svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import PageHeader from '../../Components/PageHeader';
import {useNavigation} from '@react-navigation/native';

const paymentOptions = [
  {
    key: 'UPI',
    label: 'UPI',
    icon: 'https://d3b1cj4ht2fm8t.cloudfront.net/staging/Consumer_App_Final/upi.svg',
  },
  {
    key: 'NetBanking',
    label: 'Net Banking',
    icon: 'https://d3b1cj4ht2fm8t.cloudfront.net/staging/Consumer_App_Final/netbanking.svg',
  },
  {
    key: 'COD',
    label: 'Cash on Delivery',
    icon: 'https://d3b1cj4ht2fm8t.cloudfront.net/staging/Consumer_App_Final/cash on delivery.svg',
  },
  {
    key: 'PayLater',
    label: 'Pay Later',
    icon: 'https://d3b1cj4ht2fm8t.cloudfront.net/staging/Consumer_App_Final/pay layter.svg',
  },
];

const OrderDetailsCheckout = ({route}) => {
  const [coupon, setCoupon] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('UPI');
  const navigation = useNavigation();
  const category = route.params.category;
  // Example order summary data
  const summary = {
    item: '6MM',
    quantity: 250,
    itemTotal: 2300,
    logistics: 900,
    discount: 100,
    cgst: 31,
    sgst: 29,
    total: 3160,
  };

  // Example Red Bricks info data (only show when category is 'Bricks')
  const productInfo = {
    title: 'Red Bricks',
    colloquialType: 'Sun Dried Bricks',
    brandName: 'PVC',
    dimensions: '11 x 12 x 12',
    stockUnits: 0,
  };

  const onProceed = () => {
    Alert.alert(
      'Payment Status',
      'Did the payment succeed?',
      [
        {
          text: 'Failed',
          onPress: () => {
            // Code to execute if payment failed
            console.log('Payment failed. Handle failure logic here.');
            navigation.navigate('PaymentFailed');

            // For example: navigate to failure screen, show retry, etc.
          },
          style: 'cancel',
        },
        {
          text: 'Success',
          onPress: () => {
            // Code to execute if payment succeeded
            console.log('Payment successful. Handle success logic here.');
            navigation.navigate('PaymentSuccess');
            // For example: navigate to success screen, update order status, etc.
          },
        },
      ],
      {cancelable: false},
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#EFEFF4'}}>
      <PageHeader
        title="Order Details"
        onBack={() => {
          navigation.goBack();
        }}
      />
      <ScrollView style={{flex: 1, backgroundColor: '#EFEFF4'}}>
        {/* Conditionally render Red Bricks info card only if category is "Bricks" */}
        {category === 'Bricks' && (
          <View style={styles.container}>
            <View style={styles.prodHeader}>
              <Text style={styles.prodTitle}>{productInfo.title}</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.prodRow}>
              <Text style={styles.prodLabel}>Colloquial Type</Text>
              <Text style={styles.prodValue}>{productInfo.colloquialType}</Text>
            </View>
            <View style={styles.prodRow}>
              <Text style={styles.prodLabel}>Brand Name</Text>
              <Text style={styles.prodValue}>{productInfo.brandName}</Text>
            </View>
            <View style={styles.prodRow}>
              <Text style={styles.prodLabel}>Dimensions</Text>
              <Text style={styles.prodValue}>{productInfo.dimensions}</Text>
            </View>
            <View style={styles.prodRow}>
              <Text style={styles.prodLabel}>Stock ( In Units)</Text>
              <Text style={styles.prodValue}>{productInfo.stockUnits}</Text>
            </View>
          </View>
        )}

        {/* Existing item info and order summary */}
        {category === 'Aggregate' && (
          <View style={styles.container}>
            <View style={styles.itemRow}>
              <Text style={styles.itemTitle}>{summary.item}</Text>
              <Text style={styles.itemQuantity}>
                {summary.quantity} CFT Quantity
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.container}>
          <View style={styles.breakdown}>
            <BreakdownRow label="Item Total" value={`₹${summary.itemTotal}`} />
            <BreakdownRow
              label="Logistic Charges"
              value={`₹${summary.logistics}`}
            />
            <BreakdownRow
              label="Discounts"
              value={`-₹${summary.discount}`}
              valueStyle={styles.negativeValue}
            />
            <BreakdownRow label="CGST" value={`₹${summary.cgst}`} />
            <BreakdownRow label="SGST" value={`₹${summary.sgst}`} />
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total To Pay</Text>
            <Text style={styles.totalValue}>₹{summary.total}</Text>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.couponRow}>
            <TextInput
              value={coupon}
              onChangeText={setCoupon}
              placeholder="Enter coupon code"
              style={styles.couponInput}
            />
            <TouchableOpacity style={styles.applyBtn}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.container}>
          <View style={styles.paymentList}>
            {paymentOptions.map(item => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.paymentOption,
                  selectedPayment === item.key && styles.paymentOptionSelected,
                ]}
                onPress={() => setSelectedPayment(item.key)}>
                <View style={styles.paymentOptionRow}>
                  {/* Replace the View below with your icon component */}
                  <View style={styles.paymentIconPlaceholder}>
                    {/* Example icon could be: <YourIconComponent name={item.iconName} size={20} /> */}
                    {/* <Text style={{color: '#555'}}>{item.icon || '🔹'}</Text> */}
                    <SvgUri uri={item.icon} />
                  </View>
                  <Text style={styles.paymentLabel}>{item.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{margin: 6, padding: 6}}>
          <TouchableOpacity style={styles.proceedBtn} onPress={onProceed}>
            <Text style={styles.proceedText}>Proceed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              navigation.navigate('CancelOrder');
            }}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: SCREEN_HEIGHT ? SCREEN_HEIGHT * 0.2 : 120}} />
      </ScrollView>
    </SafeAreaView>
  );
};

function BreakdownRow({label, value, valueStyle}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 12,
    padding: 16,
    elevation: 3,
    marginBottom: 0,
  },
  prodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    alignItems: 'center',
  },
  prodTitle: {fontWeight: 'bold', fontSize: 18, marginBottom: 6},
  prodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  prodLabel: {fontSize: 15, color: '#333'},
  prodValue: {fontSize: 15, color: '#111', fontWeight: '600'},
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 12,
    padding: 16,
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemTitle: {fontWeight: 'bold', fontSize: 16},
  itemQuantity: {color: '#666', marginLeft: 10, flex: 1},
  editText: {color: '#2196F3', fontWeight: 'bold'},
  breakdown: {marginVertical: 10},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  rowLabel: {fontSize: 14, color: '#333'},
  rowValue: {fontSize: 14, color: '#222'},
  negativeValue: {color: '#009966'},
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  totalLabel: {fontWeight: 'bold', fontSize: 15},
  totalValue: {fontWeight: 'bold', fontSize: 15},
  couponRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  couponInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 40,
  },
  applyBtn: {
    backgroundColor: '#00897B',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 16,
  },
  applyText: {color: 'white', fontWeight: '600'},
  paymentList: {
    marginVertical: 10,
  },
  paymentOption: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  paymentOptionSelected: {
    backgroundColor: '#d8d8d8ff',
    borderRadius: 12,
  },
  paymentOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIconPlaceholder: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 28,
  },
  paymentLabel: {
    fontSize: 15,
    color: '#222',
  },

  proceedBtn: {
    backgroundColor: '#00897B',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    marginVertical: 8,
    paddingVertical: 16,
    marginBottom: 16,
  },
  proceedText: {color: 'white', fontWeight: 'bold', fontSize: 16},
  cancelBtn: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelText: {color: '#222', fontWeight: 'bold', fontSize: 16},
});

export default OrderDetailsCheckout;
