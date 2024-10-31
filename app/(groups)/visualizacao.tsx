import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Alert, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styled from 'styled-components/native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputRedacao from '@/components/InputRedacao';
import Input from '@/components/Input';
import { useRouter, useLocalSearchParams,  Link as ExpoRouterLink  } from 'expo-router';
import { ScrollView } from 'react-native';

interface Redacao {
    id: string;
    titulo: string;
    texto: string;
}

export default function Visualizacao() {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [texto, setTexto] = useState('');
    const [height, setHeight] = useState(30);
    const params = useLocalSearchParams();
    const router = useRouter();
    
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);
    useEffect(() => {
        const initialTitulo = params.titulo as string || '';
        const initialTexto = params.texto as string || '';
        setTitulo(initialTitulo);
        setTexto(initialTexto);
    }, []);

    const handleTextChange = (text: string) => {
        if (text.length <= 2000) {
            setTexto(text);
        }
        if (text.length === 2000) {
            Alert.alert('Atenção', 'Você atingiu 2000 caracteres! Aproximadamente 30 linhas');
        }
    };

    const saveToCache = async () => {
        try {
            const existingRedacoes = await AsyncStorage.getItem('redacoes');
            const parsedRedacoes: Redacao[] = existingRedacoes ? JSON.parse(existingRedacoes) : [];
            const { id } = params; // Supondo que 'id' esteja sendo passado nos parâmetros
    
            const updatedRedacoes = parsedRedacoes.map(redacao => {
                if (redacao.id === id) {
                    return { ...redacao, titulo, texto };
                }
                return redacao;
            });
    
            await AsyncStorage.setItem('redacoes', JSON.stringify(updatedRedacoes));
            
            Alert.alert('Salvo', 'Sua redação foi salva com sucesso!');
            setIsEditing(false);
            router.push('/(groups)');
        } catch (error) {
            console.error('Erro ao salvar no cache:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            
                <ContainerBody>
                    <HeaderContainer>
                        {isEditing ? (
                            <Input
                                placeholder="Título"
                                value={titulo}
                                onChangeText={setTitulo}
                                style={{ flex: 1, marginRight: 10, fontSize:24, marginTop:-21, flexWrap:'wrap', }}
                            />
                        ) : (
                            <TituloTextoContainer>
                                <TituloTexto>{titulo || 'Sem título'}</TituloTexto>
                            </TituloTextoContainer>
                        )}



                        <Pressable
                            style={estilo.botaosalvar}
                            
                            onPress={() => {
                                if (isEditing) {
                                    saveToCache();
                                } else {
                                    setIsEditing(true);
                                }
                            }}
                        >
                            <Text style={{ color: '#fff' }}>{isEditing ? 'Salvar' : 'Editar'}</Text>
                        </Pressable>
                    </HeaderContainer>

                    <ContentContainer>
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 100 }} style={{ flex: 1 }}
                        >
                            {isEditing ? (
                                <InputRedacao
                                    placeholder="Escreva sua redação..."
                                    multiline={true}
                                    style={{ borderWidth: 1, padding: 10 }}
                                    onChangeText={handleTextChange}
                                    value={texto}
                                    onContentSizeChange={(event) => {
                                        const newHeight = event.nativeEvent.contentSize.height;
                                        if (Math.abs(height - newHeight) > 1) {
                                            setHeight(newHeight);
                                        }
                                    }}
                                />
                            ) : (
                                <Texto>{texto || 'Escreva sua redação...'}</Texto>
                            )}
                        </ScrollView>
                    </ContentContainer>

                    {!keyboardVisible && (
                    <Footer>
                        <ButtonContainer href='/(groups)'>
                            <Icone source={require('../../assets/botao-de-inicio.png')} /> 
                        </ButtonContainer>
                        <ButtonContainer href='/sinonimos'>
                            <Icone source={require('../../assets/editor-de-texto.png')} /> 
                        </ButtonContainer>
                        <ButtonContainer href='/ia'>
                            <Icone source={require('../../assets/ai.png')} /> 
                        </ButtonContainer>
                    </Footer>
                )}
                </ContainerBody>
        </KeyboardAvoidingView>
    );
}

const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    justify-content: space-between;
`;

const ContentContainer = styled.View`
    flex: 1;
    padding: 16px;
    margin-left: 6%;
    margin-right: 4%;
`;

const HeaderContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    background-color: #F5F5F5;
    margin-top: 50px;
    margin-left: 7%;
`;

const TituloTextoContainer = styled.View`
    flex: 1; 
    margin-right: 2%;
    margin-left: 1%;

`;

const Footer = styled.View`
    width: 4vw; /* Define a largura relativa à viewport */
    position: absolute;
    bottom: 0;
    left: 20;
    flex-direction: column; /* Mantém a direção em coluna */
    justify-content: space-around;
    background-color: #18206f;
    align-items: center;
    height: 90vh; /* Ajusta a altura conforme o tamanho da tela */
    border-radius: 10px;
    padding: 10px 0;
    margin-block-end: 28px;
    
    @media (max-width: 768px) { /* Para telas menores */
        width: 20vw; /* Ajuste para telas menores */
        height: 80vh; /* Ajusta a altura */
    }

    @media (max-width: 480px) { /* Para dispositivos móveis */
        width: 25vw; /* Aumenta um pouco a largura em dispositivos menores */
        height: 70vh; /* Ajusta altura para caber na tela */
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

const estilo = StyleSheet.create({
    botaosalvar: {
        backgroundColor: '#18206f',
        paddingBottom: 14,
        paddingTop: 14,
        width: 80,
        alignItems: 'center',
        borderRadius: 8,
    }
});

const TituloTexto = styled.Text`
    font-size: 27px;
    font-weight: bold;
    color: #18206f;
    flex-wrap: wrap;
    margin-left: 6%;
`;

const Texto = styled.Text`
    font-size: 18px;
    padding: 10px;
    border-width: 1px;
    border-color: #ccc;
    border-radius: 10px;
    background-color: #fff;
    margin-left: 6%;
    margin-right: 2%;
`;