import React from "react";
import {View,Text,Image,StyleSheet,ImageBackground,TouchableOpacity,Dimensions, Button, ToastAndroid} from 'react-native'
import MapView, { Marker } from "react-native-maps";
import Feather from 'react-native-vector-icons/Feather';
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-community/async-storage';
import { InterstitialAd, AdEventType, BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';

// const adUnitId = TestIds.BANNER;
// const adInter = TestIds.INTERSTITIAL
const adUnitId = "ca-app-pub-7962095645683737/9666985389";
const adInter = "ca-app-pub-7962095645683737/1596923679";
const interstitial = InterstitialAd.createForAdRequest(adInter);

class Display extends React.Component {
    
    post = this.props.route.params.post;
    index = this.props.route.params.index;
    from = this.props.route.params.from;
    state = {
        region: {
            latitude: parseFloat(this.post.latitude),
            longitude: parseFloat(this.post.longitude),
            latitudeDelta: 0.09,
            longitudeDelta: 0.08,
        },
        isLiked: false,
        adLoaded: false,
    }

    componentDidMount() {
        this.getAllKeys()
        const eventListener = interstitial.onAdEvent(type => {
            if (type === AdEventType.LOADED)
            {
                this.setState({ adLoaded: true })
            }
        });
        interstitial.load();
    }
    
   

    getAllKeys = async () => {
        const keys = await AsyncStorage.getAllKeys()
        const con = keys.includes(this.index) // index and key is equal
        this.setState({isLiked:con})
    }

    storeData = async (key, value) => {
        try
        {
            const keys = await AsyncStorage.getAllKeys()
            const con = keys.includes(key) // if true , item is already exit
            if (!con)
            {
                const jsonValue = JSON.stringify(value)
                await AsyncStorage.setItem(key, jsonValue)
                this.getAllKeys()
            }

        } catch (e)
        {
        }
    }

    removeFav = async (key) => {
        try
        {
            if (this.from == "favourite")
            {
                this.props.navigation.navigate("Home");
                await AsyncStorage.removeItem(key);
            }
            await AsyncStorage.removeItem(key);
            this.getAllKeys()
        } catch (e)
        {
            // remove error
        }
    }

    render() {
            return (
                <View style={{ flex: 1, backgroundColor: '#eee' }}>
                    <ImageBackground
                        source={{ uri: this.post.image}}
                        imageStyle={{ borderBottomRightRadius: 30, borderBottomLeftRadius: 30 }}
                        style={styles.image}
                    >
                        <View style={styles.DarkOverlay}></View>
                        <Text style={styles.tagLine}>{this.post.title}</Text>
                        <Text style={styles.placename}>Computer University {this.post.title}</Text>
                        <TouchableOpacity style={{
                            position: 'absolute', left: 15, top: 15, backgroundColor: '#2196F3', borderRadius: 40, padding: 10,
                        }}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Feather name="arrow-left" size={20} color="#fff" />
                        </TouchableOpacity>
                        {this.state.isLiked ?
                            <TouchableOpacity style={{
                                position: 'absolute', right: 15, top: 15, backgroundColor: '#2196F3', borderRadius: 40, padding: 10,
                            }}
                                onPress={() => {
                                    this.removeFav(this.index)
                                }
                                }>
                                <Feather name="heart" size={20} color="#f2f2f2" />
                            </TouchableOpacity>
                            :

                            <TouchableOpacity style={{
                                position: 'absolute', right: 15, top: 15, backgroundColor: '#f2f2f2', borderRadius: 40, padding: 10,
                            }}
                                onPress={() => {
                                    this.storeData(this.index, this.post)
                                    this.state.adLoaded ? interstitial.show() : null;
                                    this.setState({ adLoaded: false })
                                }
                                }>
                                <Feather name="heart" size={20} color="#2196F3" />
                            </TouchableOpacity>
                        }

                    </ImageBackground>
                    <ScrollView style={{ marginTop: 12 }}>
                        <Text style={styles.content}>
                            {this.post.content}
                        </Text>
                        <Text style={styles.location}>Location</Text>
                        <MapView
                            style={{
                                height: 220, 
                            }}
                            region={this.state.region}
                        >
                            <Marker coordinate={{
                                latitude: this.state.region.latitude,
                                longitude:this.state.region.longitude
                            }} />
                        </MapView>

                     
                        <TouchableOpacity onPress={() =>{
                            this.post.url != null ?
                                this.props.navigation.navigate("Website",
                                    { uniUri: this.post.url })
                                : ToastAndroid.show("University Website is Preparing...", ToastAndroid.SHORT)
                            }
                        }>
                            <View style={styles.button}>
                                <Text style={styles.text}>University Offical Website Link</Text>
                            </View>
                        </TouchableOpacity>

                        <BannerAd
                            unitId={adUnitId}
                            size={BannerAdSize.SMART_BANNER}
                        />
                    </ScrollView>
                </View>
            );
        }
};

export default Display;

const styles = StyleSheet.create({
    image: {
        height: Dimensions.get('screen').height / 3,
        justifyContent: 'flex-end',
    },
    tagLine: {
        color: '#e6e6e6',
        fontWeight: 'bold',
        marginHorizontal: 18,
        fontSize: 20,
        marginVertical: 6
    },
    placename: {
        color: '#e6e6e6',
        fontWeight: 'bold',
        marginHorizontal: 18,
        fontSize: 16,
        marginBottom: 10
    },
    DarkOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Dimensions.get('screen').height / 3,
        backgroundColor: "#444",
        opacity: 0.1,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30
    },
    content: {
        paddingHorizontal: 14,
        fontSize: 14,
        fontWeight: 'normal',
        opacity: 0.6,
        justifyContent: 'flex-start',
        textAlign: 'justify',
        lineHeight: 26, marginBottom: 22
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        width: '100%',
        alignSelf: 'center',
        marginVertical: 14,
        elevation: 1,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    text: {
        color: '#2196F3',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center',
        fontStyle:"italic"
    },
    location: {
        color: '#808080',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 15,
        marginBottom:5
    }
});
