import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, Dimensions } from "react-native";
import styled from "styled-components/native";
import apiConfig from '../../api/axios';
import { Link as ExpoRouterLink } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function NewGroup() {
    const [sinonimosData, setSinonimosData] = useState<{ [key: string]: { sinonimos: string[] } }>({});
    const [searchQuery, setSearchQuery] = useState(''); // Estado para armazenar a busca
    const [filteredData, setFilteredData] = useState<string[]>([]); // Estado para armazenar os dados filtrados
  
    useEffect(() => {
        async function fetchSinonimos() {
            try {
                const response = await apiConfig.get('/sinonimos');
                setSinonimosData(response.data);
            } catch (error) {
                console.error('Erro ao buscar sinônimos:', error);
            }
        }
        fetchSinonimos();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = Object.keys(sinonimosData).filter(item => 
                // Verifica se a palavra principal ou qualquer sinônimo contém a pesquisa
                item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                sinonimosData[item]?.sinonimos?.some(sinonimo => sinonimo.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(Object.keys(sinonimosData)); // Mostra tudo se não houver busca
        }
    }, [searchQuery, sinonimosData]);

    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const numColumns = screenWidth > 768 ? 4 : screenWidth > 480 ? 4 : 1;

    return (
        <ContainerBody>
            <Container>
                <Title>Sinônimos</Title>
            </Container>
                
            <Inputizin 
                placeholder='Pesquisar'
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />

            <ContentContainer>
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <Card>
                            <CardTitle>{item}</CardTitle>
                            <SinonimosList>
                                {sinonimosData[item]?.sinonimos?.map((sinonimo, index) => (
                                    <SinonimoItem key={index}>{sinonimo}</SinonimoItem>
                                )) || (
                                    <SinonimoItem>Nenhum sinônimo disponível</SinonimoItem>
                                )}
                            </SinonimosList>
                        </Card>
                    )}
                    numColumns={3}
                    
                />
            </ContentContainer>

            <Footer>
                <ButtonContainer href='/(groups)'>
                    <Icone source={require('../../assets/botao-de-inicio.png')} />
                </ButtonContainer>
                <ButtonContainer1 onPress={() => navigation.goBack()}>
                    <Icone source={require('../../assets/back-button.png')} />
                </ButtonContainer1>
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
`;

const Container = styled.View`
    padding: 10px;
    align-items: center;
    margin-top: 30px;
`;

const Inputizin = styled.TextInput`
    font-size: 20px;
    background-color: #dcdcdc;
    width: 80%;
    max-width: 600px;
    height: 6%;
    border-radius: 30px;
    padding: 15px;
    margin-bottom: 20px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #18206f;
    margin-top: -30px;
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

const ButtonContainer1 = styled.TouchableOpacity`
    height: 80px;
    width: 80px;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    margin-left: 5px;
    margin-top: 20px;
    padding: 15px;
`;

const Card = styled.View`
    background-color: white;
    border-radius: 8px;
    margin: 10px;
    padding: 10px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    elevation: 5;

    min-width: 30%;
`;

const CardTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    color: #18206f;
`;

const SinonimosList = styled.View`
    margin-top: 10px;
    padding: 5px;
`;

const SinonimoItem = styled.Text`
    font-size: 16px;
    text-align: center;
    color: #555;
`;

const ContentContainer = styled.View`
    flex: 1;
    width: 100%;
   
  
    margin-bottom: 100px;
    padding-left: 15%;
    padding-right: 10%;
`;
