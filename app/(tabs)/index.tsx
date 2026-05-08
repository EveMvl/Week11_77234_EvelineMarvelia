import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Izin Ditolak", "Aplikasi butuh akses lokasi agar bisa menyimpan koordinat.");
      }
    })();
  }, []);

  const handleCaptureAndSave = async () => {
    if (!cameraRef.current || loading) return;

    try {
      setLoading(true);

      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      const { error } = await supabase
        .from('photo')
        .insert([
          {
            latitude: latitude.toString(),
            image_url: photo.uri,
          },
        ]);

      if (error) throw error;

      Alert.alert(
        "✨ Berhasil Disimpan!",
        `Data kamu telah mendarat di database.\n\n📍 Lat: ${latitude.toFixed(4)}\n📸 Gambar: Tersimpan di cache`,
        [
          { 
            text: "Mantap!", 
            onPress: () => console.log("User menutup notifikasi"),
            style: "default"
          }
        ]
      );

    } catch (err: any) {
      Alert.alert(
        "❌ Gagal",
        err.message || "Terjadi kesalahan saat menyimpan data.",
        [{ text: "Coba Lagi", style: "destructive" }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Tampilan jika izin kamera belum diberikan
  if (!permission?.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.infoText}>Aplikasi membutuhkan izin kamera</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.text}>BERI IZIN KAMERA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {/* Tombol dengan Feedback Loading */}
          <TouchableOpacity 
            style={[styles.btn, loading && { opacity: 0.7 }]} 
            onPress={handleCaptureAndSave} 
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="white" />
                <Text style={[styles.text, { marginLeft: 10 }]}>MENYIMPAN...</Text>
              </View>
            ) : (
              <Text style={styles.text}>📸 AMBIL & SIMPAN</Text>
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' },
  buttonContainer: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    alignItems: 'center', 
    marginBottom: 60 
  },
  btn: { 
    backgroundColor: '#1f2937', 
    paddingVertical: 18, 
    paddingHorizontal: 30, 
    borderRadius: 30, 
    elevation: 5, // Shadow untuk Android
    shadowColor: '#000', // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    minWidth: 200,
    alignItems: 'center'
  },
  loadingRow: { flexDirection: 'row', alignItems: 'center' },
  text: { color: 'white', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
  infoText: { marginBottom: 20, fontSize: 16, color: '#374151' }
});