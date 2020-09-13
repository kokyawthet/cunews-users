import React, { useEffect } from 'react'
import {
  StyleSheet, View, TouchableOpacity, Image, Share, Alert,Text,
  ToastAndroid, Linking
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator, DrawerContentScrollView, DrawerItem
}
  from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';

import { fcmServices } from  './src/FCMServices'
import { LocalNotificatinonServices } from './src/LocalNotificationServices';
import messaging from '@react-native-firebase/messaging';


import Home from './screens/Home'
import University from './screens/University'
import Display from './screens/display'
import Favourite from './screens/favourite'
import Report from './screens/report'
import PostDetail from './screens/postDetail'
import Website from './screens/website'
// import Noti from './screens/noti'

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const GOOGLE_PACKAGE_NAME = 'com.cumtla.ktk.cunews';
const APPLE_STORE_ID = 'id284882215';
const openStore = () => {
  if (Platform.OS != 'ios')
  {
    Linking.openURL(`https://play.google.com/store/apps/details?id=${GOOGLE_PACKAGE_NAME}`)
      .catch(err =>
        alert('Please check for the Google Play Store')
      );
  }
};
const shareAppOptions = () => {
  Share.share({
    title: "Hello Friends",
    message: `https://play.google.com/store/apps/details?id=${GOOGLE_PACKAGE_NAME}`,
    dialogTitle: "Please Install"
  })
}

const Screens = ({ navigation}) => {
  return (
      <Stack.Navigator
        screenOptions={{
        headerTransparent: false,
        headerTitle: null,
        headerStyle: {
          backgroundColor:'#2196F3'
        },
        color:'#D81B60',
          headerLeft: () => (
            <MaterialIcons name="menu" color="#fff" size={28} style={{ marginLeft: 14 }}
              onPress={() => navigation.openDrawer()} />
          ),
          headerTitle: () => (
            <View style={styles.rightHeader}>
              <TouchableOpacity 
                onPress={() => navigation.navigate("University")}
                style={{ borderRadius: 20, backgroundColor:'#1976D2',padding:3}}
              >
                <MaterialIcons name="computer" size={26} color="#fff"  />
              </TouchableOpacity>
            </View>
          )
        }}
    >
      {/* <Stack.Screen name="Noti" component={Noti} /> */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="University" component={University} options={{ headerShown: false }} />
      <Stack.Screen name="Display" component={Display} options={{ headerShown: false }} />
      <Stack.Screen name="Favourite" component={Favourite} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="PostDetail" component={PostDetail} options={{ headerShown: false }} />
      <Stack.Screen name="Website" component={Website} options={{ headerShown: false }} />
      </Stack.Navigator>
  )
}

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View >
        <View style={{
          backgroundColor: '#2196F3',
          marginTop: -5, width: "100%", height: 180,
        }}>
          <Image source={require("./images/logo.png")}
            style={{
              width: 120, height: 120, alignSelf:'center'
            }} />
          <Text style={{ color: '#f2f2f2', fontWeight: 'bold',marginLeft:16,fontSize:16 }}>
            Information of Myanmar</Text>
          <Text style={{ color: '#f2f2f2', marginLeft: 16  }}>Computer University News</Text>
        </View>
        <DrawerItem
          label="Home"
          labelStyle={{ marginLeft: -16, color: "#757575" }}
          onPress={() => props.navigation.navigate("Home")}
          icon={() => <MaterialIcons name='home' size={25} color="#757575" />}
        />
        <DrawerItem
          label="University"
          labelStyle={{ marginLeft: -16, color: "#757575" }}
          onPress={() => props.navigation.navigate("University")}
          icon={() => <MaterialIcons name='computer' size={25} color="#757575" />}
        />
        <DrawerItem
          label="Favourite"
          labelStyle={{ marginLeft: -16, color: "#757575" }}
          onPress={() => props.navigation.navigate("Favourite")}
          icon={() => <Feather name='heart' size={25} color="#757575" />}
        />
        <DrawerItem
          label="Rate Me"
          labelStyle={{ marginLeft: -16, color: "#757575" }}
          onPress={() => openStore()}
          icon={() => <MaterialIcons name='star' size={25} color="#757575" />}
        />
        <DrawerItem
          label="Feedback"
          labelStyle={{ marginLeft: -16, color: "#757575" }}
          onPress={() => openStore()}
          icon={() => <MaterialIcons name='feedback' size={25} color="#757575" />}
        />
        <DrawerItem
          label="Share"
          labelStyle={{ marginLeft: -16, color: "#757575" }}
          onPress={() => shareAppOptions()}
          icon={() => <MaterialIcons name='share' size={25} color="#757575" />}
        />
        <DrawerItem
          label="Contact Me"
          labelStyle={{ marginLeft: -16, color: "#757575" }}
          onPress={() => props.navigation.navigate("Report")}
          icon={() => <MaterialIcons name='message' size={25} color="#757575" />}
        />
      </View>
    </DrawerContentScrollView>
  )
}

const App = () => {

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  useEffect(() => {
    fcmServices.registerAppWithFCM()
    fcmServices.register(onRegister, onNotification, onOpenNotification)
    LocalNotificatinonServices.configure(onOpenNotification)

    return () => {
      console.log("[App] unRegister")
      fcmServices.unRegister()
      LocalNotificatinonServices.unRegister()
    }
  }, [])
  function onRegister(token) {
    console.log("[App] on register ", token)
  }

  function onNotification(notify) {
    console.log("[App] on notification ", notify)
    const options = {
      soundName: 'default',
      playSound: true
    }
    LocalNotificatinonServices.showNotification(
      0,
      notify.title,
      notify.body,
      notify,
      options
    )
  }

  function onOpenNotification(notify) {
    console.log("[App] onOpenNotification ", notify)
  }

  return (
    <NavigationContainer>
    <Drawer.Navigator
        initialRouteName="Home"
        overlayColor='transparent'
        drawerStyle={{
          backgroundColor: '#f2f2f2',
        }}
        drawerType='front'
        drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Screens" >
        {props => <Screens {...props} />}
      </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  )
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 6
  },
  rightHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
})
export default App;
