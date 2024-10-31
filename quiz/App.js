import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, Button, Image } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

const PilhasTelas = createNativeStackNavigator()
const image = { uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fblog.uniasselvi.com.br%2Frelacoes-internacionais-areas-de-atuacao%2F&psig=AOvVaw2Vhsnh0xbuKU56Mm0YGn2K&ust=1729951147387000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOCr2rPYqYkDFQAAAAAdAAAAABAQ' };

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
                })
                const address = response.data.address

                if (address && address.country) {
                    return address.country; // Retorna o nome do país
                }
            } catch (error) {
                console.error(error);
            }
            return null;
        }
        var buscarCoordendadas = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Sem premissão');
                return;
            }
            let location = await Location.getCurrentPositionAsync({})
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

    return (
        <View style={styles.container}>

            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Text style={styles.title}>Teste seus conhecimentos e descubra o quanto você sabe sobre o mundo!</Text>
                <Text style={styles.texto}>{pais ? pais : "Carregando..."}</Text>
                <Button title="PERGUNTAS" color="#523C20" onPress={() => { navigation.navigate("VisualizarQuiz") }}></Button>

            </ImageBackground>

        </View>
    );
}

function VisualizarQuiz({ route, navigation }) {

    const [user, setUser] = useState({})

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Brasil</Text>
            <View style={styles.cardContainer}>
                <Text style={styles.pergunta}>Quanto metros tem a estátua mais famosa do Brasil?</Text>
            </View>
            <Image style={styles.image} source={require('./assets/images/cristo-redentor.jpg')} />
            <View style={styles.alternativas}>
                <View style={styles.cardContainer2}>
                    <Text style={styles.alternativa}>35 m</Text>
                </View>
                <View style={styles.cardContainer2}>
                    <Text style={styles.alternativa}>38 m</Text>
                </View>
                <View style={styles.cardContainer2}>
                    <Text style={styles.alternativa}>50m</Text>
                </View>
                <View style={styles.cardContainer2}>
                    <Text style={styles.alternativa}>46m</Text>
                </View>
            </View>
            <Button title="Finalizar QUIZ" color="#523C20" onPress={() => { navigation.navigate("VisualizarResultado") }}></Button>

        </View>
    )
}
function VisualizarResultado({ route, navigation }) {

    const [brasil, setBrasil] = useState({})

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Brasil</Text>
            <Text>Perguntas</Text>
            <Button title="Voltar" color="#523C20" onPress={() => { navigation.navigate("TelaInicial") }}></Button>
        </View>
    )
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#EFE5D8',
    },
    cardContainer: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#815F32",
        backgroundColor: '#815F32',
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 20,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    cardContainer2: {
        borderWidth: 1,
        borderColor: "#815F32",
        backgroundColor: '#815F32',
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 20,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        fontSize: 25,
        textAlign: 'center',
    },
    texto: {
        fontSize: 20,
        textAlign: 'center',
    },
    image: {
        width: "90%",
        height: "30%",
        padding: 2
    },
    pergunta: {
        fontSize: 20,
        textAlign: 'center',
        color: '#EFE5D8'
    },
    alternativa: {
        fontSize: 15,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#EFE5D8'
    },
    alternativas: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image:{
        
    }
});