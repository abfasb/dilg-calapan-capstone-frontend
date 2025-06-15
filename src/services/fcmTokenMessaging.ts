import { getMessaging, getToken } from "firebase/messaging";

const messaging = getMessaging();

const id = localStorage.getItem('userId');

getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }).then((token : any) => {
  fetch(`${import.meta.env.VITE_API_URL}/save-fcm-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: id, fcmToken: token }),
  });
});

