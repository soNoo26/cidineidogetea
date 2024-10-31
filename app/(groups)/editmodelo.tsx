import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import Input from '@/components/Input'; // Verifique se o caminho está correto
import InputRedacao from '@/components/InputRedacao'; // Verifique se o caminho está correto
import { useRouter, useLocalSearchParams, Link as ExpoRouterLink } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Redacao {
    id: string;
    titulo: string;
    texto: string;
}

export default function NovoModelo() {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [height, setHeight] = useState(30);
    const [isEditing, setIsEditing] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [texto, setTexto] = useState('');
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        const initialTitulo = Array.isArray(params.modeloTitulo) ? params.modeloTitulo[0] : params.modeloTitulo || '';
        const initialTexto = Array.isArray(params.modeloTexto) ? params.modeloTexto[0] : params.modeloTexto || '';
        setTitulo(initialTitulo);
        setTexto(initialTexto);
    }, []);

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

    const handleTextChange = (text: string) => {
        if (text.length <= 2000) {
            setTexto(text);
        }
        if (text.length === 2000) {
            Alert.alert('Atenção', 'Você atingiu 2000 caracteres! Aproximadamente 30 linhas');
        }
    };

    const handleTituloChange = (newTitulo: string) => {
        setTitulo(newTitulo);
    };

    const generateUniqueId = () => {
        return Math.random().toString(36).substr(2, 9); // Gera uma string aleatória de 9 caracteres
    };

    const saveToCache = async () => {
        try {
            const existingRedacoes = await AsyncStorage.getItem('redacoes');
            const parsedRedacoes: Redacao[] = existingRedacoes ? JSON.parse(existingRedacoes) : [];
            
            const novaRedacao: Redacao = {
                id: generateUniqueId(),
                titulo,
                texto
            };

            const updatedRedacoes = [...parsedRedacoes, novaRedacao];
            await AsyncStorage.setItem('redacoes', JSON.stringify(updatedRedacoes));
            
            Alert.alert('Salvo', 'Sua redação foi salva com sucesso!');
            router.push('/'); // Volte para a tela inicial
        }
        catch (erro) {
            console.log('Erro ao salvar a redação', erro);
        }
    };

    const handleEditClick = () => {
        if (isEditing) {
            saveToCache();
        }
        setIsEditing(!isEditing);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ContainerBody>
                <HeaderContainer>
                    <TituloTextoContainer>
                        {isEditing ? (
                            <Input
                                placeholder="Título"
                                value={titulo}
                                onChangeText={handleTituloChange}
                                style={{ flex: 1, fontSize: 24, fontWeight: 'bold', color: '#18206f' }}
                            />
                        ) : (
                            <TituloTexto>{titulo || 'Sem título'}</TituloTexto>
                        )}
                    </TituloTextoContainer>

                    <BotaoContainer>
                        <Pressable style={estilo.botaosalvar} onPress={handleEditClick}>
                            <Text style={{ color: '#fff' }}>{isEditing ? 'Salvar' : 'Editar'}</Text>
                        </Pressable>
                    </BotaoContainer>
                </HeaderContainer>

                <ContentContainer>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }} style={{ flex: 1 }}>
                    <Container>
                        {isEditing ? (
                            <InputRedacao
                                placeholder="Escreva sua redação..."
                                multiline={true}
                                style={{ height: height, borderWidth: 1, padding: 10 }}
                                onChangeText={handleTextChange}
                                value={texto}
                                onContentSizeChange={(event) => {
                                    setHeight(event.nativeEvent.contentSize.height);
                                }}
                            />
                        ) : (
                            <Texto>{texto || 'Escreva sua redação...'}</Texto>
                        )}
                    </Container>
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
    margin-top:2px;
`;

const HeaderContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background-color: #F5F5F5;
    margin-top: 40px;
`;

const TituloTextoContainer = styled.View`
    flex: 1; 
    margin-right: 50px;
    margin-left: 8rem;
`;

const ContentContainer = styled.View`
    flex: 1;
    padding: 1px;
    margin-block-end: 2%;
`;

const BotaoContainer = styled.View`
    align-items: center;
    justify-content: center;
`;

const TituloTexto = styled.Text`
    font-size: 27px;
    font-weight: bold;
    color: #18206f;
    flex-wrap: wrap; 
`;

const Container = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    padding: 16px;
    margin-left: 7%;
    margin-right: 2%;
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

const Texto = styled.Text`
    font-size: 18px;
    padding: 10px;
    border-width: 1px;
    border-color: #ccc;
    border-radius: 10px;
    background-color: #fff;

`;