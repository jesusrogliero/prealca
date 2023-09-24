import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes.js';

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

router.beforeEach(async (to, from, next) => {

	try {

		if (window.axios.defaults.headers.common['Authorization'] == null)
			window.axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

		let session = await window.axios.get('/get_session');

		if (to.path != "/login" && session.data.valid == false)
			throw "Usted no esta autorizado para proseguir";
		else if (to.path == "/login" && session.data.valid == true)
			return next('/');

		return next();

	} catch (error) {

		if (error.response.data != null)
			console.error(error.response);
		else
			console.erro(error);

		if (to.path == '/login')
			next();
		else
			next('/login');

		localStorage.user = null;
		localStorage.token = null;
	}

});


export default router
