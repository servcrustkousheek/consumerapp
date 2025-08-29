import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import {BRANDCOLOR, COLORS, C100} from '../../Utils/Colors';
import {SCREEN_WIDTH, SCREEN_HEIGHT} from '../../Utils/Dimensions';

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to Servcrust',
    subtitle: 'Simplifying Your Construction Needs',
    description: 'Order aggregates, bricks, and more—quick and hassle-free',
    image:
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Seamless Ordering',
    subtitle: 'Find, Select, Order—All in One App',
    description:
      'Get high-quality materials delivered to your site effortlessly',
    image:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Reliable & Fast Delivery',
    subtitle: 'Timely Deliveries, Trusted Suppliers',
    description: 'Track your orders and get materials when you need them.',
    image:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  },
];

const OnboardingScreen = ({onComplete}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
    } else {
      // Complete onboarding
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const onViewableItemsChanged = ({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const renderOnboardingItem = ({item}) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={{uri: item.image}} style={styles.image} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex
              ? styles.paginationDotActive
              : styles.paginationDotInactive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderOnboardingItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 50}}
      />

      {renderPagination()}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
          {currentIndex !== onboardingData.length - 1 && (
            <View style={styles.nextIcon}>
              <Text style={styles.nextIconText}>→</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    paddingHorizontal: 24,
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: 300,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  textContainer: {
    flex: 0.4,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: C100,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: BRANDCOLOR,
    width: 24,
  },
  paginationDotInactive: {
    backgroundColor: '#E0E0E0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 50,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#dededeff',
    borderRadius: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: BRANDCOLOR,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 120,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  nextIcon: {
    marginLeft: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(251, 228, 228, 1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextIconText: {
    color: BRANDCOLOR,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
