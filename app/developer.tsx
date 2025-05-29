import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Developer() {
  const navigation = useNavigation();
  return (
    <View>        
      <ImageBackground source={ require("../assets/images/background.png")}  style={{ height:'100%', width:'100%' }}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' size={28} color={"white"} />
          </TouchableOpacity>
          <View style={styles.authorSection}>
            <Text style={styles.title}>KenaliLamun</Text>
            <Text style={styles.subtitle}>2025</Text>
            <Text style={styles.subtitle}>Developed by:</Text>
            <View style={styles.containerImage}>
              <Image style={styles.fotodeveloper} source={require("../assets/images/developer_seagrass_id.jpg")} />
            </View>
            <Text style={styles.developerName}>Sahra Fatimah Yasir</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorSection: {
    opacity: 0.9,
    width: "80%",
    height: "70%",
    backgroundColor: "rgba(0, 128, 128, 0.7)",  // Menggunakan warna transparan untuk efek modern
    padding: 20,
    color: "white",
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontWeight: "bold",
    color: "white",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 5,
    textTransform: 'uppercase',  // Menambahkan efek teks kapital untuk kesan lebih kuat
    letterSpacing: 2,  // Memberikan jarak antar huruf
    fontFamily: 'Raleway_700Bold',
  },
  subtitle: {
    fontWeight: "500",
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 5,
  },
  developerName: {
    fontWeight: "600",
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 15,
    fontStyle: 'italic',  // Memberikan gaya huruf miring pada nama developer
  },
  fotodeveloper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 5,
    borderColor: 'white', // Memberikan border putih untuk foto
    marginVertical: 20,
    borderStyle: 'solid',
  },
  containerImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',  // Memberikan transparansi pada background tombol kembali
    borderRadius: 25,
    padding: 10,
    elevation: 6,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
