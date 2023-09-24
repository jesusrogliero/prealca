<template>
	<dialog-full-screen :active="active" :hide="hide" color="red lighten-1" :buttonsToolbar="buttonsToolbar">
		<template v-slot:dialog-title>
			<span>Detalles de la Orden</span>
		</template>

		<template v-slot:dialog-content>
			<v-container>
				<v-row>
					<v-col cols="12" md="6" lg="4" class="card-info-invoice">
						<v-row>
							<v-col cols="12" class="text-center">
								<h3>Datos del Provedor</h3>
							</v-col>
							<v-col cols="12">
								<b>Nombre: </b>
								<span class="float-right">{{ provider.name }}</span>
							</v-col>
							<v-col cols="12">
								<b>Identidad: </b>
								<span class="float-right"> {{
								`${provider.type}-${formatNumber(provider.identity)}`}}</span>
							</v-col>
							<v-col cols="12">
								<b>Telefono: </b>
								<span class="float-right">{{ provider.phone }}</span>
							</v-col>
							<v-col cols="12">
								<b>Ubicación: </b>
								<span class="float-right"> {{ provider.address }}</span>
							</v-col>
						</v-row>
					</v-col>

					<v-col cols="12" md="6" lg="4" class="card-info-invoice">
						<v-row>
							<v-col cols="12" class="text-center">
								<h3>Datos de la Orden</h3>
							</v-col>
							<v-col cols="12">
								<b>Estado: </b>
								<span class="float-right">{{ order.state_id == 1 ? "Pendiente" : "Aprobado" }}</span>
							</v-col>
							<v-col cols="12">
								<b>Total Productos: </b>
								<span class="float-right">{{
									order.total_products == 0 ? '0 Kg' :
										order.total_products
								}}</span>
							</v-col>
							<v-col cols="12">
								<b>Total Carga: </b>
								<span class="float-right"> {{
									order.total_load == 0 ? '0 Kg' :
										formatNumber(order.total_load) + ' Kg'
								}}</span>
							</v-col>
							<v-col cols="12">
								<b>Total No conforme: </b>
								<span class="float-right"> {{
									order.total_nonconforming == 0 ? 0 :
										formatNumber(order.total_nonconforming) + ' Kg'
								}}</span>
							</v-col>
						</v-row>
					</v-col>


					<v-col cols="12" md="6" lg="4" class="card-info-invoice">
						<v-row>
							<v-col cols="12" class="text-center">
								<h3>Observación</h3>
							</v-col>

							<v-textarea v-model="observations" auto-grow filled color="red" append-icon="mdi-send"
								@click:append="setObservation" placeholder="Puede ingresar aqui una observacion"
								rows="1"></v-textarea>

						</v-row>
					</v-col>
				</v-row>
			</v-container>

			<data-table ref="gridbox" title="Lista de Articulos" :url="'get_purchases_orders_items/' + order_id"
				:headers="headers" :add="openDialog" :update="openDialog" :destroy="openDialog" :showPdf="false">
				
				<template v-slot:toolbar-btn>
					<purchases-export-pdf :purchase_order_id="order_id" :headers="headers"></purchases-export-pdf>
				</template>

			</data-table>

			<!-- Dialogo de confirmacion antes de eliminar -->
			<dialog-confirm :active="dialog == 'delete'" :confirm="destroyItem" :cancel="cleanForm">
				<template v-slot:dialog-title>Eliminar Articulo</template>
				<template v-slot:dialog-content><span class="headline">Esta seguro de que desea eliminar el siguiente
						Articulo?</span></template>
			</dialog-confirm>

			<!-- DIalogo para crear o actualizar -->
			<dialog-basic :active="dialog == 'new' || dialog == 'edit'" :max-width="350">
				<template v-slot:dialog-title>
					<span>{{ dialog == 'edit' ? 'Editar Rubro' : 'Nuevo Rubro'}}</span>
				</template>

				<template v-slot:dialog-content>

					<v-form ref="form" v-model="valid" lazy-validation>
						<v-row>

							<v-col cols="12" class="mt-2">
								<autocomplete-form uri="/primaries_products" label="Selecciona un Producto Primario"
									column="name" itemValue="id" :defaultValue="primary_product_id"
									:getSelect="getSelectPrimaryProduct" />
							</v-col>

							<v-col cols="6" class="mt-2">
								<v-text-field v-model="quantity" :rules="quantityRules" suffix="Kg" label="Cantidad" required
									placeholder="Ingresa la cantidad del articulo">
								</v-text-field>
							</v-col>

							<v-col cols="6" class="mt-2">
								<v-text-field v-model="nonconform_quantity" suffix="Kg" :rules="nonconformRules"
									label="Cantidad No Conforme" required placeholder="Ingresa la cantidad no conforme">
								</v-text-field>
							</v-col>

							<v-col cols="7" class="mt-2">
								<v-menu ref="menu" v-model="menu" :close-on-content-click="false"
									:return-value.sync="due_date" transition="scale-transition" offset-y
									min-width="auto">

									<template v-slot:activator="{ on, attrs }">
										<v-text-field v-model="due_date" label="Fecha de Vencimiento"
											prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"
											:rules="dueDateRules" required></v-text-field>
									</template>

									<v-date-picker v-model="due_date" no-title scrollable>
										<v-spacer></v-spacer>
										<v-btn text color="primary" @click="menu = false">
											Cancel
										</v-btn>
										<v-btn text color="primary" @click="$refs.menu.save(due_date)">
											OK
										</v-btn>
									</v-date-picker>

								</v-menu>
							</v-col>

							<v-col cols="5" class="mt-2">
								<v-text-field v-model="nro_lote" :rules="lotesRules" label="N° lote" required
									placeholder="Ingresa el lote">
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
			<snackbar-app :color="colorAlert" :text="textAlert" :icon="iconAlert"></snackbar-app>
		</template>

	</dialog-full-screen>
</template>

<script>

import SnackbarApp from '../components/SnackbarApp.vue';
import DialogConfirm from '../components/Dialog/DialogConfirm.vue';
import DialogFullScreen from "../components/Dialog/DialogFullScreen.vue";
import DialogBasic from "../components/Dialog/DialogBasic.vue";
import DataTable from "../components/DataTable.vue";
import AutocompleteForm from '../components/autocomplete-form.vue';
import PurchasesExportPdf from '../components/PurchasesOrderExportPdf.vue';

export default {
	components: {
		DialogFullScreen, DataTable, DialogBasic,
		SnackbarApp, DialogConfirm, AutocompleteForm, PurchasesExportPdf
	},

	props: ["order_id", "active", "hide"],

	data() {
		return {
			valid: true,
			dialog: null,
			menu: false,

			id: null,
			primary_product_id: null,
			quantity: null,
			due_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
			nro_lote: null,
			nonconform_quantity: 0,
			observations: null,

			quantityRules: [
				v => !!v || 'Este campo es requerido!!',
				v => /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/gm.test(v) || 'La cantidad a ingresar no es correcta'
			],
			nonconformRules: [v => /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/gm.test(v) || 'La cantidad no conforme no es correcta'],
			dueDateRules: [v => !!v || 'Este campo es requerido!!',],
			lotesRules: [v => !!v || 'Este campo es requerido!!',],

			order: {},
			provider: {},

			headers: [
				//{ text: 'ID', align: 'start', value: 'id' },
				{ text: 'Producto Primario', value: 'primary_product' },
				{ text: 'Cantidad', value: 'quantity' },
				{ text: 'No Conforme', value: 'nonconform_quantity' },
				{ text: 'Nro De Lote', value: 'nro_lote' },
				{ text: 'Expiración', value: 'due_date' },
				//{ text: 'Creado el ', value: 'created_at' },
				//{ text: 'Actualizado el', value: 'updated_at' },
				{ text: 'Acciones', value: 'actions' }
			],

			buttonsToolbar: [
				{
					id: "approvate",
					color: "white",
					icon: "check",
					text: "Aprobar",
					action: this.approve,
				},
			],

			colorAlert: null,
			iconAlert: null,
			textAlert: null,
		};
	},

	watch: {
		async order_id(val) {
			await this.getDetails(val);
		}

	},

	methods: {

		alertApp: function (color, icon, text) {
			this.colorAlert = color;
			this.iconAlert = icon;
			this.textAlert = text;
		},

		async openDialog(id, dialog) {
			try {
				this.dialog = null;

				if (id != null) {
					let response = await window.axios.get(`purchases_orders_items/${id}`);

					if (response.status == 200) {
						this.id = response.data.id;
						this.primary_product_id = response.data.primary_product_id;
						this.quantity = response.data.quantity;
						this.due_date = response.data.due_date;
						this.nro_lote = response.data.nro_lote;
						this.nonconform_quantity = response.data.nonconform_quantity;
					}
				}
				this.dialog = dialog;
			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}

		},

		async getDetails(order_id) {
			try {



				let order = await window.axios.get(`purchases_orders/${order_id}`);

				if (order.status == 200) {
					this.order = order.data;
					this.observations = this.order.observations;

					let provider = await window.axios.get(`providers/${this.order.provider_id}`);
					if (provider.status == 200)
						this.provider = provider.data;
					await this.$refs.gridbox.getDataFromApi();
				}

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}
		},

		closeDialog() {
			this.$refs.form.reset();
			this.dialog = null;
		},

		cleanForm() {
			this.id = null;
			this.primary_product_id = null;
			this.quantity = null;
			this.due_date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10);
			this.nro_lote = null;
			this.nonconform_quantity = 0;
			this.getDetails(this.order_id);
			this.dialog = null;
		},

		validate() {
			if (this.$refs.form.validate() && this.dialog == 'new')
				this.create();

			if (this.$refs.form.validate() && this.dialog == 'edit')
				this.update();

		},

		getSelectPrimaryProduct(id) {
			this.primary_product_id = id;
		},

		formatNumber: function (number) {
			return new Intl.NumberFormat('es-US', { style: 'decimal' }).format(number);
		},


		async create() {
			try {
				let response = await window.axios.post('purchases_orders_items', {
					primary_product_id: this.primary_product_id,
					quantity: this.quantity,
					due_date: this.due_date,
					purchase_order_id: this.order_id,
					nro_lote: this.nro_lote,
					nonconform_quantity: this.nonconform_quantity
				});

				if (response.status != 201)
					throw new Error(response.message);

				this.getDetails(this.order_id);
				await this.$refs.gridbox.getDataFromApi();
				this.alertApp("success", "check", response.data);

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},


		async setObservation() {
			try {
				let response = await window.axios.post(`set_observation/${this.order_id}`, {
					observations: this.observations,
				});

				if (response.status != 202)
					throw new Error(response.message);

				this.alertApp("success", "check", response.data);

				this.getDetails(this.order_id);

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async approve() {
			try {
				let response = await window.axios.get(`approve_purchase/${this.order_id}`);

				if (response.status != 202)
					throw new Error(response.message);

				this.alertApp("success", "check", response.data);

				this.getDetails(this.order_id);

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async update() {
			try {
				let response = await window.axios.put(`purchases_orders_items/${this.id}`, {
					primary_product_id: this.primary_product_id,
					quantity: this.quantity,
					due_date: this.due_date,
					purchase_order_id: this.order_id,
					nro_lote: this.nro_lote,
					nonconform_quantity: this.nonconform_quantity
				});

				if (response.status != 202)
					throw new Error(response.message);

				this.getDetails(this.order_id);
				await this.$refs.gridbox.getDataFromApi();
				this.alertApp("success", "check", response.data);


			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async destroyItem() {
			try {
				let response = await window.axios.delete(`purchases_orders_items/${this.id}`);

				if (response.status != 204)
					throw new Error(response.message);

				this.getDetails(this.order_id);
				await this.$refs.gridbox.getDataFromApi();
				this.alertApp("success", "check", 'Eliminado Correctamente');

			} catch (error) {
				if (error.response.data.code === 23000)
					this.alertApp('error', 'alert', 'Este registro no puede ser eliminado');
				else
					this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.dialog = null;
				this.cleanForm();
			}
		}
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