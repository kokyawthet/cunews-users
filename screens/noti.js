import React, { useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { fcmServices } from '../src/FCMServices';
import { LocalNotificatinonServices } from '../src/LocalNotificationServices';
import messaging from '@react-native-firebase/messaging';
export default function noti() {

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
        alert("open notification " + notify.body)
    }

    return (
        <View>
            <Button title="click me"
               
            />
        </View>
    )
}

const styles = StyleSheet.create({})
