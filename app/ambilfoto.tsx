import { useUploadImage } from '@/service/useUploadImage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';


export default function Ambilfoto() {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const { loading, error, uploadImage } = useUploadImage();
  const router = useRouter();
  const navigation = useNavigation();
  const [showRules, setShowRules] = useState(true);
  
const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin kamera ditolak');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedPhoto(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!capturedPhoto) return;

    try {
      const { result, fileUri } = await uploadImage(capturedPhoto);
      router.push({
        pathname: '/hasilidentifikasi',
        params: {
          detections: JSON.stringify(result.detections),
          imageUri: fileUri,
        },
      });
    } catch (err: any) {
      Alert.alert('Upload Gagal', err.message);
    }
  };
  return (
     <ImageBackground source={require('../assets/images/background.png')} style={styles.backgroundImage}>
     <Modal
          visible={showRules}
          animationType="slide"
          transparent={true}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 20,
              maxHeight: '80%',
              width: '90%',
            }}>
              <ScrollView>
                <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>Aturan Pengambilan Foto</Text>
                <Text style={{fontSize: 16, marginBottom: 10, textAlign:'justify'}}>
                  1. Pastikan gambar fokus dan objek jelas terlihat. {'\n'}
                  2. Gunakan pencahayaan yang cukup dan hindari bayangan.{'\n'}
                  3. Hindari gangguan latar belakang atau refleksi.{'\n'}
                  4. Ambil gambar saat lamun tidak bergerak dan stabil. {'\n'}
                  5. Hindari pencahayaan gelap atau objek lain yang mengganggu. {'\n'}
                  6. Gunakan sudut yang tepat agar objek terlihat jelas. {'\n'}
                  7. Saat ini KenaliLamun hanya dapat mengidentifikasi lamun jenis Cymodocea rotundata, Syringodium isoetifolium, dan Thalassia hemprichii.
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: 'lightseagreen',
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                  }}
                  onPress={() => setShowRules(false)}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Mengerti</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

     
     <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      {capturedPhoto ? (
  <View style={styles.previewContainer}>
    <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        onPress={handleUpload}
        style={[styles.actionButton, { backgroundColor: '#10b981' }]}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.actionButtonText}> Prediksi</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setCapturedPhoto(null)}
        style={[styles.actionButton, { backgroundColor: '#6b7280' }]}
      >
        <Text style={styles.actionButtonText}>Ambil Ulang</Text>
      </TouchableOpacity>
    </View>
  </View>
) : (
        <View style={styles.containerOperCamera}>
          <TouchableOpacity
            onPress={openCamera}
            style={styles.openCamera}
          >
            <Text style={styles.textOpenCamera}> Buka Kamera</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 6,
  },

  previewContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingTop: 80,
  paddingBottom: 30,
},

  previewImage: {
    width: '100%',
    height: '70%',
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  buttonWrapper: {
    width: '100%',
    gap: 12,
  },

  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },




  containerOperCamera :{
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  openCamera :{
      textAlign:'center',
      backgroundColor: 'lightseagreen',
      padding: 20,
      borderRadius: 10,
      width:'50%'
  },
  textOpenCamera :{
      color: 'white',
      textAlign:"center",
      fontSize:18,
      fontWeight:'500'
  }
})