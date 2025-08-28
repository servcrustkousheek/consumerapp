import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import PageHeader from '../../Components/PageHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
// For date picking, you may use a custom modal or a package like @react-native-community/datetimepicker
// For dropdown, use a package like 'react-native-picker-select' or a custom dropdown as per your components
// import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Install this for an easy modal date picker

const STATUS_OPTIONS = [
  'All',
  'In Transit',
  'Delivered',
  'Cancelled',
  'Processing',
  'Dispatch',
];
const PAY_STATUS_OPTIONS = ['All', 'Successful', 'Pending', 'Failed'];

export default function FilterOrders({navigation}) {
  const [startDate, setStartDate] = useState('27-02-2024');
  const [endDate, setEndDate] = useState('27-03-2024');
  const [showPicker, setShowPicker] = useState({field: null, visible: false});
  const [orderStatus, setOrderStatus] = useState('All');
  const [payStatus, setPayStatus] = useState('All');

  const openDatePicker = field => setShowPicker({field, visible: true});
  const closeDatePicker = () => setShowPicker({field: null, visible: false});

  const handleDateChange = date => {
    const formatted = date
      ? `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${date.getFullYear()}`
      : '';
    if (showPicker.field === 'start') setStartDate(formatted);
    else setEndDate(formatted);
    closeDatePicker();
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setOrderStatus('All');
    setPayStatus('All');
  };

  const handleApply = () => {
    // Pass filter params to order listing or fetch API etc.
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <PageHeader
        title="Orders"
        onBack={() => navigation && navigation.goBack()}
      />
      <View style={styles.panel}>
        <Text style={styles.heading}>Filter By</Text>
        <View style={styles.divider} />

        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => openDatePicker('start')}>
          <Text style={styles.inputText}>{startDate || 'DD-MM-YYYY'}</Text>
          {/* Calendar icon: SVG or Icon */}
          <Text style={styles.inputIcon}>icon</Text>
        </TouchableOpacity>

        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => openDatePicker('end')}>
          <Text style={styles.inputText}>{endDate || 'DD-MM-YYYY'}</Text>
          <Text style={styles.inputIcon}>icon</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Order Status</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => {
            // Replace with your dropdown logic or navigate to a selector modal
            // Example quick cycle for demo
            const idx =
              (STATUS_OPTIONS.indexOf(orderStatus) + 1) % STATUS_OPTIONS.length;
            setOrderStatus(STATUS_OPTIONS[idx]);
          }}>
          <Text style={styles.inputText}>{orderStatus}</Text>
          {/* Down arrow icon */}
          <Text style={styles.inputIcon}>⌄</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Pay Status</Text>
        <TouchableOpacity
          style={styles.inputRow}
          onPress={() => {
            const idx =
              (PAY_STATUS_OPTIONS.indexOf(payStatus) + 1) %
              PAY_STATUS_OPTIONS.length;
            setPayStatus(PAY_STATUS_OPTIONS[idx]);
          }}>
          <Text style={styles.inputText}>{payStatus}</Text>
          <Text style={styles.inputIcon}>⌄</Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
        {/* <DateTimePickerModal
          isVisible={showPicker.visible}
          mode="date"
          onConfirm={handleDateChange}
          onCancel={closeDatePicker}
        /> */}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#fff',
    // borderRadius: 16,
    margin: 16,
    marginTop: 20,
    padding: 18,
    // shadowColor: '#000',
    // shadowOpacity: 0.04,
    // shadowRadius: 3,
    // shadowOffset: {width: 0, height: 1},
  },
  heading: {
    color: '#128170',
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 4,
  },
  divider: {
    borderBottomColor: '#ececec',
    borderBottomWidth: 1,
    marginBottom: 16,
    marginTop: 3,
  },
  label: {
    color: '#777',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 4,
    marginTop: 12,
  },
  inputRow: {
    backgroundColor: '#f6f8fa',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#f3f3f3',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 15,
    color: '#292929',
    flex: 1,
  },
  inputIcon: {
    marginLeft: 6,
    fontSize: 18,
    color: '#90969b',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  clearBtn: {
    borderColor: '#128170',
    borderWidth: 1.3,
    paddingVertical: 9,
    paddingHorizontal: 26,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 110,
    alignItems: 'center',
  },
  clearText: {
    color: '#128170',
    fontWeight: 'bold',
    fontSize: 15,
  },
  applyBtn: {
    backgroundColor: '#128170',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 30,
    minWidth: 124,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
