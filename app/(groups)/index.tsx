import React, { useEffect, useState } from 'react';
import styled from "styled-components/native";
import { View, Text, Pressable, ScrollView, Alert, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Link as ExpoRouterLink } from 'expo-router';

interface Redacao {
    id: string;
    titulo: string;
    texto: string;
}

export default function Home() {
    const [redacoes, setRedacoes] = useState<Redacao[]>([]);
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            loadFromCache();
        }, [])
    );

    const loadFromCache = async () => {
        try {
            const savedRedacoes = await AsyncStorage.getItem('redacoes');
            let parsedRedacoes: Redacao[] = savedRedacoes ? JSON.parse(savedRedacoes) : [];
            parsedRedacoes = parsedRedacoes.reverse();
            setRedacoes(parsedRedacoes);
        } catch (error) {
            console.error('Erro ao carregar do cache:', error);
        }
    };

    const removeRedacao = async (id: string) => {
        try {
            const existingRedacoes = await AsyncStorage.getItem('redacoes');
            const parsedRedacoes: Redacao[] = existingRedacoes ? JSON.parse(existingRedacoes) : [];

            const updatedRedacoes = parsedRedacoes.filter(redacao => redacao.id !== id);
            await AsyncStorage.setItem('redacoes', JSON.stringify(updatedRedacoes));

            Alert.alert('Excluído', 'Sua redação foi removida com sucesso!');
            loadFromCache(); 
        } catch (error) {
            console.error('Erro ao remover no cache:', error);
        }
    };

    const handleCardPress = (redacao: Redacao) => {
        router.push({
            pathname: '/visualizacao',
            params: {
                id: redacao.id,
                titulo: redacao.titulo,
                texto: redacao.texto
            }
        });
    };

    const downloadFile = async (titulo: string, texto: string) => {
        try {
            if (Platform.OS === 'web') {
                const blob = new Blob([texto], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${titulo}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                Alert.alert('Sucesso', 'Arquivo baixado com sucesso.');
            } else {
                const fileUri = FileSystem.documentDirectory + `${titulo}.txt`;
                await FileSystem.writeAsStringAsync(fileUri, texto, { encoding: FileSystem.EncodingType.UTF8 });
                await Sharing.shareAsync(fileUri);
                Alert.alert('Sucesso', 'Arquivo baixado com sucesso.');
            }
        } catch (error) {
            console.error('Erro ao baixar o arquivo:', error);
            Alert.alert('Erro', 'Não foi possível baixar o arquivo.');
        }
    };

    const renderRows = () => {
        const rows = [];
        const columnsPerRow = 2;

        for (let i = 0; i < redacoes.length; i += columnsPerRow) {
            const rowItems = redacoes.slice(i, i + columnsPerRow);
            rows.push(
                <Row key={i}>
                    {rowItems.map((redacao) => (
                        <Card key={redacao.id}>
                            <Pressable onPress={() => handleCardPress(redacao)} style={{ flex: 1 }}  >
                                <CardTitle>{redacao.titulo || 'Sem título'}</CardTitle>
                                <CardText numberOfLines={3}>{redacao.texto || 'Sem conteúdo disponível.'}</CardText>
                            </Pressable>
<IconContainer>
    <DownloadButton onPress={() => downloadFile(redacao.titulo, redacao.texto)}>
        <MaterialIcons name="file-download" size={24} color="#18206f" />
    </DownloadButton>
    <RemoveButton onPress={() => removeRedacao(redacao.id)}>
        <MaterialIcons name="delete" size={24} color="#18206f" />
    </RemoveButton>
</IconContainer>
                        </Card>
                    ))}
                </Row>
            );
        }
        return rows;
    };

    return (
        <ContainerBody>
            <Container>
                <Title>
                    <TitleTextMinhas>MINHAS</TitleTextMinhas>
                    <TitleTextRedacoes>REDAÇÕES</TitleTextRedacoes>
                </Title>
                <ScrollView>{redacoes.length > 0 ? renderRows() : <EmptyText>Nenhuma redação salva.</EmptyText>}</ScrollView>
            </Container>

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
}

const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    align-items: center;
    padding-left: 10%;
    padding-right: 5%;
    padding-block-end: 2%;
`;

const Row = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
`;

const Title = styled.View`
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const TitleText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #18206f;
`;

const TitleTextMinhas = styled(TitleText)`
    margin-bottom: 5px;
`;

const TitleTextRedacoes = styled(TitleText)``;

const Card = styled.View`
    background-color: #fff;
    border-radius: 10px;
    flex: 1;
    min-height: 150px;
    padding: 10px;
    margin: 5px;
`;

const CardTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #18206f;
    margin-bottom: 10px;
`;

const CardText = styled.Text`
    font-size: 16px;
    color: #333;
    width: 90%;
`;

const EmptyText = styled.Text`
    font-size: 18px;
    color: #999;
    margin-top: 50%;
    margin-right: 20%;
    margin-left: -10%;
`;

const Container = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    padding: 16px;
    align-items: start;
    margin-top: 50px;
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



const IconContainer = styled.View`
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 10px;
    margin-right: 1%;
`;

const DownloadButton = styled.Pressable`
    margin-right: 8px; /* Espaço entre os botões */
`;

const RemoveButton = styled.Pressable``;