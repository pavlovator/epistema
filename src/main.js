import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from "@/firebase/firebaseInit";


const vueApp = createApp(App);

let firebaseApp;
auth.onAuthStateChanged(() => {
    if (!firebaseApp) {
      vueApp.use(router);
      vueApp.use(store);
      vueApp.mount('#app');
    }

});







