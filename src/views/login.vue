<template>
	<v-container class="fill-height" fluid>
		<v-row align="center" justify="center">
			<v-col cols="10" sm="10">
				<v-card class="elevation-12" color="#fcfcfc">
					<v-row>
						<v-col cols="12" md="7">
							<v-card-text class="mt-12">
								<v-img src="../assets/nutrivida.jpg" class="mt-n10" style="margin:auto;"
									max-height="230" max-width="300"></v-img>
								<h1 class=" ml-10 mr-10 text-center display-1 red--text text--accent-3">Iniciar Sesión</h1>

								<h4 class="text-center mt-4 mb-6">Debe Autenticarse Antes de Continuar.</h4>
								<v-form>
									<v-row align="center" justify="center">
										<v-col cols="12" md="8">
											<v-text-field v-model="email" label="Email" name="Email" :rules="emailRules"
												prepend-icon="mdi-email" type="text" color="red accent-3" />
										</v-col>

										<v-col cols="12" md="8" class="mt-n5">
											<v-text-field v-model="password" id="password" label="Password"
												name="password" prepend-icon="mdi-lock" type="password"
												color="red accent-3" />
										</v-col>
									</v-row>


								</v-form>
							</v-card-text>
							<div class="text-center mt-3 mb-7">
								<v-btn @click="login" rounded color="red accent-3" dark :loading="loading">INICIAR
									SESION</v-btn>
							</div>
						</v-col>
						<v-col cols="12" md="5" class="red accent-3">
							<v-card-text class="white--text mt-1">
								<v-carousel :show-arrows="false" cycle interval="5000" height="470"
									hide-delimiter-background class="rounded-xl">
									<v-carousel-item >
										<v-sheet height="100%" >
											<v-row class="fill-height" align="center" justify="center">
												<v-img src="../assets/logo1.png" lazy-src="" max-height="500"
													max-width="250">
												</v-img>
											</v-row>
										</v-sheet>
									</v-carousel-item>

									<v-carousel-item>
										<v-sheet height="100%">
											<v-row class="fill-height" align="center" justify="center">
												<v-img src="../assets/logo2.png" lazy-src="" max-height="500"
													max-width="250">
												</v-img>
											</v-row>
										</v-sheet>
									</v-carousel-item>

									<v-carousel-item>
										<v-sheet height="100%">
											<v-row class="fill-height" align="center" justify="center">
												<v-img src="../assets/logo3.png" lazy-src="" max-height="500"
													max-width="250">
												</v-img>
											</v-row>
										</v-sheet>
									</v-carousel-item>

									<v-carousel-item>
										<v-sheet height="100%">
											<v-row class="fill-height" align="center" justify="center">
												<v-img src="../assets/logo4.png" lazy-src="" max-height="500"
													max-width="250">
												</v-img>
											</v-row>
										</v-sheet>
									</v-carousel-item>

								</v-carousel>

								<v-row>
									<v-col cols="12" md="9">
										<v-img height="90" width="300" src="../assets/gob.png"></v-img>
									</v-col>
									<v-col cols="12" md="2">
										<v-img height="100" width="50" src="../assets/logo_inn_pq.png"></v-img>

									</v-col>
								
								</v-row>
							</v-card-text>
						</v-col>
					</v-row>
				</v-card>
			</v-col>
		</v-row>

		<!-- Alerta de la app -->
		<snackbar-app :color="colorAlert" :text="textAlert" :icon="iconAlert"></snackbar-app>

	</v-container>
</template>

<script>
import SnackbarApp from '../components/SnackbarApp.vue';
export default {
	name: 'login',

	components: {
		SnackbarApp
	},

	data() {
		return {
			email: null,
			password: null,
			emailRules: [
				v => !!v || 'La Direccion E-mail es Obligatoria',
				v => /.+@.+/.test(v) || 'La Direccion E-mail es incorrecta',
			],

			colorAlert: null,
			iconAlert: null,
			textAlert: null,

			loading: false
		}
	},
	methods: {

		alertApp: function (color, icon, text) {
			this.colorAlert = color;
			this.iconAlert = icon;
			this.textAlert = text;
		},

		login: async function () {
			try {
				this.loading = true;
				let data = {
					email: this.email,
					password: this.password
				};

				const response = await window.axios.post('/auth/login', data);

				if (response.status === 202) {
					localStorage.token = 'Bearer ' + response.data.token;
					window.axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

					localStorage.user = JSON.stringify(response.data.user);
					localStorage.role = response.data.role;
					this.loading = false;
					this.$router.push('/');
				}

			} catch (error) {
				this.loading = false;
				this.alertApp('error', 'alert', error.response.data.message);
				console.log(error.response.data.message);
			}


		}
	}
}
</script>
