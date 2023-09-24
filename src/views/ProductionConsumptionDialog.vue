<template>
	<dialog-full-screen :active="active" :hide="hide" color="red lighten-1" :buttonsToolbar="buttonsToolbar">
		<template v-slot:dialog-title>
			<span>Detalles del Consumo de Producción | Consumo Teorico vs Real</span>
		</template>

		<template v-slot:dialog-content>
			<v-container>

				<v-overlay :value="overlay">
					<v-progress-circular color="white" indeterminate size="100"></v-progress-circular>
				</v-overlay>

				<v-row>
					<v-col cols="12" md="4" class="card-info-invoice">
						<v-row>
							<v-col cols="12" class="text-center">
								<h3>Generar orden</h3>
							</v-col>

							<v-col cols="12" class="mt-n5">
								<b>Formula: </b>
								<span class="float-right"> {{ formula.name + " " + formula.quantity_batch }} Kg </span>
							</v-col>

							<v-col cols="12" class="mt-n5">
								<b>Cantidad de Batch Sugerida: </b>
								<span class="float-right"> {{ suggested_batches == null || suggested_batches == NaN ? 0
								: suggested_batches }} Batch</span>
							</v-col>

							<v-col cols="12" class="mt-n5">
								<b>Cantidad a Producir:</b>
								<span class="float-right"> {{ formatNumber(quantity_to_produce) }} Kg</span>
							</v-col>

							<v-col cols="6">
								<v-text-field filled v-model="nro_batch" :rules="quantityRules" label="Nro de Batch"
									required>
								</v-text-field>
							</v-col>

							<v-col cols="6">

								<v-btn @click="initConsumo" color="primary" block large class="mt-1">
									<span class="mr-1">Generar</span>
									<v-icon>mdi-upload</v-icon>
								</v-btn>
							</v-col>

						</v-row>

						<v-divider></v-divider>

						<v-row class="mt-2">
							<v-col cols="12" class="text-center">
								<h3>Insumos Menores</h3>
							</v-col>

							<v-col cols="8" class="mt-n3">
								<autocomplete-form uri="/supplies_minors" label="Selecciona un Insumo Menor"
									column="name" itemValue="id" :defaultValue="supply_minor_id" :key="keycomponent"
									:getSelect="getSelectSupplieMinor" />
							</v-col>

							<v-col cols="4" class="mt-n3">
								<v-text-field v-model="number_packages" :key="keycomponent" label="Nro Empaques"
									suffix="UNID" required>
								</v-text-field>
							</v-col>

							<v-col cols="12" class="mt-n6">
								<b>Consumo Producción: </b>
								<span class="float-right"> {{ consumption_minor == null ? 0 :
								consumption_minor }} Kg</span>
							</v-col>

							<v-col cols="12" class="mt-n4">
								<b>Consumo Bolsones: </b>
								<span class="float-right"> {{ consumption_bags == null ? 0 :
								consumption_bags }} Kg</span>
							</v-col>

							<v-col cols="12" class="mt-n4">
								<b>Consumo Envoplas: </b>
								<span class="float-right"> {{ envoplast_consumption == null ? 0 :
								envoplast_consumption }} Kg</span>
							</v-col>
							<v-col cols="12" class="mt-n3">
								<v-btn block @click="saveConsumptionSupplyMinor" color="success">
									Guardar
								</v-btn>
							</v-col>

						</v-row>
					</v-col>

					<v-col cols="12" md="4" class="card-info-invoice">
						<v-row>
							<v-col cols="12" class="text-center">
								<h3>Barrido de Merma</h3>
							</v-col>

							<v-col cols="12" class="mt-n5">
								<v-text-field :rules="quantityRules" v-model="packing_area" label="Area de Empaque"
									required suffix="Kg" placeholder="Ingrese merma del Area de empaque">
								</v-text-field>
							</v-col>

							<v-col cols="12" class="mt-n5">
								<v-text-field :rules="quantityRules" v-model="lab" label="Prueba de Laboratorio"
									required suffix="Kg">
								</v-text-field>
							</v-col>

							<v-col cols="12" class="mt-n5">
								<v-text-field :rules="quantityRules" v-model="hopper_auger"
									label="Remanente de Tolva y Tornillo sin fin" required suffix="Kg">
								</v-text-field>
							</v-col>

							<v-col cols="6" class="mt-5">

								<v-btn block color="green darken-4" @click="saveLossProduction">
									<span class="white--text">Guardar</span>
									<v-icon class="ml-1" color="white">mdi-content-save</v-icon>
								</v-btn>
							</v-col>

							<v-col cols="6" class="mt-5">

								<v-btn block depressed @click="sheet = true" :disabled="loss_production_id == null"
									color="light-green darken-3">
									<span class="white--text">Detalles</span>
									<v-icon class="ml-1" color="white">mdi-content-duplicate</v-icon>
								</v-btn>
							</v-col>


						</v-row>
					</v-col>


					<v-col cols="12" md="4" class="card-info-invoice">
						<v-row>
							<v-col cols="12" class="text-center">
								<h3>Reporte Final</h3>
							</v-col>


							<v-col cols="12">
								<b>Consumo Producción: </b>
								<span class="float-right"> {{ consumption_production == null ? 0 :
								formatNumber( consumption_production ) }} Kg</span>
							</v-col>

							<v-col cols="12">
								<b>Producción Total: </b>
								<span class="float-right"> {{ total_production == null ? 0 : formatNumber(total_production) }}
									Kg</span>
							</v-col>

							<v-col cols="12">
								<b>Merma Produccíon (kg): </b>
								<span class="float-right">
									{{ isNaN(loss_production) ? 0 : formatNumber(loss_production) }} Kg
								</span>
							</v-col>

							<v-col cols="12">
								<b>Merma Produccíon (%): </b>
								<span class="float-right">{{
									isNaN(loss_production_percentage) ?0:
										loss_production_percentage.toFixed(2)
								}} %</span>
							</v-col>

							<v-col cols="12">
								<b>Merma Recuperada: </b>
								<span class="float-right">{{ total_recovered == null ? 0 : total_recovered }} Kg</span>
							</v-col>

							<v-col cols="12">
								<b>Remanente Tolva /<br>Tornillo sin fin (Promedio): </b>
								<span class="float-right mt-n3">{{ hopper_auger }}Kg</span>
							</v-col>

							<v-col cols="12">
								<b>Pruebas Laboratorio: </b>
								<span class="float-right">{{ lab }}Kg</span>
							</v-col>

							<v-col cols="12">
								<b>Merma Faltante: </b>
								<span class="float-right">{{ isNaN(loss_missing) ?0: formatNumber(loss_missing) }}
									Kg</span>
							</v-col>



						</v-row>
					</v-col>
				</v-row>
			</v-container>

			<data-table ref="gridbox" title="Consumo de Producción" :url="'get_consumption_items/' + consumption_id"
				:headers="headers" :update="openDialog" :showPdf="false">

				<template v-slot:toolbar-btn>
					<consumptions-export-pdf :production_order_id="production_order_id"
						:headers="headers"></consumptions-export-pdf>
				</template>

			</data-table>

			<!-- DIalogo para crear o actualizar -->
			<dialog-basic max-width="300" :active="dialog == 'new' || dialog == 'edit'">
				<template v-slot:dialog-title>
					<span>{{ dialog == 'edit' ? 'Actualizar el Item' : 'Nuevo Articulo'}}</span>
				</template>

				<template v-slot:dialog-content>

					<v-form ref="form" v-model="valid" lazy-validation>
						<v-row>

							<v-col cols="12" class="mt-2">
								<v-text-field v-model="to_mixer" :rules="quantityRules" label="Enviado al mezclador"
									suffix="Kg" required placeholder="Ingresa la cantidad enviada al mezclador">
								</v-text-field>
							</v-col>

							<v-col cols="12" class="mt-2">
								<v-text-field v-model="remainder1" :rules="quantityRules" label="Remanente Linea 1"
									suffix="Kg" required placeholder="Ingresa el remanente en la linea 1">
								</v-text-field>
							</v-col>

							<v-col cols="12" class="mt-2">
								<v-text-field v-model="remainder2" :rules="quantityRules" label="Remanente Linea 2"
									suffix="Kg" required placeholder="Ingresa el remanente en la linea 1">
								</v-text-field>
							</v-col>



						</v-row>
					</v-form>
				</template>

				<template v-slot:dialog-actions>
					<v-btn :disabled="!valid" color="transparent" text style="color:#2c823c !important;" class="mr-4"
						@click="validate">
						<span>Guardar</span>
						<v-icon>mdi-check</v-icon>
					</v-btn>

					<v-btn @click="closeDialog" color="transparent" text style="color: #f44336 !important;">
						<span>Cancelar</span>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</template>
			</dialog-basic>


			<!-- Alerta de la app -->
			<snackbar-app :alertId="alertId" :color="colorAlert" :text="textAlert" :icon="iconAlert"></snackbar-app>

			<loss-production-item :active="sheet" :hide="closeSheet"
				:loss_production_id="loss_production_id"></loss-production-item>
		</template>

	</dialog-full-screen>
</template>

<script>

import SnackbarApp from '../components/SnackbarApp.vue';
//import DialogConfirm from '../components/Dialog/DialogConfirm.vue';
import DialogFullScreen from "../components/Dialog/DialogFullScreen.vue";
import DialogBasic from "../components/Dialog/DialogBasic.vue";
import DataTable from "../components/DataTable.vue";
import AutocompleteForm from '../components/autocomplete-form.vue';
import LossProductionItem from "./LossProductionsItems.vue";
import ConsumptionsExportPdf from "../components/ProductionsConsumptionsExportPdf.vue";

export default {
	components: {
		DialogFullScreen,
		DataTable,
		DialogBasic,
		SnackbarApp,
		AutocompleteForm,
		LossProductionItem,
		ConsumptionsExportPdf
	},

	props: ["production_order_id", "active", "hide"],

	data() {
		return {
			valid: true,
			dialog: null,
			menu: false,
			overlay: false,
			keycomponent: 0,
			sheet: false,

			// Merma
			loss_production_id: null,
			packing_area: 0,
			lab: 0,
			hopper_auger: 0,
			total_recovered: 0,

			// insumos menores
			supply_minor_id: null,
			supply_minor: null,
			consumption_bags: null,
			consumption_minor: null,
			envoplast_consumption: null,
			number_packages: 0,

			// consumo de produccion
			nro_batch: null,
			suggested_batches: 0,
			quantity_to_produce: 0,
			consumption_production: 0,
			total_production: 0,

			consumption_id: null,
			formula_id: null,
			formula: {},

			// reporte final
			loss_production: 0,
			loss_production_percentage: 0,
			loss_missing: 0,

			// ingreso al mezclador
			id: null,
			to_mixer: null,
			remainder1: null,
			remainder2: null,

			quantityRules: [
				v => /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/gm.test(v) || 'La cantidad a ingresar no es correcta'
			],



			headers: [
				{ text: 'Materia Prima', value: 'primary_product' },
				{ text: 'Enviado al Mezclador', value: 'to_mixer' },
				{ text: 'Remanente L1', value: 'remainder1' },
				{ text: 'Remanente L2', value: 'remainder2' },
				{ text: 'Consumo (Kg)', value: 'consumption_production' },
				{ text: 'Consumo (%)', value: 'consumption_percentage' },
				{ text: 'Consumo Teorico', value: 'theoretical_consumption' },
				{ text: 'Diferencia', value: 'difference' },
				{ text: 'Acciones', value: 'actions' }
			],

			buttonsToolbar: [
				{
					id: "approvate",
					color: "white",
					icon: "check",
					text: "Guardar",
					action: this.approve,
				},

				{
					id: "generate",
					color: "black",
					icon: "reload",
					text: "Recargar",
					action: this.init,
				},
			],

			colorAlert: null,
			iconAlert: null,
			textAlert: null,
			alertId: 0,
		};
	},

	watch: {
		async production_order_id() {
			await this.init();
		},

		async supply_minor_id(val) {
			try {
				if (val != null) {
					let response = await window.axios.get(`supplies_minors/${this.supply_minor_id}`);

					if (response.status != 200)
						throw new Error(response.data.message);

					this.supply_minor = response.data;

					this.consumption_minor = this.formatNumber(this.number_packages * this.supply_minor.consumption_weight_package);
					this.consumption_bags = this.formatNumber(this.number_packages / this.supply_minor.unid);
					this.envoplast_consumption = (this.total_production / 960).toFixed(2);
					this.formatNumber(this.envoplast_consumption);
				}


			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}
		},

		number_packages() {
			if (this.supply_minor != null || this.supply_minor != undefined) {
				this.consumption_minor = this.formatNumber(this.number_packages * this.supply_minor.consumption_weight_package);
				this.consumption_bags = this.formatNumber(this.number_packages / this.supply_minor.unid);
				this.envoplast_consumption = (this.total_production / 960).toFixed(2);
				this.formatNumber(this.envoplast_consumption);
			}
		}

	},

	methods: {

		alertApp: function (color, icon, text) {
			this.colorAlert = color;
			this.iconAlert = icon;
			this.textAlert = text;
			this.alertId++;
			
		},

		async openDialog(id, dialog) {
			try {
				this.dialog = null;

				if (id != null) {
					let response = await window.axios.get(`productions_consumptions_items/${id}`);

					if (response.status == 200) {
						this.id = response.data.id;
						this.to_mixer = response.data.to_mixer;
						this.remainder1 = response.data.remainder1;
						this.remainder2 = response.data.remainder2;
					}
				}
				this.dialog = dialog;
			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}

		},

		async init() {
			this.overlay = true;
			this.number_packages = 0;
			this.supply_minor_id = null;
			this.packing_area = 0;
			this.lab = 0;
			this.hopper_auger = 0;
			this.total_recovered = 0;
			this.loss_production = 0;
			this.loss_production_percentage = 0;
			this.loss_missing = 0;
			this.loss_production_id = null;

			await this.getDetails();
			await this.$refs.gridbox.getDataFromApi();
			this.overlay = false;
		},

		async getDetails() {
			try {

				let order = await window.axios.get(`productions_consumptions/${this.production_order_id}`);

				if (order.status != 200)
					throw new Error(order.data.message);

				this.nro_batch = order.data.nro_batch;
				this.consumption_production = order.data.consumption_production;
				this.total_production = order.data.total_production;
				this.consumption_id = order.data.id;

				await this.getConsumptionSupplyMinor();
				await this.getLossProduction();


				if (this.consumption_production > 0) {
					this.loss_production = this.total_production - this.consumption_production;
					this.loss_production_percentage = (this.loss_production / this.consumption_production) * 100;
					this.loss_missing = parseFloat(this.loss_production) + parseFloat(this.total_recovered) + parseFloat(this.hopper_auger) + parseFloat(this.lab);
				}


			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}
		},

		closeDialog() {
			this.$refs.form.reset();
			this.dialog = null;
		},

		closeSheet() {
			this.sheet = false;
		},

		cleanForm() {
			this.id = null;
			this.to_mixer = null;
			this.remainder1 = null;
			this.remainder2 = null;
			this.getDetails();
			this.dialog = null;
		},

		validate() {
			if (this.$refs.form.validate() && this.dialog == 'new')
				this.create();

			if (this.$refs.form.validate() && this.dialog == 'edit')
				this.update();

		},

		async getSelectSupplieMinor(supply_minor_id) {
			this.supply_minor_id = supply_minor_id;
		},


		formatNumber: function (number) {
			return new Intl.NumberFormat('es-US', { style: 'decimal' }).format(number);
		},

		async initConsumo() {
			try {
				let response = await window.axios.post('productions_consumptions', {
					production_order_id: this.production_order_id,
					nro_batch: this.nro_batch,
					consumption_id: this.consumption_id
				});

				if (response.status != 201)
					throw new Error(response.data.message);

				this.consumption_id = response.data.consumption_id;
				await this.init();

				this.alertApp("success", "check", response.data.message);

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}
		},

		async getConsumptionSupplyMinor() {
			try {
				let details = await window.axios.get(`get_formula_with_production_order/${this.production_order_id}`);

				if (details.status != 200)
					throw new Error(details.data.message);

				this.formula = details.data.formula;
				this.quantity_to_produce = details.data.order.quantity;

				let consumption_supply_minor = await window.axios.get(`consumptions_supplies_minors/${this.consumption_id}`);

				if (details.status != 200)
					throw new Error(details.data.message);

				if (Object.entries(consumption_supply_minor.data).length > 0) {
					this.supply_minor_id = consumption_supply_minor.data.supply_minor_id;
					this.number_packages = consumption_supply_minor.data.number_packages;
					this.consumption_bags = this.formatNumber(consumption_supply_minor.data.consumption_bags);
					this.consumption_minor = this.formatNumber(consumption_supply_minor.data.consumption);
					this.keycomponent = this.keycomponent + 1;
				}


				this.suggested_batches = (details.data.order.quantity / details.data.formula.quantity_batch).toFixed(2);
				this.suggested_batches = this.formatNumber(this.suggested_batches);
				this.envoplast_consumption = this.formatNumber(this.total_production / 960);
				isNaN(this.envoplast_consumption) ? this.envoplast_consumption = 0 : this.envoplast_consumption;
			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}


		},

		async saveConsumptionSupplyMinor() {
			try {
				let response = await window.axios.post('consumptions_supplies_minors', {
					number_packages: this.number_packages,
					supply_minor_id: this.supply_minor_id,
					consumption_id: this.consumption_id
				});

				if (response.status != 201)
					throw new Error(response.data.message);

				this.alertApp("success", "check", response.data);

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}
		},

		async getLossProduction() {
			try {
				let loss_production = await window.axios.get(`loss_productions/${this.consumption_id}`);

				if (loss_production.status != 200)
					throw new Error(loss_production.data.message);

				loss_production = loss_production.data;

				if (Object.entries(loss_production).length > 0) {
					this.packing_area = loss_production.packing_area;
					this.lab = loss_production.lab;
					this.hopper_auger = loss_production.hopper_auger;
					this.loss_production_id = loss_production.id;
					this.total_recovered = loss_production.total_recovered;
				}
			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}

		},

		async saveLossProduction() {
			try {
				let response = null;

				if (this.loss_production_id == null || this.loss_production_id == undefined) {

					response = await window.axios.post('loss_productions', {
						consumption_id: this.consumption_id,
						packing_area: this.packing_area,
						lab: this.lab,
						hopper_auger: this.hopper_auger,
					});

				} else {

					response = await window.axios.put('loss_productions/' + this.loss_production_id, {
						packing_area: this.packing_area,
						lab: this.lab,
						hopper_auger: this.hopper_auger,
					});

				}

				if (response.status != 201 && response.status != 202)
					throw new Error(response.data.message);

				await this.getLossProduction();
				this.getDetails();
				console.log(response);
				this.alertApp("success", "check", response.data);

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}
		},


		async approve() {
			try {
				let response = await window.axios.post('approve_order/', {
					'production_order_id': this.production_order_id
				});

				if (response.status != 202)
					throw new Error(response.data.message);

				this.alertApp('success', 'check', response.data);
				this.init();
			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async update() {
			try {
				let response = await window.axios.put(`productions_consumptions_items/${this.id}`, {
					to_mixer: this.to_mixer,
					remainder1: this.remainder1,
					remainder2: this.remainder2
				});

				if (response.status != 202)
					throw new Error(response.message);

				this.alertApp("success", "check", response.data);


			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
				await this.getDetails();
				await this.$refs.gridbox.getDataFromApi();
			}

		},
	}


}
</script>

<style>
.card-info-invoice {
	border: 1px solid #ddd;
	background: #fff;
	padding: 20px;
	border-radius: 5px;
	margin: 0px;
}
</style>