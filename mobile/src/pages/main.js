import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

function Main({ navigation }) {
    const [devs, setDevs] = useState([]);
    const [currentRegion, setCurrentRegion] = useState(null);
    const [techs, setTechs] = useState('');

    useEffect(() =>{
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync();

            if(granted){
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });
            }
        }
        loadInitialPosition();
    }, [])

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([... dev, dev]))
    }, [devs]);

    if(!currentRegion){
        return null;
    }

    function setupWebSocket() {
        disconnect();

        const { latitude, longitude } = currentRegion;

        connect(
            latitude,
            longitude,
            techs,
        );
    }

    async function loadDevs() {
        const { latitude, longitude } = currentRegion; 

        const response = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs
            }
        });

        
        setDevs(response.data.devs);
        setupWebSocket();
    }

    function handleRegionChange(region) {
        setCurrentRegion(region);
    }

    return (
        <>
            <MapView onRegionChangeComplete={handleRegionChange} 
            initialRegion={currentRegion} 
            style={style.map} >
                {devs.map(dev => (
                    <Marker key={dev._id} coordinate={{ 
                        latitude: dev.location.coordinates[1], 
                        longitude: dev.location.coordinates[0] }}>
                        <Image 
                        style={style.avatar} 
                        source={{ uri: dev.avatar_url }} />

                        <Callout onPress={()=>{
                            navigation.navigate('Profile', { github_username: dev.github_username });
                        }}>
                            <View style={style.callout}>
                                <Text style={style.devName}>{dev.name}</Text>
                                <Text style={style.devBio}>{dev.bio}</Text>
                                <Text style={style.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>                    
                ))}
            </MapView>

            <View style={style.searchForm}>
                <TextInput 
                style={style.Searchinput}
                placeholder={"Find Dev's by tecnology"}
                placeholderTextColor={"#999"}
                autoCapitalize={"words"}
                autoCorrect={false}
                value={techs}
                onChangeText={setTechs}
                ></TextInput>

                <TouchableOpacity onPress={loadDevs} style={style.loadButton}>
                    <MaterialIcons name={"my-location"} size={20} color={"#FFF"} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const style = StyleSheet.create({
    map:{
        flex: 1
    },
    
    avatar:{
        width: 54,
        height: 54,
        borderRadius: 27,
        borderWidth: 2,
        borderColor: "#000"
    },

    callout:{
        width: 260,
    },
    
    devName:{
        fontWeight: "bold",
        fontSize: 16,
    },

    devBio:{
        color: '#666',
        marginTop: 5,
        fontStyle: "italic"
    },

    devTechs:{
        marginTop: 5,
        fontFamily: "sans-serif",
    },

    searchForm:{
        top: 20,
        position: "absolute",
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },

    Searchinput:{
        flex: 1,
        height: 50,
        backgroundColor: "#FFF",
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: {
            width:4,
            height:4,
        },
        elevation: 3,
    }, 

    loadButton:{
        width: 50,
        height: 50,
        backgroundColor: '#5837BF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        borderRadius: 25
    }
})

export default Main;