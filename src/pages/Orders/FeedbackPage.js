import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import PageHeader from '../../Components/PageHeader';
import {SafeAreaView} from 'react-native-safe-area-context';

// Star SVG component
const Star = ({filled = false, size = 28}) => {
  const fillColor = filled ? '#F9B404' : '#d5d5d5ff';
  const strokeColor = filled ? '#F9B404' : '#d5d5d5ff';

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </Svg>
  );
};

// One rating line with label + stars
const RatingRow = ({label, rating, onRate}) => {
  return (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            activeOpacity={0.7}
            onPress={() => onRate(star)}
            accessibilityLabel={`${label} ${star} stars`}
            accessible
            hitSlop={{top: 10, bottom: 10, left: 5, right: 5}}
            style={{marginHorizontal: 6}}>
            <Star filled={star <= rating} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function FeedbackScreen({navigation}) {
  const [aggregateQuality, setAggregateQuality] = useState(2);
  const [materialQuality, setMaterialQuality] = useState(4);
  const [serviceQuality, setServiceQuality] = useState(3);
  const [deliveryQuality, setDeliveryQuality] = useState(4);
  const [salesTeamQuality, setSalesTeamQuality] = useState(4);
  const [customerSupportQuality, setCustomerSupportQuality] = useState(2);
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    const feedbackData = {
      aggregateQuality,
      materialQuality,
      serviceQuality,
      deliveryQuality,
      salesTeamQuality,
      customerSupportQuality,
      comments,
    };
    console.log('Submitted Feedback:', feedbackData);
    alert('Feedback submitted successfully!');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <PageHeader
        title="Feedback"
        onBack={() => navigation && navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: '#fff'}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <RatingRow
            label="Aggregate Quality"
            rating={aggregateQuality}
            onRate={setAggregateQuality}
          />
          <RatingRow
            label="Material Quality"
            rating={materialQuality}
            onRate={setMaterialQuality}
          />
          <RatingRow
            label="Service Quality"
            rating={serviceQuality}
            onRate={setServiceQuality}
          />
          <RatingRow
            label="Delivery Quality"
            rating={deliveryQuality}
            onRate={setDeliveryQuality}
          />
          <RatingRow
            label="Sales Team Quality"
            rating={salesTeamQuality}
            onRate={setSalesTeamQuality}
          />
          <RatingRow
            label="Customer Support Quality"
            rating={customerSupportQuality}
            onRate={setCustomerSupportQuality}
          />

          <Text style={styles.commentLabel}>Comments</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Add your Comments here"
            placeholderTextColor="#A5A5A5"
            style={styles.commentBox}
            value={comments}
            onChangeText={setComments}
            textAlignVertical="top"
            accessibilityLabel="Comments Input"
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Submit Feedback"
            activeOpacity={0.8}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
  },

  ratingRow: {
    marginBottom: 30, // space between rating sections
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007A73',
    marginBottom: 8, // space between label and stars
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  commentLabel: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    marginBottom: 6,
  },
  commentBox: {
    backgroundColor: '#E1E1E1',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#000',
    height: 90,
  },
  submitButton: {
    backgroundColor: '#15857C',
    borderRadius: 6,
    paddingVertical: 14,
    marginTop: 30,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
