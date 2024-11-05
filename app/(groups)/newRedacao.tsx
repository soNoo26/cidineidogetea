import React, { useEffect, useState } from 'react';
import { Alert, View, Text, TouchableOpacity, FlatList, Dimensions } from "react-native";
import styled from "styled-components/native";
import { useRouter } from 'expo-router';
import apiConfig from '../../api/axios';
import { Link as ExpoRouterLink } from 'expo-router';

export type Modelos = {
    id: number,
    titulo: string,
    imagem: string,
    corpo_redacao: string
};

export default function NewGroup() {
    const [modelos, setModelos] = useState<Modelos[]>([]);
    const router = useRouter();
    const { width } = Dimensions.get('window');
    const numColumns = width > 768 ? 4 : width > 480 ? 2 : 1; // Define o número de colunas conforme a largura da tela

    const handleModeloClick = (modelo: Modelos) => {  
        router.push({
            pathname: './editmodelo',
            params: { modeloTexto: modelo.corpo_redacao, modeloTitulo: modelo.titulo }
        });
    };

    useEffect(() => {
        async function fetchModelos() {
            try {
                const response = await apiConfig.get('/modelos');
                setModelos(response.data);
            } catch (error) {
                console.error('Erro ao buscar modelos de redação:', error);
            }
        }

        fetchModelos();
    }, []);

    return (
        <ContainerBody>
            <Container>
                <Title>Escolha um Modelo</Title>
            </Container>

            <Div>
                <ButtonNovo href='./criarredacao'>
                    <ButtonText>Criar a Partir do Zero</ButtonText>
                </ButtonNovo>
            </Div>

            <ContentContainer>
                <FlatList
                    data={modelos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleModeloClick(item)}>
                            <Card>
                                <Imagem source={{ uri: item.imagem }} />
                                <CardTitle>{item.titulo}</CardTitle>
                            </Card>
                        </TouchableOpacity>
                    )}
                    numColumns={numColumns}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                />
            </ContentContainer>

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
        </ContainerBody>
    );
}

// Estilos

const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    align-items: center;
`;

const Container = styled.View`
    padding: 10px;
    align-items: center;
    margin-top: 90px;
`;

const Div = styled.View`
    padding: 20px;
    align-items: center;
    width: 100%;
    margin-top: -20px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #18206f;
    margin-top: -50px;
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

const ButtonNovo = styled(ExpoRouterLink)`
    height: 60px;
    width: 80%;
    border-radius: 8px;
    background-color: #18206f;
    padding-top: 14px;
    text-align: center;
`;

const ButtonText = styled.Text`
    color: white;
    font-size: 20px;
    font-weight: 700;
`;

const Card = styled.View`
    background-color: white;
    border-radius: 8px;
    margin: 10px;
    padding: 20px;
    width: ${props => props.theme.width > 480 ? '45%' : '90%'};
    max-width: 200px;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Imagem = styled.Image`
    width: 100px;
    height: 120px;
    border-radius: 8px;
`;

const CardTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
    text-align: center;
    color: #18206f;
`;

const ContentContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom: 100px;
`;
