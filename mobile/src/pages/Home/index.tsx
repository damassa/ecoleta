import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import PickerSelect from 'react-native-picker-select';

interface UFResponse {
    sigla: string;
}

interface CityResponse {
    id: number;
    nome: string;
}

interface Option {
    key: string;
    value: string;
    label: string;
}


const Home = () => {
    const navigation = useNavigation();
    const [uf, setUf] = useState<Option[]>([]);
    const [city, setCity] = useState<Option[]>([]);
    const [loadCity, setLoadCity] = useState<boolean>(false);

    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    useEffect(() => {
        axios.get<UFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
            const UFInitials = response.data.map(uf => ({
                key: uf.sigla,
                value: uf.sigla,
                label: uf.sigla
            }));
            setUf(UFInitials);
        });
    }, []);

    useEffect(() => {
        if (selectedUF === '0') {
            return;
        }
        setLoadCity(true);
        axios.get<CityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios?orderBy=nome`).then(response => {
            const cities = response.data.map(city => ({
                key: String(city.id), 
                value: city.nome,
                label: city.nome
            }));
            setCity(cities);
        });
        setLoadCity(false);
    }, [selectedUF]);

    function handleSelectUF(uf: string) {
        setSelectedUF(uf);
    }

    function handleSelectCity(city: string) {
        setSelectedCity(city);
    }

    function handleNavigateToPoints() {
        navigation.navigate('Points', {
            uf: selectedUF,
            city: selectedCity,
        });
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground 
                source={require('../../assets/home-background.png')} 
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png') }/>
                    <View>
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
                        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <PickerSelect
                        useNativeAndroidPickerStyle={false}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                                top: 25,
                                right: 10
                            }
                        }}
                        onValueChange={(value) => handleSelectUF(value)}
                        placeholder={{ value: '0', label: 'Selecione uma UF' }}
                        items={uf}
                        Icon={() => {
                            return (
                                <View 
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderTopWidth: 10,
                                        borderTopColor: '#34CB79',
                                        borderRightWidth: 10,
                                        borderRightColor: 'transparent',
                                        borderLeftWidth: 10,
                                        borderLeftColor: 'transparent',
                                        width: 0,
                                        height: 0,
                                    }}
                                />
                            )
                        }}                         
                    />
                    
                    { loadCity ? (<ActivityIndicator color="#666" />) : (
                        <PickerSelect 
                            useNativeAndroidPickerStyle={false}
                            onValueChange={(value) => handleSelectCity(value)}
                            placeholder={{ value: '0', label: "Selecione uma cidade." }}
                            style={{
                                ...pickerSelectStyles,
                                iconContainer: {
                                    top: 25,
                                    right: 10,
                                },
                            }}
                            items={city}
                            Icon={() => {
                                return (
                                    <View 
                                        style={{
                                            backgroundColor: 'transparent',
                                            borderTopWidth: 10,
                                            borderTopColor: '#34CB79',
                                            borderRightColor: 'transparent',
                                            borderLeftWidth: 10,
                                            borderLeftColor: 'transparent',
                                            width: 0,
                                            height: 0,
                                        }}
                                    />
                                )
                            }}
                        />
                    ) }

                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      height: 60,
      backgroundColor: '#fff',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
    inputAndroid: {
      height: 60,
      backgroundColor: '#fff',
      borderRadius: 4,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  });

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;