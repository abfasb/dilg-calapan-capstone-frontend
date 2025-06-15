importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBAPuUHFKVrzMHA_CWxBITCqci6-RK5Beg",
  projectId: "pharma-kiosk-ad218",
  messagingSenderId: "270716874976",
  appId: "1:270716874976:web:cd7c864190e61919912085",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    data: {
      // Get click_action from payload.data, not payload.notification
      click_action: payload?.data?.click_action || 'http://localhost:5173/' // fallback
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const clickAction = event.notification?.data?.click_action;

  if (clickAction) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === clickAction && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(clickAction);
      })
    );
  }
});