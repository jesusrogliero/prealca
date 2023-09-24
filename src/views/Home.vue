<template>
	<div>
		<AppBar />

		<v-container class="fill-height mt-n6 mb-n2" fluid>
			<v-row>
				<v-col cols="12" lg="6" md="6" sm="6">

					<h3>
						<v-icon size="30" class="mr-2">mdi-briefcase-variant-outline</v-icon>
						{{ greeting }} {{ user_name }}
					</h3>
				</v-col>
				<v-spacer></v-spacer>

				<v-col cols="12" lg="5" md="5" sm="5">
					<v-row>
						<v-col cols="6">
							<v-select outlined v-model="interval_period" :items="items" label="Periodo"
								class="mt-n1 mb-n5"></v-select>
						</v-col>

						<v-col>
							<v-text-field outlined v-model="interval" append-icon="mdi-magnify" @click:append="refresh"
								label="Intervalo" text class="mt-n1 mb-n5"></v-text-field>
						</v-col>
					</v-row>


				</v-col>
			</v-row>
		</v-container>



		<div class="mx-2">
			<v-row>
				<v-col cols="12" sm="6" md="4" lg="4">
					<v-card :loading="loading" color="#ECEFF1">
						<v-card-title>Ingreso de Materia Prima</v-card-title>
						<v-card-text>
							<v-row>
								<h1 class="ml-2">{{ product_primary_icome == null ? "0.00 Kg" : product_primary_icome}}
								</h1>
								<v-spacer></v-spacer>
								<v-icon size="80" class="mr-2 mt-n9" color="green ">mdi-basket-plus-outline</v-icon>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="12" sm="6" md="4" lg="4">
					<div>
						<v-card :loading="loading" color="#ECEFF1">
							<v-card-title>Consumo de Producción</v-card-title>
							<v-card-text>
								<v-row>
									<h1 class="ml-2">{{ consumption_production == null ? "0 Kg" :
									consumption_production}}
									</h1>
									<v-spacer></v-spacer>
									<v-icon size="80" class="mr-2 mt-n9" color="error">mdi-factory</v-icon>
								</v-row>
							</v-card-text>
						</v-card>
					</div>

				</v-col>

				<v-col cols="12" sm="6" md="4" lg="4">
					<v-card :loading="loading" color="#ECEFF1">
						<v-card-title>Ingreso de Produtos Finales</v-card-title>
						<v-card-text>
							<v-row>
								<h1 class="ml-2">{{ product_final_icome == null ? "0.00 Kg" : product_final_icome}}</h1>
								<v-spacer></v-spacer>
								<v-icon size="80" class="mt-n9" color="primary">mdi-chart-bar-stacked</v-icon>
							</v-row>
						</v-card-text>
					</v-card>
				</v-col>


				<v-col cols="12" sm="12" md="4" lg="4">
					<v-card :loading="loading" color="#ECEFF1">
						<v-card-title>
							<v-row>
								<v-col cols="10">
									Materia Prima
								</v-col>
								<v-col cols="2">
									<v-btn icon> <v-icon>mdi-refresh</v-icon></v-btn>
								</v-col>
							</v-row>

						</v-card-title>
						<v-card-text>
							<grafico :chartData="purchasesChartData"></grafico>
						</v-card-text>

					</v-card>
				</v-col>

				<v-col cols="12" sm="6" md="4" lg="4">
					<v-card :loading="loading" color="#ECEFF1">
						<v-card-title>
							<v-row>
								<v-col cols="10">
									Consumo de Producción
								</v-col>
								<v-spacer></v-spacer>
								<v-col cols="2">
									<v-btn icon> <v-icon>mdi-refresh</v-icon></v-btn>
								</v-col>
							</v-row>
						</v-card-title>
						<v-card-text>
							<grafico :chartData="consumptionsChartData"></grafico>
						</v-card-text>

					</v-card>
				</v-col>

				<v-col cols="12" sm="6" md="4" lg="4">
					<v-card :loading="loading" color="#ECEFF1">
						<v-card-title>
							<v-row>
								<v-col cols="10">
									Productos Finales
								</v-col>
								<v-spacer></v-spacer>
								<v-col cols="2">
									<v-btn icon> <v-icon>mdi-refresh</v-icon></v-btn>
								</v-col>
							</v-row>
						</v-card-title>
						<v-card-text>
							<grafico :chartData="ProductsFinalsChartData"></grafico>
						</v-card-text>

					</v-card>
				</v-col>
			</v-row>
		</div>

	</div>
</template>

<script>
import AppBar from '../components/AppBar.vue';
import Grafico from '../components/charts.vue';
export default {
	name: 'Home',
	components: {
		AppBar, Grafico
	},

	data: function () {
		return {
			greeting: null,
			user_name: null,
			items: [
				{ text: 'Horas', value: 'HOUR' },
				{ text: 'Semanas', value: 'WEEK' },
				{ text: 'Meses', value: 'MONTH' },
				{ text: 'Años', value: 'YEAR' },
			],

			interval_period: null,
			interval: null,

			product_primary_icome: 0,
			consumption_production: 0,
			product_final_icome: 0,

			labels: [
				'Enero',
				'Febrero',
				'Marzo',
				'Abril',
				'Mayo',
				'Junio',
				'Julio',
				'Augosto',
				'Septimebre',
				'Octubre',
				'Noviembre',
				'Deciembre'
			],

			loading: false,
			purchasesChartData: null,
			consumptionsChartData: null,
			ProductsFinalsChartData: null
		};
	},

	created: async function () {
		let result = await window.axios.get('/get_user');
		this.user_name = result.data.user.name;

		let date = new Date();
		let hour = date.getHours();

		if (hour >= 6 && hour < 12) {
			this.greeting = "Buenos Días";

		} else if (hour >= 12 && hour < 18) {
			this.greeting = "Buenas Tardes";

		} else
			this.greeting = "Buenas Noches";

	},

	mounted() {
		this.refresh();
	},

	methods: {
		async refresh() {
			this.purchasesChartData = null;
			this.consumptionsChartData = null;
			this.ProductsFinalsChartData = null;

			await this.get_statistics();
			this.get_purchases_data_chart();
			this.get_consumption_data_chart();
			this.get_prd_final_data_chart();
		},

		formatNumber: function (number) {
			return new Intl.NumberFormat('es-VE').format(number);
		},

		async get_statistics() {
			try {
				this.loading = true;
				let response = await window.axios.post('get_statistics', {
					interval: this.interval,
					interval_period: this.interval_period
				});

				console.table(response.data);

				if (response.status != 200)
					throw new Error(response.message);

				this.product_primary_icome = response.data.purchases_statistics;
				this.consumption_production = response.data.consumptions_statistics;
				this.product_final_icome = response.data.finals_to_warehouse_statistics;


			} catch (error) {
				console.error(error.response.data);
			} finally {
				this.loading = false;
			}
		},

		async get_purchases_data_chart() {

			let response = await window.axios.get('get_purchases_data_chart');

			this.purchasesChartData = {
				labels: this.labels,
				datasets: [response.data]
			};
		},

		async get_prd_final_data_chart() {

			let response = await window.axios.get('get_prd_final_data_chart');

			this.ProductsFinalsChartData = {
				labels: this.labels,
				datasets: [response.data]
			};
		},

		async get_consumption_data_chart() {

			let response = await window.axios.get('get_consumption_data_chart');

			this.consumptionsChartData = {
				labels: this.labels,
				datasets: [response.data]
			};
		}
	}
}
</script>

<style>
.home {
	background-color: rgb(226, 223, 223);
}
</style>