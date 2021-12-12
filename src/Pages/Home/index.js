import React, { useState, useEffect } from 'react';
import {View,
        Text,
        SafeAreaView,
        StyleSheet,
        FlatList,
    } from 'react-native';
import * as Location from 'expo-location';

import Menu from '../../components/Menu';
import Header from '../../components/Header';
import Conditions from '../../components/Conditions';
import Foracast from '../../components/Forecast';
import api, { key } from '../../services/api';



export default function Home(){

    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState([]);
    const [icon, setIcon] = useState({ name: 'cloud', color: '#FFF' });
    const [background, setBackground] = useState(['#1ed6ff', '#97c1ff']);




    useEffect( () => {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
          if( status !== 'granted'){
            setErrorMsg('Acesso negado a localização !');
            setLoading(false);
            return;
          }

          let location = await Location.getCurrentPositionAsync({});

          //console.log(location.coords);

          //weather?key=ed761397&lat=-23.682&lon=-46.875
          const response = await api.get(`/weather?key=${key}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);

          setWeather(response.data);

          if(response.data.results.currently === 'noite'){
            setBackground(['#0c3741', '#0f2f61']);

          }

          switch(response.data.results.condition_slug){
            case 'clear_day':
              setIcon( { name: 'partly-sunny', color: '#FFB300' } );
              break;
            case 'rain':
              setIcon( { name: 'rainy', color: '#FFF' } );
              break;
            case 'storm':
              setIcon( { name: 'rainy', color: '#FFF' } );
              break;
          }
          setLoading(false);


      })();

    }, []);

    if(loading){
      return(
        <View style={styles.container}>
          <Text style={{
            fontSize: 17,
            fontStyle: 'italic',
          }}>
              Carregando dados...
          </Text>
        </View>
      )

    }

  return(

    <SafeAreaView style={styles.container}>

      <Menu/>

        <Header background={background}
                weather={weather}
                icon={icon}
                />

          <Conditions weather={weather}/>

            <FlatList 
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              contentContainerStyle={{ paddingBottom: '5%'}}
              style={styles.list}
              data={weather.results.forecast}
              keyExtractor={item => item.date}
              renderItem={ ( {item} ) => <Foracast data={item} /> }
                
            />
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e8F0FF',
        paddingTop: '5%',
    },
    list:{
        marginTop: 10,
        marginLeft: 10,
    },
});
