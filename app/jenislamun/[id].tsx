import { useFetchJenisLamunDetail } from '@/service/useFetch';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function JenisLamunDetails() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const {
    data: detailsLamun,
    loading: detailsLamunLoading,
    error: detailsLamunError,
  } = useFetchJenisLamunDetail(id as string);

  const imageUrlDaun = `http://195.200.15.181:5005${detailsLamun?.imgSRCDaun}`;
  

  console.log(imageUrlDaun);
  
  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.backgroundImage}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      {detailsLamunLoading ? (
        <ActivityIndicator
          size="large"
          color="#fff"
          style={styles.loader}
        />
      ) : detailsLamunError ? (
        <Text style={styles.errorText}>Error: {detailsLamunError.message}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.title}>{detailsLamun?.nama}</Text>
            <Image
            source={{ uri: imageUrlDaun }}
            style={styles.image}
            resizeMode="cover"
          />
            <Text style={styles.list}>
                Kingdom :
                <Text style={styles.text}> {detailsLamun?.taksonomi.kingdom}</Text>
            </Text>
            <Text style={styles.list}>
                Division :
                <Text style={styles.text}> {detailsLamun?.taksonomi.division}</Text>
            </Text>
            <Text style={styles.list}>
                Class :
                <Text style={styles.text}> {detailsLamun?.taksonomi.class}</Text>
            </Text>
            <Text style={styles.list}>
                Order :
                <Text style={styles.text}> {detailsLamun?.taksonomi.order}</Text>
            </Text>
            <Text style={styles.list}>
                Family :
                <Text style={styles.text}> {detailsLamun?.taksonomi.family}</Text>
            </Text>
            <Text style={styles.list}>
                Genus :
                <Text style={styles.text}> {detailsLamun?.taksonomi.genus}</Text>
            </Text>
            <Text style={styles.list}>
                Species :
                <Text style={styles.text}> {detailsLamun?.taksonomi.species}</Text>
            </Text>
            <Text style={styles.list}>
                Daun :
                <Text style={styles.text}> {detailsLamun?.morfologi.daun}</Text>
            </Text>
            <Text style={styles.list}>
                Batang :
                <Text style={styles.text}> {detailsLamun?.morfologi.batang}</Text>
            </Text>
            <Text style={styles.list}>
                Rimpang :
                <Text style={styles.text}> {detailsLamun?.morfologi.rimpang}</Text>
            </Text>
            <Text style={styles.list}>
                Habitat :
                <Text style={styles.text}> {detailsLamun?.morfologi.habitat}</Text>
            </Text>
            
          </View>
          
        </ScrollView>
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
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 6,
  },
  loader: {
    marginTop: 80,
    alignSelf: 'center',
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 80,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 80,
    
  },
  card: {
    backgroundColor:'rgba(255, 255, 255, 0.7)',
    paddingHorizontal:10,
    paddingVertical:15,
    borderRadius:10
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign:"center"
  },
  list :{
    marginVertical:5,
    color: '#333',
    fontWeight: "500",
    textAlign:"justify"
  },
  text: {
    fontSize: 16,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
    fontWeight: "400"
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginVertical: 15,
  },
});
