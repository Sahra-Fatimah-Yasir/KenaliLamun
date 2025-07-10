import { useUploadImage } from '@/service/useUploadImage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert, Dimensions, Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

export default function Unggahgambar() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [enhancedBase64, setEnhancedBase64] = useState<string | null>(null);
  const { loading, error, uploadImage, enhanceImage } = useUploadImage();
  const router = useRouter();
  const navigation = useNavigation();
  const [showRules, setShowRules] = useState(true);

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin galeri ditolak');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);

      try {
        const { enhancedBase64 } = await enhanceImage(uri);
        setEnhancedBase64(enhancedBase64);
      } catch (e) {
        Alert.alert('Gagal enhance gambar');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    try {
      const { result, fileUri } = await uploadImage(selectedImage);
      router.push({
        pathname: '/hasilidentifikasi',
        params: {
          detections: JSON.stringify(result.detections),
          imageUri: fileUri,
          enhancedBase64: result.enhancedBase64,
        },
      });
    } catch (err: any) {
      Alert.alert('Upload Gagal', err.message);
    }
  };

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.backgroundImage}>
      <Modal visible={showRules} animationType="slide" transparent={true}>
        <View style={styles.modalWrapper}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Aturan Pengambilan Foto</Text>
              <Text style={styles.modalText}>
                1. Pastikan gambar fokus dan objek jelas terlihat. {'\n'}
                2. Gunakan pencahayaan yang cukup dan hindari bayangan.{'\n'}
                3. Hindari gangguan latar belakang atau refleksi.{'\n'}
                4. Ambil gambar saat lamun tidak bergerak dan stabil. {'\n'}
                5. Hindari pencahayaan gelap atau objek lain yang mengganggu. {'\n'}
                6. Gunakan sudut yang tepat agar objek terlihat jelas. {'\n'}
                7. Saat ini KenaliLamun hanya dapat mengidentifikasi lamun jenis Cymodocea rotundata, Syringodium isoetifolium, dan Thalassia hemprichii.
              </Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowRules(false)}>
                <Text style={styles.modalButtonText}>Mengerti</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {selectedImage ? (
        <View style={styles.previewContainer}>
          {enhancedBase64 ? (
            <Carousel
              loop
              width={Dimensions.get('window').width * 0.8}
              height={220}
              autoPlay={false}
              mode="parallax"
              data={[
                { label: 'Original', uri: selectedImage },
                { label: 'Enhanced', uri: `data:image/jpeg;base64,${enhancedBase64}` },
              ]}
              scrollAnimationDuration={500}
              renderItem={({ item }: { item: { label: string; uri: string } }) => (
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.compareLabel}>{item.label}</Text>
                  <Image source={{ uri: item.uri }} style={styles.previewImage} />
                </View>
              )}
            />
          ) : (
            <Text style={{ color: 'white', marginBottom: 12 }}>Sedang memproses gambar...</Text>
          )}

          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={handleUpload}
              style={[styles.actionButton, { backgroundColor: '#10b981' }]}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.actionButtonText}>Prediksi</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedImage(null);
                setEnhancedBase64(null);
              }}
              style={[styles.actionButton, { backgroundColor: '#6b7280' }]}
            >
              <Text style={styles.actionButtonText}>Pilih Ulang</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.containerOperCamera}>
          <TouchableOpacity onPress={pickImageFromGallery} style={styles.openCamera}>
            <Text style={styles.textOpenCamera}>Pilih dari Galeri</Text>
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
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
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
  containerOperCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openCamera: {
    textAlign: 'center',
    backgroundColor: 'lightseagreen',
    padding: 20,
    borderRadius: 10,
    width: '60%',
  },
  textOpenCamera: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  compareLabel: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 6,
    fontWeight: '600',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'justify',
  },
  modalButton: {
    backgroundColor: 'lightseagreen',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
