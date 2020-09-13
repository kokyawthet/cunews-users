import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View ,ToastAndroid } from 'react-native'
import WebView from 'react-native-webview';
import { BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';

// const adUnitId = TestIds.BANNER;
const adUnitId = "ca-app-pub-7962095645683737/9666985389";
import NetInfo from "@react-native-community/netinfo";

export default function website(props) {
    const uniUri = props.route.params.uniUri;
    const [connected,setConnected] = useState(false)
    useEffect(() => {
        NetInfo.fetch().then(state => {
            setConnected(state.isConnected)
        });
    },[])
    return (
        <View style={styles.container}>
            {connected ?
                <WebView source={{ uri: uniUri }} />
                : <Text style={styles.text}>No Internet Connection</Text>
            }
            
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.SMART_BANNER}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor:'#ffd24d'
    }
})
