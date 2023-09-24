<template>
	<dialog-full-screen :active="active" :hide="hide" color="red lighten-1" :buttonsToolbar="buttonsToolbar">
		<template v-slot:dialog-title>
			<span>Detalles de la Orden de Despacho</span>
		</template>

		<template v-slot:dialog-content>
			<v-container>
				<v-row>
					<v-col cols="12" md="6" lg="4" class="card-info-invoice">
						<v-row>
							<v-col cols="12" class="text-center">
								<h3>Datos del Receptor</h3>
							</v-col>
							<v-col cols="12">
								<b>Nombre: </b>
								<span class="float-right">{{ receiver.name }}</span>
							</v-col>
							<v-col cols="12">
								<b>Identidad: </b>
								<span class="float-right"> {{
								`V-${formatNumber(receiver.identity)}`}}</span>
							</v-col>
							<v-col cols="12">
								<b>Telefono: </b>
								<span class="float-right">{{ receiver.phone }}</span>
							</v-col>
							<v-col cols="12">
								<b>Ubicación: </b>
								<span class="float-right"> {{ receiver.address }}</span>
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
								<b>Nro Guia Sada: </b>
								<span class="float-right">{{
									order.guide_sada
								}}</span>
							</v-col>
							<v-col cols="12">
								<b>Codigo Sica: </b>
								<span class="float-right"> {{
									order.sica_code
								}}</span>
							</v-col>
							<v-col cols="12">
								<b>Total: </b>
								<span class="float-right"> {{
									order.total == 0 ? "0 Kg" :
										formatNumber(order.total) + ' Kg'
								}}</span>
							</v-col>
						</v-row>
					</v-col>


					<v-col cols="12" md="6" lg="4" class="card-info-invoice">
						<v-row>
							<v-col cols="12" class="text-center">
								<h3>Observación</h3>

								<v-textarea v-model="observations" auto-grow filled color="red" append-icon="mdi-send"
								@click:append="setObservation" placeholder="Puede ingresar aqui una observacion"
								rows="1"></v-textarea>
							</v-col>

							<v-col cols="12" class="text-center mt-n4">
								<h3>Datos del Chofer</h3>
							</v-col>

							<v-col cols="12">
								<b>Nombre: </b>
								<span class="float-right"> {{
									order.drive_name
								}}</span>
							</v-col>

							<v-col cols="12">
								<b>C.I: </b>
								<span class="float-right"> {{
									order.drive_identity
								}}</span>
							</v-col>
							

						</v-row>
					</v-col>
				</v-row>
			</v-container>

			<data-table ref="gridbox" title="Lista de Productos" :url="'dispatch_items/' + order_id"
				:headers="headers" :add="openDialog" :update="openDialog" :destroy="openDialog" :showPdf="false">
				
				<!-- 
				<template v-slot:toolbar-btn >
					<purchases-export-pdf v-if="false" :purchase_order_id="order_id" :headers="headers"></purchases-export-pdf>
				</template>
				-->

			</data-table>

			<!-- Dialogo de confirmacion antes de eliminar -->
			<dialog-confirm :active="dialog == 'delete'" :confirm="destroyItem" :cancel="cleanForm">
				<template v-slot:dialog-title>Eliminar Articulo</template>
				<template v-slot:dialog-content><span class="headline">Esta seguro de que desea eliminar el producto?</span></template>
			</dialog-confirm>

			<!-- DIalogo para crear o actualizar -->
			<dialog-basic :active="dialog == 'new' || dialog == 'edit'" :max-width="350">
				<template v-slot:dialog-title>
					<span>{{ dialog == 'edit' ? 'Editar Item' : 'Agregar Item'}}</span>
				</template>

				<template v-slot:dialog-content>

					<v-form ref="form" v-model="valid" lazy-validation>
						<v-row>

							<v-col cols="12" class="mt-2">
								<autocomplete-form uri="/products_finals" label="Selecciona un Producto Final"
									column="name" itemValue="id" :defaultValue="product_final_id"
									:getSelect="getSelectProductFinal" />
							</v-col>

							<v-col cols="12" class="mt-2">
								<v-text-field v-model="quantity" :rules="quantityRules" suffix="Kg" label="Cantidad" required
									placeholder="Ingresa la cantidad a despachar">
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
// import PurchasesExportPdf from '../components/PurchasesOrderExportPdf.vue';

export default {
	components: {
		DialogFullScreen, DataTable, DialogBasic,
		SnackbarApp, DialogConfirm, AutocompleteForm, // PurchasesExportPdf
	},

	props: ["order_id", "active", "hide"],

	data() {
		return {
			valid: true,
			dialog: null,
			menu: false,

			id: null,
			product_final_id: null,
			quantity: null,
			due_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
			observations: null,

			quantityRules: [
				v => !!v || 'Este campo es requerido!!',
				v => /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/gm.test(v) || 'La cantidad a ingresar no es correcta'
			],
	

			order: {},
			receiver: {},

			headers: [
				//{ text: 'ID', align: 'start', value: 'id' },
				{ text: 'Producto Final', value: 'product_final' },
				{ text: 'Cantidad', value: 'quantity' },
				{ text: 'Creado el ', value: 'created_at' },
				//{ text: 'Actualizado el', value: 'updated_at' },
				{ text: 'Acciones', value: 'actions' }
			],

			buttonsToolbar: [
				{
					id: "approvate",
					color: "white",
					icon: "truck-delivery-outline",
					text: "Despachar",
					action: this.approve,
				},
			],

			colorAlert: null,
			iconAlert: null,
			textAlert: null,
		};
	},

	watch: {
		async order_id() {
			await this.getDetails();
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
					let response = await window.axios.get(`dispatches_items/${id}`);

					if (response.status == 200) {
						this.id = response.data.id;
						this.product_final_id = response.data.product_final_id;
						this.quantity = response.data.quantity;
					}
				}
				this.dialog = dialog;
			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}

		},

		async getDetails() {
			try {



				let order = await window.axios.get(`dispatches/${this.order_id}`);

				if (order.status == 200) {
					this.order = order.data;
					this.observations = this.order.observation;

					let receiver = await window.axios.get(`receivers/${this.order.receiver_id}`);
					if (receiver.status == 200)
						this.receiver = receiver.data;
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
			this.product_final_id = null;
			this.quantity = null;
			this.getDetails();
			this.dialog = null;
		},

		validate() {
			if (this.$refs.form.validate() && this.dialog == 'new')
				this.create();

			if (this.$refs.form.validate() && this.dialog == 'edit')
				this.update();

		},

		getSelectProductFinal(id) {
			this.product_final_id = id;
		},

		formatNumber: function (number) {
			return new Intl.NumberFormat('es-US', { style: 'decimal' }).format(number);
		},


		async create() {
			try {
				let response = await window.axios.post('dispatches_items', {
					product_final_id: this.product_final_id,
					quantity: this.quantity,
					dispatch_id: this.order_id
				});

				if (response.status != 201)
					throw new Error(response.message);

				this.getDetails();
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
				let response = await window.axios.post(`set_dispatch_observation/${this.order_id}`, {
					observation: this.observations,
				});

				if (response.status != 202)
					throw new Error(response.message);

				this.alertApp("success", "check", response.data);

				this.getDetails();

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async approve() {
			try {
				let response = await window.axios.get(`approve_dispatch/${this.order_id}`);

				if (response.status != 202)
					throw new Error(response.message);

				this.alertApp("success", "check", response.data);

				this.getDetails();

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async update() {
			try {
				let response = await window.axios.put(`dispatches_items/${this.id}`, {
					product_final_id: this.product_final_id,
					quantity: this.quantity,
				});

				if (response.status != 202)
					throw new Error(response.message);

				this.getDetails();
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
				let response = await window.axios.delete(`dispatches_items/${this.id}`);

				if (response.status != 204)
					throw new Error(response.message);

				this.getDetails();
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