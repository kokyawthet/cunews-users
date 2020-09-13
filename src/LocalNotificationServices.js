import PushNotification from 'react-native-push-notification'
import { Platform } from 'react-native'

class LocalNotificatinonService {
    configure = (onOpenNotification) => {
        // Must be outside of any component LifeCycle (such as `componentDidMount`).
        PushNotification.configure({
            onRegister: function (token) {
                console.log("TOKEN:", token);
            },
            onNotification: function (notification) {
                console.log("NOTIFICATION:", notification);
                if (!notification?.data)
                {
                    return
                }
                notification.userInteraction = true;
                onOpenNotification(notification.data);
            },

            onAction: function (notification) {
                console.log("ACTION:", notification.action);
                console.log("NOTIFICATION:", notification);
                // process the action
            },

            onRegistrationError: function (err) {
                console.error(err.message, err);
            },

            popInitialNotification: true,
            requestPermissions: true,
        });
    }
    
    unRegister = () => {
        PushNotification.unregister()
    }

    showNotification = (id, title, message, data = {}, options = {}) => {
        PushNotification.localNotification({
            // android only properties
            ...this.buildAndroidNotification(id, title, message, data, options),
            // ios and android properties
            ...this.buildIOSNotification(id, title, message, data, options),
            title: title || "",
            message: message || false,
            playSound: options.soundName || 'default',
            userInteraction : false
        });
    }

    buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id: id,
            autoCancel: true,
            largeIcon: options.largeIcon || "ic_launcher",
            smallIcon: options.smallIcon || "ic_notification",
            bigText: message || '',
            subText: title || '',
            vibrate: options.vibrate || true,
            vibration: options.vibration || 300,
            priority: options.priority || "high",
            importance: options.importance || "high",
            data: data,
        }
    }

    buildIOSNotification = (id, title, message, data = {}, options = {}) => {

    }

    cancelLocalNotification = () => {
        PushNotification.cancelAllLocalNotifications();
    }

    removeDeliveredNotificationByID = (notificationId) => {
        console.log("[LocalNotificatinonService] removeDeliveredNotificationById ", notificationId);
        PushNotification.cancelLocalNotifications({id:`${notificationId}`})
    }

}

export const LocalNotificatinonServices = new LocalNotificatinonService()