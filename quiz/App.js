// Importações e configuração inicial
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const PilhasTelas = createNativeStackNavigator();

// Função para escolher o país
function escolherPais(navigation, pais) {
    if (pais === "Brasil") {
        navigation.navigate("VisualizarQuizBrasil");
    } else if (pais === "Россия") {
        navigation.navigate("VisualizarQuizRussia");
    } else if (pais === "日本") {
        navigation.navigate("VisualizarQuizJapao");
    } else {
        console.log(pais + " sem perguntas");
    }
}

// Tela Inicial
function TelaInicial({ route, navigation }) {
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [pais, setPais] = useState("");

    useEffect(() => {
        const buscarPais = async (latitude, longitude) => {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User -Agent': 'YourAppName/1.0'
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
        };

        const buscarCoordenadas = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Sem permissão');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            const lat = location.coords.latitude;
            const long = location.coords.longitude;
            setLatitude(lat);
            setLongitude(long);
            setPais(await buscarPais(lat, long));
        };

        buscarCoordenadas();
    }, []);

    return (
        <ImageBackground
            source={{ uri: 'https://th.bing.com/th/id/OIG4.28k16fiW7VzKYikmhsDv?pid=ImgGn' }}
            style={styles.backgroundInicial}
        >
            <View style={styles.containerInicial}>
                <Text style={styles.titleInicial}>Teste seus conhecimentos e descubra o quanto você sabe sobre o mundo!</Text>
                <Text style={styles.textoInicial}>{pais ? pais : "Carregando..."}</Text>
                <Button title="PERGUNTAS" color="#559988" onPress={() => { escolherPais(navigation, pais) }} />
            </View>
        </ImageBackground>
    );
}

// Perguntas do Brasil
function VisualizarQuizBrasil({ route, navigation }) {
    const [respostasSelecionadas, setRespostasSelecionadas] = useState([null, null, null, null]);

    // Respostas corretas e explicações
    const respostasCorretas = [
        '38 m',
        'A arara-azul',
        'Em tigelas',
        'Cataratas do Iguaçu'
    ];
    const explicacoes = [
        "A estátua do Cristo Redentor tem 38 metros de altura.",
        "A arara-azul é um símbolo nacional do Brasil.",
        "O açaí é comumente consumido em tigelas na região norte.",
        "As Cataratas do Iguaçu são uma das maiores atrações turísticas do Brasil."
    ];
    const respostaEscolhida = (resposta, index) => {
        const novasRespostas = [...respostasSelecionadas];
        if (novasRespostas[index] === null) { // Verifica se a resposta para essa pergunta ainda não foi selecionada
            novasRespostas[index] = resposta;
            setRespostasSelecionadas(novasRespostas);
        }
    };
    const finalizarQuizBr = () => {
        const resultados = respostasSelecionadas.map((resposta, index) => ({
            respostaSelecionada: resposta,
            correta: resposta === respostasCorretas[index],
            explicacao: resposta === respostasCorretas[index] ? null : explicacoes[index]
        }));
        navigation.navigate("VisualizarResultado", { resultados });
    };

    return (
        <ScrollView style={styles.container1}>
            <View style={styles.container}>
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
                {/* Quarta Pergunta */}
                <View style={styles.cardContainer}>
                    <Text style={styles.pergunta}>Quais dessas características naturais são consideradas um dos maiores do Brasil e atraem turistas do mundo inteiro?</Text>
                    <Image style={styles.image} source={require('./assets/images/agua-no-jalapao.jpg')} />
                    <View style={styles.alternativas}>
                        {['Encontro das Águas', 'Floresta Amazônica', 'Parque Nacional dos Lençóis Maranhenses', 'Cataratas do Iguaçu'].map((resposta, index) => (
                            <TouchableOpacity
                                key={resposta}
                                style={[
                                    styles.cardContainer2,
                                    respostasSelecionadas[3] === resposta && { backgroundColor: resposta === respostasCorretas[3] ? 'green' : 'red' },
                                ]}
                                onPress={() => respostaEscolhida(resposta, 3)}
                                disabled={!!respostasSelecionadas[3]} // Desabilita o TouchableOpacity após uma seleção
                            >
                                <Text style={styles.alternativa}>{resposta}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.botao}>
                    <Button
                        title="Finalizar QUIZ"
                        color="#a52a2a"
                        onPress={finalizarQuizBr}
                        disabled={!respostasSelecionadas[0] || !respostasSelecionadas[1] || !respostasSelecionadas[2] || !respostasSelecionadas[3]} // Desabilita o botão até que ambas as respostas sejam selecionadas
                    />
                </View>
            </View>
        </ScrollView>
    );
}

// Perguntas da Rússia
function VisualizarQuizRussia({ route, navigation }) {
    const [respostasSelecionadas, setRespostasSelecionadas] = useState([null, null, null, null]);
    const respostasCorretas = [
        'O Lago dos Cisnes',
        'Moscou',
        'Urso',
        'Matryoshka'
    ];
    const explicacoes = [
        "O Lago dos Cisnes é um balé clássico famoso.",
        "Moscou é a capital da Rússia.",
        "O urso é um símbolo nacional da Rússia.",
        "Matryoshka são as famosas bonecas russas."
    ];
    const respostaEscolhida = (resposta, index) => {
        const novasRespostas = [...respostasSelecionadas];
        if (novasRespostas[index] === null) {
            novasRespostas[index] = resposta;
            setRespostasSelecionadas(novasRespostas);
        }
    };
    const finalizarQuizRu = () => {
        const resultados = respostasSelecionadas.map((resposta, index) => ({
            respostaSelecionada: resposta,
            correta: resposta === respostasCorretas[index],
            explicacao: resposta === respostasCorretas[index] ? null : explicacoes[index]
        }));
        navigation.navigate("VisualizarResultado", { resultados });
    };

    return (
        <ScrollView style={styles.container1}>
            <View style={styles.container}>
                <Text style={styles.title}>Rússia</Text>
                {/* Primeira Pergunta */}
                <View style={styles.cardContainer}>
                    <Text style={styles.pergunta}>O balé é uma parte importante da cultura russa. Qual é o nome do balé clássico russo, composto por Pyotr Tchaikovsky, que conta a história de uma princesa transformada em um animal?</Text>
                    <Image style={styles.image} source={require('./assets/images/baleRusso.jpg')} />
                    <View style={styles.alternativas}>
                        {['Quebra-Nozes', 'Giselle', 'O Lago dos Cisnes', 'A Bela Adormecida'].map((resposta, index) => (
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
                    <Text style={styles.pergunta}>Qual é a capital da Rússia?</Text>
                    <Image style={styles.image} source={require('./assets/images/mapaRussia.jpg')} />
                    <View style={styles.alternativas}>
                        {['São Petersburgo', 'Moscou', 'Kazan', 'Novosibirsk'].map((resposta, index) => (
                            <TouchableOpacity
                                key={resposta}
                                style={[
                                    styles.cardContainer2,
                                    respostasSelecionadas[1] === resposta && { backgroundColor: resposta === respostasCorretas[1] ? 'green' : 'red' },
                                ]}
                                onPress={() => respostaEscolhida(resposta, 1)}
                                disabled={!!respostasSelecionadas[1]}
                            >
                                <Text style={styles.alternativa}>{resposta}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {/* Terceira Pergunta */}
                <View style={styles.cardContainer}>
                    <Text style={styles.pergunta}>Qual animal é conhecido como o símbolo nacional da Rússia?</Text>
                    <Image style={styles.image} source={require('./assets/images/animalRussia.jpg')} />
                    <View style={styles.alternativas}>
                        {['Águia', 'Lobo', 'Urso', 'Raposa'].map((resposta, index) => (
                            <TouchableOpacity
                                key={resposta}
                                style={[
                                    styles.cardContainer2,
                                    respostasSelecionadas[2] === resposta && { backgroundColor: resposta === respostasCorretas[2] ? 'green' : 'red' },
                                ]}
                                onPress={() => respostaEscolhida(resposta, 2)}
                                disabled={!!respostasSelecionadas[2]}
                            >
                                <Text style={styles.alternativa}>{resposta}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {/* Quarta Pergunta */}
                <View style={styles.cardContainer}>
                    <Text style={styles.pergunta}>As bonecas russas famosas por serem feitas de madeira e por se encaixam uma dentro da outra são conhecidas como?</Text>
                    <Image style={styles.image} source={require('./assets/images/boneca.jpg')} />
                    <View style={styles.alternativas}>
                        {['Matryoshka', 'Babushka', 'Troika', 'Ushanka'].map((resposta, index) => (
                            <TouchableOpacity
                                key={resposta}
                                style={[
                                    styles.cardContainer2,
                                    respostasSelecionadas[3] === resposta && { backgroundColor: resposta === respostasCorretas[3] ? 'green' : 'red' },
                                ]}
                                onPress={() => respostaEscolhida(resposta, 3)}
                                disabled={!!respostasSelecionadas[3]}
                            >
                                <Text style={styles.alternativa}>{resposta}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.botao}>
                    <Button
                        title="Finalizar QUIZ"
                        color="#a52a2a"
                        onPress={finalizarQuizRu}
                        disabled={!respostasSelecionadas[0] || !respostasSelecionadas[1] || !respostasSelecionadas[2] || !respostasSelecionadas[3]} // Desabilita o botão até que ambas as respostas sejam selecionadas
                    />
                </View>
            </View>
        </ScrollView>
    );
}

// Perguntas do Japão
function VisualizarQuizJapao({ route, navigation }) {
    const [respostasSelecionadas, setRespostasSelecionadas] = useState([null, null, null, null]);
    const respostasCorretas = [
        'Admirar as flores de cerejeira',
        'Tsuru (grou)',
        'Hiroshima e Nagasaki',
        'Em várias ocasiões formais '
    ];
    const explicacoes = [
        "Hanami é a prática de admirar as flores de cerejeira.",
        "Tsuru é um símbolo de paz no Japão.",
        "Hiroshima e Nagasaki foram devastadas por bombas nucleares.",
        "Kimonos são usados em várias ocasiões formais."
    ];
    const respostaEscolhida = (resposta, index) => {
        const novasRespostas = [...respostasSelecionadas];
        if (novasRespostas[index] === null) {
            novasRespostas[index] = resposta;
            setRespostasSelecionadas(novasRespostas);
        }
    };
    const finalizarQuizJa = () => {
        const resultados = respostasSelecionadas.map((resposta, index) => ({
            respostaSelecionada: resposta,
            correta: resposta === respostasCorretas[index],
            explicacao: resposta === respostasCorretas[index] ? null : explicacoes[index]
        }));
        navigation.navigate("VisualizarResultado", { resultados });
    };

    return (
        <ScrollView style={styles.container1}>
            <View style={styles.container}>
                <Text style={styles.title}>Japão</Text>
                {/* Primeira Pergunta */}
                <View style={styles.cardContainer}>
                    <Text style={styles.pergunta}>O Japão é conhecido pelo conceito de "hanami", uma tradição ligada à natureza e celebrada especialmente na primavera. O que as pessoas costumam fazer durante o hanami?</Text>
                    <Image style={styles.image} source={require('./assets/images/cerejeira.jpg')} />
                    <View style={styles.alternativas}>
                        {['Admirar as flores de cerejeira', 'Correr pelas montanhas', 'Plantar árvores', 'Meditar nas praias'].map((resposta, index) => (
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
                    <Text style={styles.pergunta}>O origami é uma arte japonesa de dobradura de papel. Qual figura é considerada um símbolo de paz e esperança e é uma das dobraduras mais conhecidas no origami?</Text>
                    <Image style={styles.image} source={require('./assets/images/Origami.jpg')} />
                    <View style={styles.alternativas}>
                        {['Tigre', 'Dragão', 'Tsuru (grou)', 'Golfinho'].map((resposta, index) => (
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
                    <Text style={styles.pergunta}>Durante a Segunda Guerra Mundial, duas cidades japonesas foram devastadas por bombas nucleares, um evento que marcou profundamente a história mundial. Quais foram essas duas cidades?</Text>
                    <Image style={styles.image} source={require('./assets/images/cidadeJp.jpg')} />
                    <View style={styles.alternativas}>
                        {['Tóquio e Osaka', 'Hiroshima e Nagasaki', 'Kyoto e Kobe', 'Yokohama e Fukuoka'].map((resposta, index) => (
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
                {/* Quarta Pergunta */}
                <View style={styles.cardContainer}>
                    <Text style={styles.pergunta}>O "kimono" é um traje tradicional japonês reconhecido mundialmente por sua beleza e significado cultural. Qual é a ocasião em que os japoneses costumam usar kimonos?</Text>
                    <Image style={styles.image} source={require('./assets/images/kimono.jpg')} />
                    <View style={styles.alternativas}>
                        {['Somente em casamentos', 'Apenas em festivais de verão', 'Em várias ocasiões formais ', 'Exclusivamente no Ano Novo'].map((resposta, index) => (
                            <TouchableOpacity
                                key={resposta}
                                style={[
                                    styles.cardContainer2,
                                    respostasSelecionadas[3] === resposta && { backgroundColor: resposta === respostasCorretas[3] ? 'green' : 'red' },
                                ]}
                                onPress={() => respostaEscolhida(resposta, 3)}
                                disabled={!!respostasSelecionadas[3]} // Desabilita o TouchableOpacity após uma seleção
                            >
                                <Text style={styles.alternativa}>{resposta}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.botao}>
                    <Button
                        title="Finalizar QUIZ"
                        color="#a52a2a"
                        onPress={finalizarQuizJa}
                        disabled={!respostasSelecionadas[0] || !respostasSelecionadas[1] || !respostasSelecionadas[2] || !respostasSelecionadas[3]} // Desabilita o botão até que ambas as respostas sejam selecionadas
                    />
                </View>
            </View>
        </ScrollView>
    );
}

function VisualizarResultado({ route, navigation }) {
    const resultados = route.params?.resultados || [];
    return (
        <ScrollView style={styles.container1}>
            <View style={styles.container}>
                <Text style={styles.title}>Resultado do Quiz</Text>
                {resultados.length > 0 ? (
                    resultados.map((resultado, index) => (
                        <View key={index} style={styles.resultadoContainer}>
                            <Text style={styles.pergunta}>Pergunta {index + 1}:</Text>
                            <Text style={styles.resultado}>
                                Você selecionou: <Text style={resultado.correta ? styles.correto : styles.incorreto}>{resultado.respostaSelecionada}</Text>
                            </Text>
                            <Text style={styles.resultado}>
                                Resultado: <Text style={resultado.correta ? styles.correto : styles.incorreto}>{resultado.correta ? 'Correto!' : 'Incorreto!'}</Text>
                            </Text>
                            {resultado.explicacao && (
                                <Text style={styles.explicacao}>Explicação: {resultado.explicacao}</Text>
                            )}
                        </View>
                    ))
                ) : (
                    <Text style={styles.mensagem}>Nenhum resultado disponível.</Text>
                )}
                <View style={styles.botao}>
                    <Button
                        title="Voltar"
                        color="#f7a156"
                        onPress={() => navigation.navigate("TelaInicial")}
                    />
                </View>
            </View>
        </ScrollView>
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
                />
                <PilhasTelas.Screen
                    name="VisualizarQuizBrasil"
                    component={VisualizarQuizBrasil}
                    options={{ title: "Quiz" }}
                />
                <PilhasTelas.Screen
                    name="VisualizarQuizRussia"
                    component={VisualizarQuizRussia}
                    options={{ title: "Quiz" }}
                />
                <PilhasTelas.Screen
                    name="VisualizarQuizJapao"
                    component={VisualizarQuizJapao}
                    options={{ title: "Quiz" }}
                />
                <PilhasTelas.Screen
                    name="VisualizarResultado"
                    component={VisualizarResultado}
                    options={{ title: "Resultado" }}
                />
            </PilhasTelas.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    container1: {
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    cardContainer: {
        marginBottom: 20,
    },
    pergunta: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 20,
    },
    alternativas: {
        marginBottom: 5,
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
    explicacao: {
        fontSize: 16,
        marginTop: 5,
        color: 'blue',
    },
    backgroundInicial: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerInicial: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    botao: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    }
});