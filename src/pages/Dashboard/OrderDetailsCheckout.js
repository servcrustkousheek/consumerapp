import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import {SCREEN_HEIGHT} from '../../Utils/Dimensions'; // Use your utility or hardcoded value

const paymentOptions = [
  {key: 'UPI', label: 'UPI'},
  {key: 'NetBanking', label: 'Net Banking'},
  {key: 'COD', label: 'Cash on Delivery'},
  {key: 'PayLater', label: 'Pay Later'},
];

const OrderDetails = ({category = 'Aggregate'}) => {
  const [coupon, setCoupon] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('UPI');

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

  return (
    <ScrollView style={{flex: 1, backgroundColor: '#EFEFF4'}}>
      {/* Conditionally render Red Bricks info card only if category is "Bricks" */}
      {category === 'Bricks' && (
        <View style={styles.container}>
          <View style={styles.prodHeader}>
            <Text style={styles.prodTitle}>{productInfo.title}</Text>
            <TouchableOpacity>
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
            <TouchableOpacity>
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
        <FlatList
          data={paymentOptions}
          keyExtractor={item => item.key}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.paymentOption,
                selectedPayment === item.key && styles.paymentOptionSelected,
              ]}
              onPress={() => setSelectedPayment(item.key)}>
              <Text style={styles.paymentLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
          style={styles.paymentList}
        />
      </View>

      <View style={{margin: 6, padding: 6}}>
        <TouchableOpacity style={styles.proceedBtn}>
          <Text style={styles.proceedText}>Proceed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={{height: SCREEN_HEIGHT ? SCREEN_HEIGHT * 0.2 : 120}} />
    </ScrollView>
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
  paymentList: {marginVertical: 10},
  paymentOption: {
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  paymentOptionSelected: {backgroundColor: '#f0f0f0'},
  paymentLabel: {fontSize: 15, color: '#222'},
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

export default OrderDetails;
