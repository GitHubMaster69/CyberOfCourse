import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const planets = [
  {
    name: 'Planet 1',
    image: require('../assets/planets/planet1.png'),
    locked: false,
  },
  {
    name: 'Planet 2',
    image: require('../assets/planets/planet2.png'),
    locked: true,
  }
  // Add more planets as needed
];
const PlanetsScreen = () => {
    const navigation = useNavigation();
  
    const handlePlanetPress = (planet) => {
      if (planet.name === 'Planet 1') {
        navigation.navigate('Planet1'); // Navigate to Planet 1
      } else {
        console.log('Planet is locked or not implemented.');
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
                planet.locked && styles.lockedPlanet,
              ]}
              disabled={planet.locked}
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
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    planetsContainer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    planetButton: {
      alignItems: 'center',
      marginBottom: 20,
      width: width * 0.8,
    },
    planetImage: {
      width: 80,
      height: 80,
    },
    planetName: {
      marginTop: 5,
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
    lockedPlanet: {
      opacity: 0.5,
    },
  });