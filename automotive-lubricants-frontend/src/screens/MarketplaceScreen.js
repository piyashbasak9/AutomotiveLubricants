import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import CategoryChip from '../components/CategoryChip';
import ProductCard from '../components/ProductCard';
import Icon from 'react-native-vector-icons/Ionicons';

export default function MarketplaceScreen() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      const uniqueCategories = ['All', ...response.data.categories];
      setCategories(uniqueCategories);
    } catch (error) {
      console.log('Failed to fetch categories', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.log('Failed to fetch products', error);
    }
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(p => p.category.includes(selectedCategory));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.full_name || user?.username}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color="#2A5C82" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Products"
          placeholderTextColor="#888"
        />
      </View>

      <Text style={styles.heroText}>
        Unlock Peak Performance with the perfect Lubricant Oils
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(cat => (
          <CategoryChip
            key={cat}
            label={cat}
            selected={selectedCategory === cat}
            onPress={() => setSelectedCategory(cat)}
          />
        ))}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's New</Text>
        <View style={styles.newArrivalCard}>
          <Text style={styles.newArrivalLabel}>New Arrival</Text>
          <Text style={styles.newArrivalTitle}>NEXT-GEN PERFORMANCE</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <FlatList
          horizontal
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />
      </View>

      <View style={styles.bottomTabs}>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="home" size={24} color="#2A5C82" />
          <Text style={styles.tabLabelActive}>Marketplace</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="construct" size={24} color="#888" />
          <Text style={styles.tabLabel}>Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="car" size={24} color="#888" />
          <Text style={styles.tabLabel}>Roadside</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Icon name="person" size={24} color="#888" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  greeting: { fontSize: 14, color: '#666' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  logoutButton: { padding: 5 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  heroText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  categoriesContainer: { maxHeight: 50, marginBottom: 20 },
  categoriesContent: { paddingHorizontal: 20 },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  newArrivalCard: {
    backgroundColor: '#2A5C82',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
  },
  newArrivalLabel: { color: '#fff', fontSize: 14, opacity: 0.8 },
  newArrivalTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  productsList: { paddingLeft: 20, paddingRight: 10 },
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  tabItem: { alignItems: 'center' },
  tabLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  tabLabelActive: { fontSize: 12, color: '#2A5C82', fontWeight: '500', marginTop: 2 },
});