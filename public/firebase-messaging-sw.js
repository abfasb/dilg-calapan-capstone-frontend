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
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});