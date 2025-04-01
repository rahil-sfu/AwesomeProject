// Maps.js
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import parksData from './dog-off-leash-parks.json';

// Import your custom icons:
import dogParkIcon from '../assets/dog-park-icon.png';
import gpsIcon from '../assets/gps-icon.png';

// DogParkMarker component with a slight scale animation.
function DogParkMarker({ park, shouldShowNames, onMarkerPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    onMarkerPress(park);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Marker
      coordinate={{
        latitude: park.geo_point_2d.lat,
        longitude: park.geo_point_2d.lon,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      onPress={handlePress}
    >
      <View style={styles.markerContainer}>
        <Animated.Image
          source={dogParkIcon}
          style={[styles.dogIcon, { transform: [{ scale: scaleAnim }] }]}
        />
      </View>
      {shouldShowNames && (
        <View style={styles.parkNameContainer}>
          <Text style={styles.parkNameText}>{park.park_name}</Text>
        </View>
      )}
    </Marker>
  );
}

export default function Maps() {
  const [region, setRegion] = useState({
    latitude: 49.2827,
    longitude: -123.1207,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPark, setSelectedPark] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const mapRef = useRef(null);

  // Compute search suggestions (without affecting the markers on the map)
  const filteredSuggestions = parksData.filter((park) =>
    park.park_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selection from the suggestions list
  const handleSelectSuggestion = (park) => {
    const newRegion = {
      latitude: park.geo_point_2d.lat,
      longitude: park.geo_point_2d.lon,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    setRegion(newRegion);
    setSelectedPark(park);
    // Reset check-in state when selecting a new park
    setIsCheckedIn(false);
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 500);
    }
    setSearchQuery('');
  };

  // Handle GPS button press – zoom in to the current location.
  const handleGpsPress = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission was denied.');
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setCurrentLocation({ latitude, longitude });
      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 500);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Determine if park names should be visible (e.g., when zoomed in enough).
  const shouldShowNames = region.latitudeDelta < 0.05;

  // When a park marker is pressed, animate to the park and mark it as selected.
  const handleParkMarkerPress = (park) => {
    const newRegion = {
      latitude: park.geo_point_2d.lat,
      longitude: park.geo_point_2d.lon,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };
    setRegion(newRegion);
    setSelectedPark(park);
    // Reset check-in state when selecting a new park
    setIsCheckedIn(false);
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 500);
    }
  };

  // Handle check-in and check-out toggling.
  const handleCheckIn = () => {
    if (selectedPark) {
      Alert.alert('Checked In', `You have checked in at ${selectedPark.park_name}`);
      setIsCheckedIn(true);
    }
  };

  const handleCheckOut = () => {
    if (selectedPark) {
      Alert.alert('Checked Out', `You have checked out from ${selectedPark.park_name}`);
      setIsCheckedIn(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar Container with Dog Icon */}
      <View style={styles.searchBarContainer}>
        <Image source={dogParkIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Dog Parks..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Suggestions Dropdown */}
      {searchQuery.length > 0 && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredSuggestions.map((park, index) => (
              <TouchableOpacity
                key={`suggestion-${index}`}
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(park)}
              >
                <Text style={styles.suggestionText}>{park.park_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        {/* Render park polygons for all parks */}
        {parksData.map((park, index) => {
          const polygonCoords = park.geom.geometry.coordinates[0].map((coord) => ({
            latitude: coord[1],
            longitude: coord[0],
          }));
          return (
            <Polygon
              key={`polygon-${index}`}
              coordinates={polygonCoords}
              strokeColor="#F00"
              fillColor="rgba(255,0,0,0.3)"
              strokeWidth={2}
            />
          );
        })}

        {/* Render current location marker */}
        {currentLocation && (
          <Marker coordinate={currentLocation}>
            <View style={styles.currentLocationMarker} />
          </Marker>
        )}

        {/* Render dog park markers for all parks */}
        {parksData.map((park, index) => (
          <DogParkMarker
            key={`park-marker-${index}`}
            park={park}
            shouldShowNames={shouldShowNames}
            onMarkerPress={handleParkMarkerPress}
          />
        ))}
      </MapView>

      {/* Check-In / Check-Out Button (visible when a park is selected) */}
      {selectedPark && (
        <TouchableOpacity
          style={styles.checkInButton}
          onPress={isCheckedIn ? handleCheckOut : handleCheckIn}
        >
          <Image source={dogParkIcon} style={styles.checkInIcon} />
          <Text style={styles.checkInButtonText}>
            {isCheckedIn
              ? `Check Out from ${selectedPark.park_name}`
              : `Check In at ${selectedPark.park_name}`}
          </Text>
        </TouchableOpacity>
      )}

      {/* GPS Button */}
      <TouchableOpacity style={styles.gpsButton} onPress={handleGpsPress}>
        <Image source={gpsIcon} style={styles.gpsIcon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  searchIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 100,
    left: 10,
    right: 10,
    maxHeight: 150,
    backgroundColor: 'white',
    borderRadius: 8,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  gpsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 25,
  },
  gpsIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  currentLocationMarker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    borderWidth: 2,
    borderColor: '#fff',
  },
  // Fixed container for the dog icon marker
  markerContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dogIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  parkNameContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
    marginTop: -5,
  },
  parkNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  checkInButton: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: '#ff8c00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  checkInIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10,
  },
  checkInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
