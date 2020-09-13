import React from 'react'
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Image, TextInput, Keyboard
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { RewardedAd, BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';

// const adUnitId = TestIds.BANNER;
// const adReward = TestIds.REWARDED;
const adUnitId = "ca-app-pub-7962095645683737/9666985389";
const adReward = "ca-app-pub-7962095645683737/9498338696";
const rewarded = RewardedAd.createForAdRequest(adReward);

class University extends React.Component {
    state = {
        data: [],
        loading: false,
        adLoaded: false,
    }
    componentDidMount() {
        rewarded.load();
        this.getData();
    }
    componentDidUpdate() {
        rewarded.load();
    }
    getData = async () => {
        try
        {
            this.setState({loading:true})
            const keys = await AsyncStorage.getAllKeys()
            const uniAry = []
            for (var x in keys)
            {
                const jsonValue = await AsyncStorage.getItem(keys[x])
                const data = jsonValue != null ? JSON.parse(jsonValue) : null;
                uniAry.push({ data: data, key: keys[x]})
            }
            this.setState({ data: uniAry })
            this.setState({ loading: false })
        } catch (e)
        {
            // error reading value
        }
    }
    removeValue = async (key) => {
        try
        {
            await AsyncStorage.removeItem(key);
            this.getData();
        } catch (e)
        {
            // remove error
        }
    }
    render() {
        return (
            <>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.data ? this.state.data:[]}
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            this.props.navigation.navigate('Display',
                                                { post: item.data, index: item.key, from: 'favourite' })
                                            this.state.adLoaded ? null : rewarded.show();
                                            this.setState({ adLoaded: true }) 
                                        }
                                    }>
                                    <View style={styles.cardContainer}>
                                        <Image source={{ uri: item.data.image }}
                                            style={{ width: '100%', height: 100, borderRadius: 6 }}
                                        />
                                        <View style={styles.imageOverlay}></View>
                                        <Text style={styles.cardText}>{item.data.title}</Text>
                                        <TouchableOpacity style={{
                                            position: 'absolute', right: 5, bottom:5,
                                            borderRadius: 30, padding: 5, backgroundColor:"#2196F3" 
                                        }}
                                            onPress={() => {
                                                this.removeValue(item.key)
                                            }
                                            }>
                                            <Feather name="heart" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                        keyExtractor={(k, v) => v.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Text style={{ marginTop: 10, fontSize: 16,color:'#444' }} >
                                No favourite found</Text>
                        }
                        onRefresh={()=>this.getData()}
                        refreshing={this.state.loading}
                    />
                </View>
                <BannerAd
                    unitId={adUnitId}
                    size={BannerAdSize.SMART_BANNER}
                />
            </>
        )
    }
}

export default University

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor:"#eee"
    },
    adsContainer: {
        flex: 0.1,
        alignItems: "center",
        justifyContent: 'center',
    },
    cardContainer: {
        backgroundColor: "#fff",
        width: Dimensions.get('screen').width / 2 - 16,
        height: 100,
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 4,
        elevation: 5,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.4,
        shadowRadius: 3,
    },
    cardText: {
        color: '#e6e6e6',
        fontSize: 16,
        position: 'absolute',
        bottom: 5,
        left: 5,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        flexWrap: "wrap",
    },
    imageOverlay: {
        position: 'absolute',
        backgroundColor: '#000',
        opacity: 0.2,
        borderRadius: 4,
        width: Dimensions.get('screen').width / 2 - 16,
        height: 100,
    },
    searchRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: "center",
        backgroundColor: '#2196F3',
        height: 50,
        width: '100%'
    },
    input: {
        width: '80%',
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f5f5',
        borderRadius: 2,
        height: 40,
        color: '#fff'
    },
})


