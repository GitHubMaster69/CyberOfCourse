import React from 'react';
import { View, StyleSheet, Image, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from './authContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const planets = [
  {
    name: 'Planet 1',
    image: require('../assets/planets/planet1.png'),
    requiredLevel: 1, // Required progress level to unlock
  },
  {
    name: 'Planet 2',
    image: require('../assets/planets/planet2.png'),
    requiredLevel: 2,
  },
];

const PlanetsScreen = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  const handlePlanetPress = (planet) => {
    if (currentUser.progressLevel >= planet.requiredLevel) {
      router.push(`/${planet.name.replace(' ', '')}`);
    } else {
      console.log('Planet is locked');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.planetsContainer}>
        {planets.map((planet, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.planetButton,
              currentUser.progressLevel < planet.requiredLevel && styles.lockedPlanet,
            ]}
            disabled={currentUser.progressLevel < planet.requiredLevel}
            onPress={() => handlePlanetPress(planet)}
          >
            <Image source={planet.image} style={styles.planetImage} />
            <Text style={styles.planetName}>{planet.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PlanetsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  planetsContainer: { alignItems: 'center', paddingVertical: 20 },
  planetButton: { alignItems: 'center', marginBottom: 20, width: width * 0.8 },
  planetImage: { width: 80, height: 80 },
  planetName: { marginTop: 5, color: '#fff', fontSize: 16, textAlign: 'center' },
  lockedPlanet: { opacity: 0.5 },
});
