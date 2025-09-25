import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeFood } from '../services/api';

export default function ScanScreen() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Se necesita permiso para acceder a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      try {
        const analysis = await analyzeFood(result.assets[0]);
        setResult(analysis);
      } catch (error) {
        Alert.alert('Error', 'No se pudo analizar la imagen');
      }
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>📷 Tomar Foto</Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loading}>Analizando...</Text>}

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Resultado del Análisis</Text>
          <Text style={styles.resultText}>Alimento: {result.foodName}</Text>
          <Text style={styles.resultText}>Carbohidratos: {result.carbohydrates}g</Text>
          <Text style={styles.resultText}>Azúcares: {result.sugars}g</Text>
          <Text style={styles.resultText}>Porción: {result.portion}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  cameraButton: {
    backgroundColor: '#e74c3c',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 16,
    color: '#3498db',
  },
  resultContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
