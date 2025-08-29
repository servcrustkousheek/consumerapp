import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import {BackIcon, CloseIcon} from '../Utils/Icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const BottomSheet = ({
  visible,
  onClose,
  onBack,
  title,
  subTitle,
  children,
  showHeader = true,
  showBack = false,
  locationSection = null,
}) => {
  if (!visible) return null;

  return (
    <Pressable style={styles.backdrop} onPress={onClose}>
      <Pressable style={styles.centeredSheet}>
        <View style={styles.sheetContainer}>
          {/* 🔹 Top Header Row */}
          {showHeader && (
            <View style={styles.headerRow}>
              {showBack ? (
                <TouchableOpacity onPress={onBack} style={styles.iconBtn}>
                  <BackIcon onPress={onBack} />
                </TouchableOpacity>
              ) : (
                <View style={{width: 34}} />
              )}

              <View style={{flex: 1}}>
                <Text style={styles.titleText}>{title}</Text>
                {!!subTitle && (
                  <Text style={styles.subTitle}>
                    For: <Text style={{color: '#159396'}}>{subTitle}</Text>
                  </Text>
                )}
              </View>

              <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                <CloseIcon size={32} onPress={onClose} />
              </TouchableOpacity>
            </View>
          )}

          {/* 🔹 Location Section (edge-to-edge, styled separately in BricksFlow) */}
          {locationSection}

          {/* 🔹 Content (with padding) */}
          <View style={styles.contentWrapper}>
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={{paddingBottom: 12}}
              showsVerticalScrollIndicator={true}>
              {children}
            </ScrollView>
          </View>

          {/* Bottom spacer (simulating safe area / handle space) */}
          <View
            style={{height: SCREEN_HEIGHT * 0.2, backgroundColor: '#fff'}}
          />
        </View>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  centeredSheet: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    width: '95%',
    marginVertical: 6,
    minHeight: 160,
    maxHeight: SCREEN_HEIGHT * 0.7, // Limits the height, enables scroll
    overflow: 'hidden',
  },

  /** --- Header Section --- */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 12, // slight breathing room
    paddingTop: 8,
  },
  iconBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
  },
  subTitle: {
    fontSize: 14,
    marginTop: 2,
    marginLeft: 8,
  },
  closeIcon: {
    fontSize: 26,
    color: '#888',
    fontWeight: 'bold',
  },

  /** --- Content Section --- */
  contentWrapper: {
    paddingHorizontal: 16, // ✅ regular content gets padding
    paddingTop: 6,
  },
  scrollArea: {
    flexGrow: 0,
    minHeight: 50,
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
});

export default BottomSheet;
