import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios';

let URL = '';

if (process.env.NODE_ENV === 'production')
	URL = process.env.VUE_APP_API_PRODUCTION;
else
	URL = process.env.VUE_APP_API_DEVELOPMENT


window.axios = axios.create({
	baseURL: URL,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin' : '*',
	}
});

document.title = "Planta Nutrivida";

Vue.config.productionTip = false

new Vue({
	vuetify,
	router,
	render: h => h(App)
}).$mount('#app')
