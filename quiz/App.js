import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet ,Button} from 'react-native';
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
                const response = await axios.get(url,{
                    headers:{
                        'User-Agent':'YourAppName/1.0'
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
            setPais( await buscarPais( lat, long ) )
        }
        buscarCoordendadas()
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>Coordenadas</Text>
            <Text style={styles.paragraph}>Latitude: {latitude!=0?latitude:"..."}</Text>
            <Text style={styles.paragraph}>Longitude: {longitude!=0?longitude:"..."}</Text>
            <Text style={styles.paragraph}>Altitude: {altitude!=0?altitude:"..."}</Text>
            <Text style={styles.paragraph}></Text>
            <Text style={styles.paragraph}>Você esta no hemisfério {latitude<0?"Sul":"Norte"}</Text>
            <Text style={styles.paragraph}>Você esta no hemisfério {longitude<0?"Ocidental":"Oriental"}</Text>
            <Text style={styles.paragraph}></Text>
            <Text style={styles.paragraph}>{pais?pais:"Carregando..."}</Text>
            <Button title="QUIZ" color="#436" onPress={() => { navigation.navigate("VisualizarUsuario", { 'id': us.id }) }}></Button>
        </View>
    );
}

function VisualizarQuiz({ route, navigation }) {

    const [user, setUser] = useState({})
    useEffect(() => {//requisicao
        fetch(`${URL_API}/${route.params.id}`)
            .then(response => response.json())
            .then(json => { setUser(json) })
            .catch(() => { Alert.alert("Erro", "Não foi possível carregar página") })
    }, [route.params.id])

    return (

            <View style={styles.container}>
                <Text style={styles.title}>Brasil</Text>
                <Text>Perguntas</Text>
                
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
                        options={{ title: "Tela Inicial" }}
                    ></PilhasTelas.Screen>
                    <PilhasTelas.Screen
                        name="VisualizarQuiz"
                        component={VisualizarQuiz}
                        options={{ title: "Visualizar Quiz" }}
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
    },
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    },
    cardContainer: {
        width: "90%",
        borderWidth: 1,
        borderColor: "#d5d5d5",
        borderRadius: 10,
        marginBottom: 10,
        marginHorizontal: 20,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between"
    }
});