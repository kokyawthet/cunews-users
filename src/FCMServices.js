import messaging from '@react-native-firebase/messaging'
import { Platform } from 'react-native'

class FCMServices {
    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister)
        this.createNotificationListeners(onRegister,onNotification,onOpenNotification)
    }

    registerAppWithFCM = async () => {
        // if (Platform.OS === 'ios')
        // {
        //     await messaging().registerDeviceForRemoteMessages();
        //     await messaging().setAutoInitEnabled(true);
        // }
    }

    checkPermission = (onRegister) => {
        messaging().hasPermission()
            .then(enabled => {
                if (enabled)
                {
                    this.getToken(onRegister)
                } else
                {
                    this.requestPermission(onRegister)
                } 
            })
            .catch(error => {
            console.log("[FCMService] Permission rejected ", error)
        })
    }

    getToken = (onRegister) => {
        messaging().getToken()
            .then(fcmToken => {
                if (fcmToken)
                {
                    onRegister(fcmToken)
                } else
                {
                    console.log("[FCMService] User does not hanve token")
                }
            }).catch(error => {
            console.log("[FCMService] getToken rejected ", error)
        })
    }

    requestPermission = (onRegister) => {
        messaging().requestPermission()
            .then(() => {
            this.getToken(onRegister)
            }).catch(error => {
            console.log("[FCMService ] Request Permission rejected " , error)
        })
    }

    deleteToken = () => {
        console.log("[FCMService] delete token")
        messaging().deleteToken().catch(error => {
            console.log("[FCMService] Delete token error ", error)
        })
    }

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
        //when app is running , but in the background
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log("[FCMService] onNotificationOpenedApp Notification caused to open")
            if (remoteMessage)
            {
                const notification = remoteMessage.notification
                onOpenNotification(notification)
            }
        });
        //when app is opened from a quit state. (close )
        messaging().getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage)
                {
                    const notification = remoteMessage.notification
                    onOpenNotification(notification)
                }
               
            });
        
        //Forground state messages
        this.messageListener = messaging().onMessage(async remoteMessage => {
            console.log("[FCMService] A new message arrived! ", remoteMessage)
            if (remoteMessage)
            {
                let notification  = remoteMessage.notification
                onNotification(notification)
            }
        });

        //Triggered when have new token
        messaging().onTokenRefresh(fcmToken => {
            console.log("[FCMService] New token refresh ", fcmToken)
            onRegister(fcmToken)
        });
    }

    unRegister = () => {
        this.messageListener()
    }

}

export const fcmServices = new FCMServices();