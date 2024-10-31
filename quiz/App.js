import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button, Image, TouchableOpacity, ImageBackground,ScrollView} from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const PilhasTelas = createNativeStackNavigator()

function TelaInicial({ route, navigation }) {
    const [latitude, setLatitude] = useState(0.0)
    const [longitude, setLongitude] = useState(0.0)
    const [altitude, setAltitude] = useState(0.0)
    const [pais, setPais] = useState("")
    useEffect(() => {
        var buscarPais = async (latitude, longitude) => {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
            console.log(url)
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'YourAppName/1.0'
                    }
                });
                const address = response.data.address;

                if (address && address.country) {
                    return address.country; // Retorna o nome do país
                }
            } catch (error) {
                console.error(error);
            }
            return null;
        }
        var buscarCoordendadas = async () => {
        };

        const buscarCoordenadas = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Sem premissão');
                console.error('Sem permissão');
                return;
            }
            let location = await Location.getCurrentPositionAsync({})
            let location = await Location.getCurrentPositionAsync({});
            const lat = location.coords.latitude;
            const long = location.coords.longitude;
            const alt = location.coords.altitude;
            setLatitude(lat);
            setLongitude(long);
            setAltitude(alt);
            setPais(await buscarPais(lat, long))
        }
        buscarCoordendadas()
    }, [])
            setPais(await buscarPais(lat, long));
        };
        
        buscarCoordenadas();
    }, []);

    return (
        <ImageBackground
            source={{ uri: 'https://www.bing.com/images/create/criar-uma-imagem-com-vc3a1rias-bandeiras-de-pac3adses/1-6723cc66cc2246d59dd9b59a86807c0f?id=E6ps9spMDcSzhUbwGWsEpw%3d%3d&view=detailv2&idpp=genimg&thId=OIG4.28k16fiW7VzKYikmhsDv&skey=4MPIyCbLw4Dqq4CQuYNgDcegn8X_wZG2uvyJvvYKaPA&FORM=GCRIDP&mode=overlay' }} // Substitua pela URL da sua imagem
            style={styles.backgroundInicial}
        >
            <View style={styles.containerInicial}>
                <Text style={styles.titleInicial}>Teste seus conhecimentos e descubra o quanto você sabe sobre o mundo!</Text>
                <Text style={styles.textoInicial}>{pais ? pais : "Carregando..."}</Text>
                <Button title="PERGUNTAS" color="#523C20" onPress={() => { navigation.navigate("VisualizarQuiz") }} />
            </View>
        </ImageBackground>
    );
}

function VisualizarQuiz({ route, navigation }) {
    const [respostasSelecionadas, setRespostasSelecionadas] = useState([null, null,null]);

    // Respostas corretas para cada pergunta
    const respostasCorretas = [
        '38 m', // Resposta correta para a primeira pergunta
        'A arara-azul', // Resposta correta para a segunda pergunta
        'Em tigelas'
    ];

    const respostaEscolhida = (resposta, index) => {
        const novasRespostas = [...respostasSelecionadas];
        if (novasRespostas[index] === null) { // Verifica se a resposta para essa pergunta ainda não foi selecionada
            novasRespostas[index] = resposta;
            setRespostasSelecionadas(novasRespostas);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Brasil</Text>
            {/* Primeira Pergunta */}
            <View style={styles.cardContainer}>
                <Text style={styles.pergunta}>Quantos metros têm a estátua mais famosa do Brasil?</Text>
                <Image style={styles.image} source={require('./assets/images/cristo-redentor.jpg')} />
                <View style={styles.alternativas}>
                    {['35 m', '38 m', '50 m', '46 m'].map((resposta, index) => (
                        <TouchableOpacity
                            key={resposta}
                            style={[
                                styles.cardContainer2,
                                respostasSelecionadas[0] === resposta && { backgroundColor: resposta === respostasCorretas[0] ? 'green' : 'red' },
                            ]}
                            onPress={() => respostaEscolhida(resposta, 0)}
                            disabled={!!respostasSelecionadas[0]} // Desabilita o TouchableOpacity após uma seleção
                        >
                            <Text style={styles.alternativa}>{resposta}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {/* Segunda Pergunta */}
            <View style={styles.cardContainer}>
                <Text style={styles.pergunta}>Qual animal é considerado o símbolo nacional do Brasil?</Text>
                <Image style={styles.image} source={require('./assets/images/animais.jpg')} />
                <View style={styles.alternativas}>
                    {['O lobo-guará', 'O tamanduá-bandeira', 'O jaguar', 'A arara-azul'].map((resposta, index) => (
                        <TouchableOpacity
                            key={resposta}
                            style={[
                                styles.cardContainer2,
                                respostasSelecionadas[1] === resposta && { backgroundColor: resposta === respostasCorretas[1] ? 'green' : 'red' },
                            ]}
                            onPress={() => respostaEscolhida(resposta, 1)}
                            disabled={!!respostasSelecionadas[1]} // Desabilita o TouchableOpacity após uma seleção
                        >
                            <Text style={styles.alternativa}>{resposta}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {/* Terceira Pergunta */}
            <View style={styles.cardContainer}>
                <Text style={styles.pergunta}>O açaí é uma fruta típica da região amazônica do Brasil, conhecida por seu sabor e benefícios nutricionais. Qual é a forma mais comum de consumo do açaí nas regiões do Norte do Brasil?</Text>
                <Image style={styles.image} source={require('./assets/images/acai.jpg')} />
                <View style={styles.alternativas}>
                    {['Em sucos', 'Em sorvetes', 'Em tigelas', 'Em smoothies'].map((resposta, index) => (
                        <TouchableOpacity
                            key={resposta}
                            style={[
                                styles.cardContainer2,
                                respostasSelecionadas[2] === resposta && { backgroundColor: resposta === respostasCorretas[2] ? 'green' : 'red' },
                            ]}
                            onPress={() => respostaEscolhida(resposta, 2)}
                            disabled={!!respostasSelecionadas[2]} // Desabilita o TouchableOpacity após uma seleção
                        >
                            <Text style={styles.alternativa}>{resposta}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <Button
                title="Finalizar QUIZ"
                color="#523C20"
                onPress={() => navigation.navigate("VisualizarResultado")}
                disabled={!respostasSelecionadas[0] || !respostasSelecionadas[1]} // Desabilita o botão até que ambas as respostas sejam selecionadas
            />
        </ScrollView>
    );
}

function VisualizarResultado({ route, navigation }) {
    const { resultado } = route.params; // Pegando os resultados passados

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resultado do Quiz</Text>
            <Text style={styles.resultado}>
                Você selecionou: <Text style={resultado.correta ? styles.correto : styles.incorreto}>{resultado.respostaSelecionada}</Text>
            </Text>
            <Text style={styles.resultado}>
                Resultado: <Text style={resultado.correta ? styles.correto : styles.incorreto}>{resultado.correta ? 'Correto!' : 'Incorreto!'}</Text>
            </Text>
            <Button 
                title="Voltar" 
                color="#523C20" 
                onPress={() => navigation.navigate("TelaInicial")} 
            />
        </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <PilhasTelas.Navigator>
                <PilhasTelas.Screen
                    name="TelaInicial"
                    component={TelaInicial}
                    options={{ title: "Home" }}
                ></PilhasTelas.Screen>
                <PilhasTelas.Screen
                    name="VisualizarQuiz"
                    component={VisualizarQuiz}
                    options={{ title: "Quiz" }}
                ></PilhasTelas.Screen>
                <PilhasTelas.Screen
                    name="VisualizarResultado"
                    component={VisualizarResultado}
                    options={{ title: "Resultado" }}
                ></PilhasTelas.Screen>
            </PilhasTelas.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign:'center'
    },
    cardContainer: {
        marginBottom: 20,
    },
    pergunta: {
        fontSize: 18,
        marginBottom: 10,
        textAlign:'center'
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    alternativas: {
        marginBottom: 20,
    },
    cardContainer2: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    alternativa: {
        fontSize: 16,
    },
    resultado: {
        fontSize: 18,
        marginVertical: 10,
    },
    correto: {
        color: 'green',
        fontWeight: 'bold',
    },
    incorreto: {
        color: 'red',
        fontWeight: 'bold',
    },
    backgroundInicial: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerInicial: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo semi-transparente para melhor legibilidade
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    titleInicial: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    textoInicial: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
});