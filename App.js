import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export default function App() {
  const [location, setLocation] = useState({
    latitude: 65.0800,
    longitude: 25.4800,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      getUserPosition();
    })();
  }, []);

  const getUserPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    try {
      if (status !== "granted") {
        console.log("Location denied");
        return;
      }

      const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({
        ...location,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLongPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkers((prevMarkers) => [...prevMarkers, coordinate]);
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        region={location}
        mapType='hybrid'
        onLongPress={handleLongPress}
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
      </MapView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0
  },
  map: {
    height: "100%",
    width: "100%"
  }
});
