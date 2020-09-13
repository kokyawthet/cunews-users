import React from 'react'
import {
    StyleSheet, Text, View, StatusBar, FlatList, Image, TouchableOpacity, BackHandler, Alert,
    ToastAndroid
} from 'react-native'
import * as Firebase from 'firebase';
import NetInfo from "@react-native-community/netinfo";

var firebaseConfig = {
    apiKey: "AIzaSyCPeOJxXA5WYrA-wtwK8Q2-9S4P-Ov5OUw",
    authDomain: "cu-news-322b9.firebaseapp.com",
    databaseURL: "https://cu-news-322b9.firebaseio.com",
    projectId: "cu-news-322b9",
    storageBucket: "cu-news-322b9.appspot.com",
    messagingSenderId: "594895555208",
    appId: "1:594895555208:web:0303db1c6cc81e72aa6d3d",
    measurementId: "G-E3HCZ2T5R8"
};
class Home extends React.Component{
    constructor () {
        super()
        this.checkInternet()
        if (!Firebase.apps.length)
        {
            Firebase.initializeApp(firebaseConfig);
        }
    }
    state = {
        posts: [],
        loading: false,
        showDefault: true,
        error: false,
        isConnected: false,
        checked:false,
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }
    componentDidMount() {
        this.checkInternet()
        this.getAllPost();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
       
    }

    checkInternet() {
        NetInfo.fetch().then(state => {
            this.setState({ isConnected: state.isConnected,checked:true })
        });
    }

    getAllPost() {
        this.setState({ loading: true })
        Firebase.database().ref('/posts').on('value', dataSnapshot => {
            var tasks = [];
            this.checkInternet()
            if (!this.state.isConnected)
            {
                ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
            } 
            dataSnapshot.forEach(child => {
                tasks.push({
                    title: child.val().title,
                    content: child.val().content,
                    image: child.val().image,
                    created: child.val().created,
                    timestamp: child.val().timestamp,
                    key: child.key
                });
            });
            tasks.reverse();//first in last out
            this.setState({
                posts: tasks, loading: false
            });
        });
    }

    handleBackButton = () => {
        Alert.alert(
            'CU News',
            'Do you want to exit the application?',
            [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'OK',
                onPress: () => BackHandler.exitApp()
            },], {
            cancelable: false
        }
        )
        return true;
    }

    renderPost(item) {
        var icon = this.state.showDefault ? require('../images/logo.png')
            : this.state.error ? require('../images/logo.png') : { uri: item.image }
        return (
            <View style={styles.row}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate("Report")}
                    >
                        <Image source={require("../images/logo.png")}
                            style={{
                                width: 40, height: 40, borderRadius: 20, borderWidth: 1,
                                borderColor: "#2196F3", padding:5}}
                        />
                    </TouchableOpacity>
                   
                    <View style={{ flexDirection: 'column' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("Report")}
                        >
                            <Text style={styles.appname}>Computer University News</Text>
                        </TouchableOpacity>
                        <Text style={styles.date}>{item.created}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={()=>this.props.navigation.navigate("PostDetail",{post:item})}
                >
                    <Image source={icon}
                        style={{ width: '100%', height: 200, borderRadius: 4 }}
                        onLoadStart={() => this.setState({ showDefault: false })}
                        onError={() => this.setState({ error: true })}
                    />
                    <View style={styles.imageOverlay}></View>
                    <Text style={styles.title}>{item.title}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    emptyList = () => {
        return (
            <View>
                <Text style={{
                    color: '#444', textAlign: 'center',
                    marginTop: 14, fontSize: 16
                }}>
                    No data found</Text>
           </View>
        )
    }
    render() {
        return (
            <>
            <View style={styles.container}>
                <StatusBar backgroundColor="#1976D2" barStyle="light-content" />
                    <FlatList
                        data={this.state.posts}
                        renderItem={({ item }) => this.renderPost(item)}
                        keyExtractor={(k, v) => v.toString()}
                        ListEmptyComponent={() => Object.keys(this.state.posts).length === 0 && !this.state.loading ? this.emptyList():null}
                        onRefresh={() => { this.getAllPost()}}
                        refreshing={this.state.loading}
                        style={{ paddingBottom: 15, marginBottom:5 }}
                        showsVerticalScrollIndicator={false}
                    />
            </View>
            </>
        )
    }
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    row: {
        marginHorizontal: 10,
        justifyContent: 'center',
        marginTop: 7,
        borderWidth: 0.5,
        padding: 5,
        borderColor: '#ddd',
        backgroundColor: '#fff',
        elevation: 4,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 3,
    },
    appname: {
        marginLeft: 5,
        fontSize: 16,
        fontWeight: '700',
        color:'#999999'
    },
    date: {
        marginLeft: 5,
        fontSize: 12,
        fontWeight: '700',
        color: '#999999'
    },
    title: {
        color: '#f2f2f2',
        position: 'absolute',
        bottom: 80,
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        alignSelf:'center'
    },
    header: {
        flexDirection: 'row',
        paddingLeft: 5,
        padding: 6,
        marginBottom:5
    },
    imageOverlay: {
        position: 'absolute',
        backgroundColor: '#000',
        opacity: 0.3,
        width: '100%',
        height: 200,
        borderRadius: 4
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#ffd24d'
    }
})
