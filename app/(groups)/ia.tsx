import React, { useState } from 'react';
import { View, TextInput, Text, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import axios from 'axios';
import styled from "styled-components/native";
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Link as ExpoRouterLink } from 'expo-router';

const ArgumentScreen = () => {
  const [topic, setTopic] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const router = useRouter();
  const navigation = useNavigation();

  const handleSendTopic = async () => {
    if (!topic) {
      alert('Por favor, insira um tema.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://192.168.1.56:3000/argumento', { tema: topic });
      setResponse(res.data);
    } catch (error) {
      setResponse('Erro ao gerar redação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerBody>
      <View style={[styles.container, { width: width > 768 ? '50%' : '40%', alignSelf: 'center'}]}>
        <Text style={[styles.label, { fontSize: width > 768 ? 24 : 18,  }]}>
          Insira o tema da redação:
        </Text>
        <TextInput
          style={[styles.input, { width: width > 768 ? '80%' : '100%',}]}
          placeholder="Digite o tema aqui..."
          value={topic}
          onChangeText={setTopic}
        />
        <TouchableOpacity 
          style={[styles.customButton, loading && styles.buttonDisabled]} 
          onPress={handleSendTopic} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Gerando...' : 'Gerar Redação'}</Text>
        </TouchableOpacity>

        <ScrollView style={styles.responseContainer}>
          <Text style={styles.responseText}>{response}</Text>
        </ScrollView>
      </View>

      <Footer>
                <ButtonContainer href='/newRedacao'>
                    <Icone source={require('../../assets/mais.png')} /> 
                </ButtonContainer>
                <ButtonContainer href='/sinonimos'>
                    <Icone source={require('../../assets/editor-de-texto.png')} /> 
                </ButtonContainer>
                <ButtonContainer href='/ia'>
                    <Icone source={require('../../assets/ai.png')} /> 
                </ButtonContainer>
            </Footer>
    </ContainerBody>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f2f2f2',
  },
  label: {
    fontSize: 24,
    marginBottom: 10,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 20,
    marginLeft: 50,
  },
  customButton: {
    backgroundColor: '#18206f',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  responseContainer: {
    marginTop: 20,
    maxHeight: 400,
  },
  responseText: {
    fontSize: 16,
    color: '#000',
  },
});

const ContainerBody = styled.View`
  flex: 1;
  background-color: #F2F2F2;
  align-items: center;
  padding-top: 10px;
`;

const Footer = styled.View`
    width: 4vw;
    position: absolute;
    bottom: 0;
    left: 20;
    flex-direction: column;
    justify-content: space-around;
    background-color: #18206f;
    align-items: center;
    height: 90vh;
    border-radius: 10px;
    padding: 10px 0;
    margin-block-end: 28px;
    
    @media (max-width: 768px) {
        width: 20vw;
        height: 80vh;
    }

    @media (max-width: 480px) {
        width: 25vw;
        height: 70vh;
    }
`;

const ButtonContainer = styled(ExpoRouterLink)`
    height: 80px;
    width: 80px;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
    margin-top: 20px;
    padding: 15px;
`;

const Icone = styled.Image`
    max-width: 30px;
    max-height: 30px;
    width: 100%;
    height: 100%;
`;


const ButtonContainer1 = styled.TouchableOpacity`
  height: 60px;
  width: 60px;
  align-items: center;
  border-radius: 8px;
  justify-content: center;
  margin-top: 20px;
  padding: 10px;
`;

export default ArgumentScreen;
