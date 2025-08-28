import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import Svg, {Path, Rect, Circle} from 'react-native-svg';
import {SCREEN_HEIGHT} from '../../Utils/Dimensions';
import {useNavigation} from '@react-navigation/native';

const ordersData = [
  {
    id: 'TS18.13-2324-68',
    name: 'Stone- 60MM Product',
    status: 'In Transit',
    category: 'Aggregate',
  },
  {
    id: 'BR22.45-1156-92',
    name: 'Red Clay Bricks',
    status: 'Delivered',
    category: 'Bricks',
  },
  {
    id: 'AG15.78-3421-33',
    name: 'Crushed Stone- 40MM',
    status: 'Cancelled',
    category: 'Aggregate',
  },
  {
    id: 'BR33.12-9087-44',
    name: 'Fire Resistant Bricks',
    status: 'In Transit',
    category: 'Bricks',
  },
  {
    id: 'AG29.56-7654-21',
    name: 'Gravel Mix- 20MM',
    status: 'Delivered',
    category: 'Aggregate',
  },
  {
    id: 'BR41.88-2345-67',
    name: 'Concrete Hollow Blocks',
    status: 'Processing',
    category: 'Bricks',
  },
  {
    id: 'TS67.23-5432-19',
    name: 'Sand Stone- 80MM',
    status: 'Delivered',
    category: 'Aggregate',
  },
  {
    id: 'BR52.34-8765-55',
    name: 'Fly Ash Bricks',
    status: 'In Transit',
    category: 'Bricks',
  },
  {
    id: 'AG18.91-4321-88',
    name: 'Recycled Concrete Aggregate',
    status: 'Cancelled',
    category: 'Aggregate',
  },
  {
    id: 'BR63.77-1987-22',
    name: 'Engineering Clay Bricks',
    status: 'Delivered',
    category: 'Bricks',
  },
  {
    id: 'TS45.66-6789-11',
    name: 'Limestone Chips- 25MM',
    status: 'Processing',
    category: 'Aggregate',
  },
  {
    id: 'BR74.55-3456-99',
    name: 'Perforated Clay Bricks',
    status: 'In Transit',
    category: 'Bricks',
  },
  {
    id: 'AG32.44-7890-77',
    name: 'River Sand Aggregate',
    status: 'Delivered',
    category: 'Aggregate',
  },
  {
    id: 'BR85.33-2468-44',
    name: 'Calcium Silicate Bricks',
    status: 'Cancelled',
    category: 'Bricks',
  },
  {
    id: 'TS59.22-1357-66',
    name: 'Granite Aggregate- 50MM',
    status: 'Processing',
    category: 'Aggregate',
  },
  {
    id: 'BR96.11-9753-33',
    name: 'AAC Lightweight Blocks',
    status: 'Delivered',
    category: 'Bricks',
  },
  {
    id: 'AG73.88-8642-55',
    name: 'Crushed Basalt- 30MM',
    status: 'In Transit',
    category: 'Aggregate',
  },
  {
    id: 'BR14.77-5729-88',
    name: 'Refractory Fire Bricks',
    status: 'Processing',
    category: 'Bricks',
  },
  {
    id: 'TS84.66-3816-22',
    name: 'Quarry Dust Aggregate',
    status: 'Delivered',
    category: 'Aggregate',
  },
  {
    id: 'BR25.55-7194-11',
    name: 'Solid Concrete Blocks',
    status: 'Cancelled',
    category: 'Bricks',
  },
];

const statusColors = {
  'In Transit': '#009688',
  Delivered: '#0BAC3B',
  Cancelled: '#FFC107',
  Processing: '#2196F3',
};

// Search Icon SVG as component
const SearchIcon = ({size = 20, color = '#8B8B99'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 21l-4.35-4.35"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Minimalist Filter (3 stacked lines) Icon SVG component
const FilterIcon = ({size = 20, color = '#8B8B99'}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Top Line - Full width */}
    <Path d="M3 6h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    {/* Middle Line - Medium width */}
    <Path d="M6 12h12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    {/* Bottom Line - Shortest width */}
    <Path d="M9 18h6" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const OrdersScreen = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();
  // Filter the orders based on search text (case insensitive substring matching on order name or id)
  const filteredOrders = useMemo(() => {
    if (!searchText.trim()) return ordersData;
    const lower = searchText.toLowerCase();
    return ordersData.filter(
      order =>
        order.name.toLowerCase().includes(lower) ||
        order.id.toLowerCase().includes(lower),
    );
  }, [searchText]);

  // Handle click for View Info
  const handleViewInfo = order => {
    Alert.alert('View Info', `Order ID: ${order.id}\nName: ${order.name}`);
    navigation.navigate('OrderInfo', {
      id: order.id,
      name: order.name,
    });
  };

  // Handle click for Reorder
  const handleReorder = order => {
    Alert.alert('Reorder', `Reordering product: ${order.name}`);
  };

  // Handle filter icon click (stub)
  const handleFilterClick = () => {
    // Alert.alert('Filter', 'Filter functionality not implemented.');
    navigation.navigate('FilterOrders');
  };

  const renderOrderItem = ({item}) => (
    <View style={styles.orderCard}>
      <View style={{marginBottom: 4}}>
        <Text style={styles.orderName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: statusColors[item.status] || '#999'},
          ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.orderId}>ID: {item.id}</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => handleViewInfo(item)}>
          <Text style={styles.viewInfoText}>View Info</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleReorder(item)}>
          <Text style={styles.reorderText}>Reorder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={18} />
          <TextInput
            placeholder="Search for an order"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
            placeholderTextColor="#8B8B99"
          />
        </View>
        <TouchableOpacity
          onPress={handleFilterClick}
          style={styles.filterIconContainer}
          activeOpacity={0.7}
          accessibilityLabel="Filter Orders">
          <FilterIcon size={22} />
        </TouchableOpacity>
      </View>

      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.latestOrdersText}>Latest orders</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('View all', 'View all orders')}>
          <Text style={styles.viewAllText}>View all</Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item, i) => item.id + i}
        renderItem={renderOrderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}
        ListEmptyComponent={
          <Text style={styles.noOrdersText}>No orders found.</Text>
        }
      />
      <View style={{height: 100}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F8FA',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    shadowColor: '#00000011',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    marginLeft: 8,
    fontSize: 14,
    color: '#262626',
    flex: 1,
  },
  filterIconContainer: {
    marginLeft: 10,
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00000011',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  latestOrdersText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
  },
  viewAllText: {
    fontSize: 14,
    color: '#1B4A40',
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 15,
    // shadow for iOS
    shadowColor: '#00000011',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // shadow for Android
    elevation: 2,
  },
  orderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 6,
  },
  statusBadge: {
    position: 'absolute',
    right: 0,
    top: -4,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  orderId: {
    fontSize: 12,
    color: '#296045',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewInfoText: {
    color: '#296045',
    fontWeight: '600',
    fontSize: 14,
  },
  reorderText: {
    color: '#296045',
    fontWeight: '600',
    fontSize: 14,
  },
  noOrdersText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default OrdersScreen;
