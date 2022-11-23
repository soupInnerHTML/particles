import messaging, {FirebaseMessagingTypes} from "@react-native-firebase/messaging";
import notifee, {AndroidCategory, AndroidColor, AndroidImportance, EventType} from "@notifee/react-native";
import {AppState} from "react-native";

export function onMessagePress(navigateToChatWithIdAndUser: (id: string, user: string) => unknown) {
    const unsub = notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
            case EventType.PRESS:
                navigateToChatWithIdAndUser(detail.notification.data.chat, detail.notification.data.userId);
                break;
        }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
        switch (type) {
            case EventType.ACTION_PRESS:
                navigateToChatWithIdAndUser(detail.notification.data.chat, detail.notification.data.userId);
                break;
        }

        await notifee.cancelNotification(detail!.notification!.id);
    })

    const opened = messaging().onNotificationOpenedApp((message) => {
        navigateToChatWithIdAndUser(message!.data!.chat, message!.data!.userId);
    })


    const open = AppState.addEventListener("change", async nextAppState => {
        if (nextAppState === "active") {

            const initialNotification = await notifee.getInitialNotification();

            console.log(initialNotification)

            if (initialNotification) {
                navigateToChatWithIdAndUser(initialNotification.notification.data.chat, initialNotification.notification.data.userId);
                // console.log('Notification caused application to open', initialNotification.notification);
                // console.log('Press action used to open the app', initialNotification.pressAction);
            }
        }
    })

    return () => {
        unsub()
        open.remove()
    }
}

export async function onMessageReceived(
    message: FirebaseMessagingTypes.RemoteMessage,
) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
        title: message.notification?.title,
        body: message.notification?.body,
        data: {
            chat: message.data?.chat!,
            userId: message.data?.userId!,
        },
        android: {
            channelId,
            smallIcon: 'ic_notification', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
                id: 'default',
            },
            largeIcon: message.data?.avatar,
            color: AndroidColor.RED,
            importance: AndroidImportance.HIGH,
            circularLargeIcon: true,
            category: AndroidCategory.SOCIAL,
        },
        ios: {
            sound: '',
            badgeCount: 100,
        },
    });
}
