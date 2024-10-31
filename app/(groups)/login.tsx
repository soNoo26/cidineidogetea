import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const telaLogin = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cima}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/fundologin.png')}
            style={styles.logo}
          />
        </View>
      </View>
      <View style={styles.baixo}>
        <Text style={styles.title}>A Redação</Text>
        <Text style={styles.subtitle}>faça o seu login</Text>
        <TouchableOpacity style={styles.botaogoogle}>
          <FontAwesome name="google" size={36} color="#f5f5f5" />
          <Text style={styles.botaogoogletexto}>Continuar com o Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  cima: {
    flex: 1,
    backgroundColor: '#18206f',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,  
    borderBottomRightRadius: 20, 
  },

  logoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
    overflow: 'hidden',
  },

  logo: {
    width: 300,
    height: 300,
  },

  baixo: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#18206f',
    marginBottom: 10,
    marginTop: -90,
  },

  subtitle: {
    fontSize: 20,
    color: '#8f8e8e',
    marginBottom: 40,
  },

  botaogoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A5A8C7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 42,
    width: 340,
    justifyContent: 'center',
  },

  botaogoogletexto: {
    fontSize: 20,
    color: '#18206f',
    marginLeft: 10,
    padding: 7,
  },
});

export default telaLogin;