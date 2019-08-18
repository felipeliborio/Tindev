import React, { useEffect, useState } from 'react';
import { 
  Image,
  View, 
  SafeAreaView, 
  StatusBar, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';

import api from '../services/api';

import dislike from '../assets/dislike.png';
import like from '../assets/like.png';
import logo from '../assets/logo.png';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ navigation }) {
  const id = navigation.getParam('user');
  const [users, setUsers] = useState([]);
  const [matchDev, setMatchDev] = useState(null);
  useEffect(() => { 
    async function loadUsers() {
      const response = await api.get('/devs', { headers: { user: id } });
      setUsers(response.data);
    }

    loadUsers();
   }, [id]);
   
  useEffect(() => {
    const socket = io('http://192.168.0.100:3333', {
      query: { user: id },
    });

    socket.on('match', dev => {
      setMatchDev(dev);
    })
  }, [id]);

   async function handleLike() {
    const [user, ...rest] =  users;
    await api.post(`/devs/${user._id}/likes`, null, { headers: { user: id} } );
    setUsers(rest);
  }

  async function handleDislike() {
    const [user, ...rest] =  users;
    await api.post(`/devs/${user._id}/dislikes`, null, { headers: { user: id} } );
    setUsers(rest);
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
      barStyle = "light-content"
      backgroundColor = "#6f329a"
      networkActivityIndicatorVisible = {true}
      />
      <TouchableOpacity onPress={handleLogout}>
        <Image source={logo} style={styles.logo}/>  
      </TouchableOpacity>
      <View style={styles.cardsContainer}>
        {users.length === 0 ? 
        <Text style={styles.empty}>Acabou :(</Text>
        : (
        users.map((user, index) => (
          <View key={user._id} style={[styles.card, {zIndex: users.length - index}]}>
            <Image style={styles.avatar} source={{uri: user.avatar}}/>
            <View style={styles.footer}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
            </View>
          </View>
        ))
        )}
      </View>
      { users.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleDislike}>
            <Image source={dislike}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLike}>
            <Image source={like}/>
          </TouchableOpacity>
        </View>
      )}
      
      { matchDev && (
        <View style={[styles.matchContainer, {zIndex: users.length + 1}]}>
          <Image source={itsamatch} style={styles.itsamatch}/>
          <Image source={{uri: matchDev.avatar}} style={styles.matchAvatar}/>
          <Text style={styles.matchName}>{matchDev.name}</Text>
          <Text style={styles.matchBio}>{matchDev.bio}</Text>
          <TouchableOpacity onPress={() => setMatchDev(null)}>
            <Text style={styles.closeMatch}>FECHAR</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    flex: 1,
    height: 300,
  },
  bio: {
    fontSize: 14,
    color: '#ddd',
    marginTop: 5,
    lineHeight: 18,
  },
  button: {
    height: 50,
    width: 50,
    alignSelf: 'stretch',
    borderRadius: 25,
    backgroundColor: '#e9a22b',
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4, 
    shadowOffset: {
      width: 2,
      height: 4,
    }
  },
  buttonsContainer: {
    flexDirection: 'row', 
    marginBottom: 30, 
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#6f329a',
    borderWidth: 1,
    borderColor: '#60288a', 
    borderRadius: 8, 
    margin: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2, 
    shadowOffset: {
      width: 1,
      height: 2,
    }
  },
  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },
  closeMatch: {
    fontSize: 20,
    color: '#ffffffcc',
    textAlign: 'center',
    marginVertical: 30, 
    fontWeight: 'bold', 
  },
  container: {
    flex: 1,
    backgroundColor: '#38184b',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  empty: {
    alignSelf: 'center',
    color: '#bdfa4c',
    fontSize: 28,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#6f329a', 
    paddingHorizontal: 12, 
    paddingVertical: 15, 
  },
  itsamatch: {
    height: 60,
    resizeMode: 'contain',
  },
  logo: {
    marginTop: 40,
    marginBottom: 12,
  },
  matchAvatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 5,
    borderColor: '#fff',
    marginVertical: 30,
  }, 
  matchBio: {
    marginTop: 10,
    fontSize: 16,
    color: '#ffffffcc',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  matchContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 16, 
    fontWeight: 'bold',
    color: '#eeeeee',
  },
});
