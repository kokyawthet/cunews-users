import React from 'react'
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions,Image,TextInput,Keyboard
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { InterstitialAd, AdEventType, BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';
import * as Firebase from 'firebase';

// const adUnitId = TestIds.BANNER;
// const adInter = TestIds.INTERSTITIAL
const adUnitId = "ca-app-pub-7962095645683737/9666985389";
const adInter = "ca-app-pub-7962095645683737/1596923679";
const interstitial = InterstitialAd.createForAdRequest(adInter);


class University extends React.Component {
    

    state = {
        value: "",
        loading: false,
        posts: [],
        data:[],
        noData: false,
        adLoaded: false,
    }

    componentDidMount() {
      this.getAllImages()
        const eventListener = interstitial.onAdEvent(type => {
            if (type === AdEventType.LOADED)
            {
                this.setState({ adLoaded: true })
            }
        });
        interstitial.load();
    }

   
    getAllImages() {
        this.setState({ loading: true })
        Firebase.database().ref('/university').on('value', dataSnapshot => {
            var tasks = [];
            dataSnapshot.forEach(child => {
                tasks.push({
                    title: child.val().title,
                    content: child.val().content,
                    latitude: child.val().latitude,
                    longitude: child.val().longitude,
                    url: child.val().url,
                    image: child.val().image,
                    created: child.val().created,
                    key: child.key
                });
            });
            this.setState({
                posts: tasks, data:tasks, loading: false
            });
        });
    }
   

    searchUni = (value) => {
        let text = value.toLowerCase()
        let trucks = this.state.data
        let filteredName = trucks.filter((item) => {
            return item.title.toLowerCase().match(text)
        })
        if (!text || text === '')
        {
            this.setState({
                posts: this.state.data
            })
        } else if (!Array.isArray(filteredName) && !filteredName.length)
        {
            // set no data flag to true so as to render flatlist conditionally
            this.setState({
                noData: true
            })
        } else if (Array.isArray(filteredName))
        {
            this.setState({
                noData: false,
                posts: filteredName
            })
        }
    }

    handleImage(item, index) {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate('Display',
                                { post: item, index: "@key" + index });
                        this.state.adLoaded ?  interstitial.show() : null;
                        this.setState({adLoaded:false})
                        }
                    }>
                    <View style={styles.cardContainer}>
                        <Image source={{uri:item.image}}
                            style={{ width: '100%', height: 100, borderRadius: 6 }}
                        />
                        <View style={styles.imageOverlay}></View>
                        <Text style={styles.cardText}>{item.title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    emptyList = () => {
        return (
            <Text style={{ color: '#444', textAlign: 'center',fontSize:16,marginTop:14 }}>
                No data found</Text>
        )
    }
    
    render() {
        return (
            <>
                <View style={styles.container}>
                    <View style={styles.searchRow}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()} >
                            <MaterialIcons name="menu" size={28} color="#fff"
                                style={{marginHorizontal:16}}
                                />
                        </TouchableOpacity>
                        <TextInput style={styles.input} value={this.state.value} placeholder="Search..." placeholderTextColor='#f2f2f2'
                            onChangeText={(text) => {
                                this.setState({ value: text });
                                this.searchUni(text)
                            }
                            } />
                        <MaterialIcons name="close" size={22} color="#f2f2f2"
                            style={{ right: 25 }}
                            onPress={() => {
                                this.setState({ value: '' })
                                this.searchUni('')
                            }
                            }/>
                    </View>
                    <FlatList
                        data={this.state.posts}
                        renderItem={({ item, index }) => 
                            this.handleImage(item,index)
                        }
                        keyExtractor={(k, v) => v.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        onRefresh={() => this.getAllImages()}
                        refreshing={this.state.loading}
                        ListEmptyComponent={() => this.emptyList()}
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
        backgroundColor:'#eee'
    },
    cardContainer: {
        backgroundColor: "#fff",
        width: Dimensions.get('screen').width / 2 - 16,
        height: 100,
        marginVertical: 5,
        marginHorizontal: 5,
        borderRadius: 4,
        elevation: 2,
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
        fontWeight:'bold'
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
        backgroundColor:'#2196F3',
        height: 50,
        width:'100%'
    },
    input: {
        width: '80%',
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f5f5',
        borderRadius: 2,
        height: 40,
        color:'#fff'
    },
})


