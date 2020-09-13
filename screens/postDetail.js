import React from 'react'
import { StyleSheet, Text, View,ScrollView,StatusBar,ImageBackground,TouchableOpacity,Dimensions } from 'react-native'
import Feather from 'react-native-vector-icons/Feather';
import { BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';

// const adUnitId = TestIds.BANNER;
const adUnitId = "ca-app-pub-7962095645683737/9666985389";

export default function postDetail(props) {
    const { post } = props.route.params
    const image = post.image
    const logo = require('../images/ucsmtla.jpg')
    return (
        <>
            <View style={styles.container}> 
                <ImageBackground
                    source={image ? { uri: image } : logo}
                    imageStyle={{ borderBottomRightRadius: 30, borderBottomLeftRadius: 30 }}
                    style={styles.image}
                >
                    <TouchableOpacity style={{
                        position: 'absolute', left: 15, top: 15, backgroundColor: '#2196F3', borderRadius: 40, padding: 10,
                    }}
                        onPress={() => props.navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={20} color="#fff" />
                    </TouchableOpacity>
                </ImageBackground>
                <ScrollView style={{ marginHorizontal: 10,marginBottom:5 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>{ '\t' +post.title}</Text>
                    <Text style={styles.content}>{'\t' + post.content}</Text>
                   
                </ScrollView>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.SMART_BANNER}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    adsContainer: {
        flex: 0.1,
    },
    image: {
        height:Dimensions.get('screen').height/3 -20,
        justifyContent: 'flex-end',
        marginBottom: 5,
    },
    title: {
        color: '#808080',
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical:5
    },
    content: {
        color: '#808080',
        textAlign: 'justify',
        fontWeight: '900',
        lineHeight: 26,
    }
})
