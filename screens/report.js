import React from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput,TouchableOpacity,ToastAndroid } from 'react-native'
import * as Firebase from 'firebase';
import NetInfo from "@react-native-community/netinfo";
import { BannerAd, TestIds, BannerAdSize } from '@react-native-firebase/admob';

// const adUnitId = TestIds.BANNER;
const adUnitId = "ca-app-pub-7962095645683737/9666985389";

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

export default class report extends React.Component {
    constructor () {
        super()
        if (!Firebase.apps.length)
        {
            Firebase.initializeApp(firebaseConfig);
        }
        NetInfo.fetch().then(state => {
            console.log("Is connected?", state.isConnected);
            this.setState({ isConnected: state.isConnected })
        });
    }
    state = {
        email: "",
        content: "",
        loading: false,
        emailError: null,
        contentError: null,
        isConnected:false, 
    }

    validateEmail = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false)
        {
            this.setState({ emailError: "Enter correct email." })
            return false;
        }
        else
        {
            this.setState({ emailError: null })
            return true;
        }
    }
    
    validateContent = (text) => {
        if (text.trim() == "" || text.trim() == null)
        {
            this.setState({ contentError: "Content is required." })
            return false;
        } else
        {
            this.setState({ contentError: null })
            return true
        }
    }

    addReport() {
        var emailResult = this.validateEmail(this.state.email);
        var contentResult = this.validateContent(this.state.content)
        if (!this.state.isConnected)
        {
            ToastAndroid.show("No Internet Connection", ToastAndroid.SHORT)
            return
        }
        if (emailResult && contentResult)
        {
            var content = this.state.content;
            var newPostKey = Firebase.database().ref().child("reports").push().key
            var updates = {};
            updates['/reports/' + newPostKey] = {
                email: this.state.email,
                content: content,
                created: new Date().toISOString().slice(0, 10),
            };
            Firebase.database().ref().update(updates)
            this.setState({ email: "", content: "" })
            ToastAndroid.show("Thank you, for your advice", ToastAndroid.SHORT)
        } else
        {
            return
        }
        
    }

    render() {
        return (
            <>
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.card}>
                        <Text
                            style={{color: '#555', lineHeight: 20,marginLeft:5 }}
                        >{'\t CU News is a news application that collects information and location from all Computer University around Myanmar. You can send me that the required information of Myanmar Computer Universities and your advice.\nDeveloped by Kyaw Thet Khaing (UCS-MTLA).'}</Text>
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            placeholder="Enter email"
                            placeholderTextColor="#555"
                            style={styles.inputEmail}
                            value={this.state.email}
                            onChangeText={(text)=>this.setState({email:text})}
                            multiline={true}
                        />
                        {this.state.emailError == null ? null :
                        <Text style={{ color: 'red', alignSelf: 'flex-start', marginLeft: 19 }}>
                                {this.state.emailError}</Text>}
                        <TextInput
                            placeholder="Enter somthing..."
                            placeholderTextColor="#555"
                            style={styles.input}
                            multiline={true}
                            value={this.state.content}
                            onChangeText={(text) => this.setState({ content: text })}
                        />
                        {this.state.contentError == null ? null :
                            <Text style={{ color: 'red', alignSelf: 'flex-start', marginLeft: 19 }}>
                                {this.state.contentError}</Text>}
                    </View>
                    <TouchableOpacity onPress={()=>this.addReport()}>
                        <View style={styles.button}>
                            <Text style={styles.text}>Submit</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
               
            </View>
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.SMART_BANNER}
                />
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        marginBottom: 10,
        paddingBottom:10
    },
    input: {
        width: '90%',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#fff',
        height: 200,
        textAlignVertical: 'top',
        elevation: 4,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.4,
        shadowRadius: 3,
    },
    inputEmail: {
        width: '90%',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#fff',
        height: 50,
        textAlignVertical: 'top',
        elevation: 4,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.4,
        shadowRadius: 3,
    },
    row: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 10,
        backgroundColor: '#2196F3',
        width: '90%',
        alignSelf: 'center',
        marginTop: 10,
        elevation: 2,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.4,
        shadowRadius: 3,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 16,
        textAlign: 'center'
    },
    card: {
        width: '90%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginTop: 10,
        elevation: 4,
        shadowOffset: { width: 1, height: 1 },
        shadowColor: '#333',
        shadowOpacity: 0.4,
        shadowRadius: 3,
        paddingBottom:8
    }
})
