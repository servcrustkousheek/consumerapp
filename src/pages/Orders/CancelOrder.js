import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PageHeader from '../../Components/PageHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
// import NotificationIcon from '../../Utils/NotificationIcon'; // Substitute with your icon if needed

const REASONS = [
  'Order taking too long',
  'Changed my mind',
  'Ordered by mistake',
  'Other reason',
];

const CancelOrder = ({navigation}) => {
  const [selected, setSelected] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    // Replace with API call or navigation as needed
    alert('Cancellation submitted');
    navigation.goBack();
  };
  const handleSkip = () => {
    // Replace with skip logic
    alert('Skipped cancellation feedback');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f6f8fa'}}>
      {/* Custom header with notification icon */}
      <PageHeader
        title="Cancel Order"
        onBack={() => navigation && navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Sad Emoji - replace with SVG if desired */}
        <Text style={styles.emoji}>😞</Text>
        <Text style={styles.heading}>We are sorry to see you go</Text>
        <Text style={styles.subtext}>Let us know where we went wrong</Text>
        {/* Feedback */}
        <TextInput
          style={styles.input}
          value={feedback}
          onChangeText={setFeedback}
          multiline
          numberOfLines={3}
          placeholder="Add your feedback here"
          placeholderTextColor="#bcbcbc"
        />
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Add your Comments here"
          placeholderTextColor="#A5A5A5"
          style={styles.commentBox}
          value={feedback}
          onChangeText={setFeedback}
          textAlignVertical="top"
          accessibilityLabel="Comments Input"
        />
        {/* Reasons */}
        <View style={styles.reasonList}>
          {REASONS.map((reason, i) => (
            <TouchableOpacity
              key={reason}
              style={styles.radioRow}
              onPress={() => setSelected(i)}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.radioOuter,
                  selected === i && styles.radioOuterActive,
                ]}>
                {selected === i && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioText}>{reason}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Buttons */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit and Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip and cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default CancelOrder;
const styles = StyleSheet.create({
  notifyWrap: {
    position: 'absolute',
    right: 21,
    top: 12,
  },
  notifyIcon: {
    fontSize: 22,
    color: '#FFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
  },
  emoji: {
    fontSize: 75,
    marginTop: 12,
    marginBottom: 10,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 19,
    color: '#222',
    marginTop: 4,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtext: {
    color: '#979DAD',
    fontSize: 13,
    marginBottom: 11,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5fa',
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: '#e2e4e7',
    width: '95%',
    minHeight: 55,
    fontSize: 13,
    color: '#222',
    padding: 12,
    marginBottom: 18,
    textAlignVertical: 'top',
  },
  reasonList: {
    width: '95%',
    marginTop: 9,
    marginBottom: 26,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  radioOuter: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#12B5A3',
    backgroundColor: '#FFF',
    marginRight: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#128170',
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#128170',
  },
  radioText: {
    fontSize: 15,
    color: '#111',
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: '#128170',
    borderRadius: 7,
    paddingVertical: 13,
    alignItems: 'center',
    width: '95%',
    marginTop: 7,
  },
  submitText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  skipText: {
    color: '#128170',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 16,
    alignSelf: 'center',
  },
});
