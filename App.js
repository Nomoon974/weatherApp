import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Image, TextInput, ScrollView, ImageBackground } from 'react-native';
import { getLocation } from './services/LocationService';
import { getWeather } from './services/WeatherService';
import * as ImagePicker from 'expo-image-picker';

const weatherBackgrounds = {
  Clear: require('./assets/sun.webp'),
  Clouds: require('./assets/cloud.webp'),
  Rain: require('./assets/rain.webp'),
  Snow: require('./assets/snow.webp'),
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const loc = await getLocation();
        setLocation(loc);
        const weatherData = await getWeather(loc.latitude, loc.longitude);
        setWeather(weatherData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const addTag = () => {
    if (tag) {
      setTags([...tags, tag]);
      setTag('');
    }
  };

  if (loading) {
    return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
  }

  const weatherType = weather ? weather.weather[0].main : 'Clear';
  const backgroundImage = weatherBackgrounds[weatherType] || weatherBackgrounds['Clear'];

  return (
      <ImageBackground source={backgroundImage} style={styles.background}>
        <ScrollView contentContainerStyle={styles.container}>
          {weather && (
              <>
                <Text style={styles.cityName}>{weather.name}</Text>
                <Text style={styles.temperature}>{weather.main.temp}°C</Text>
                <Text style={styles.description}>{weather.weather[0].description}</Text>
                <Image
                    style={styles.weatherIcon}
                    source={{ uri: `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` }}
                />
              </>
          )}
          <Button title="Sélectionner une image" onPress={pickImage} />
          <View style={styles.imageContainer}>
            {images.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.image} />
            ))}
          </View>
          <TextInput
              style={styles.input}
              placeholder="Ajouter un tag"
              value={tag}
              onChangeText={setTag}
              onSubmitEditing={addTag}
          />
          <View style={styles.tagContainer}>
            {tags.map((t, index) => (
                <Text key={index} style={styles.tag}>
                  #{t}
                </Text>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Ajoute une légère opacité pour que le texte soit lisible
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 28,
    color: '#666',
    marginBottom: 5,
  },
  description: {
    fontSize: 24,
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 20,
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    width: '80%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 5,
    margin: 5,
  },
});
