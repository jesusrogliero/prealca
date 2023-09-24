<template>
	<div>
		<AppBar />

		<!-- Tabla de datos -->
		<data-table ref="gridbox" url="purchases_orders" :headers="headers" title="Ingreso de Producto Primario" :add="openDialog"
			:update="openDialog" :destroy="openDialog" :show="openFullDialog" ></data-table>

		<!-- Dialogo de confirmacion antes de eliminar -->
		<dialog-confirm :active="dialog == 'delete'" :confirm="destroyOrder" :cancel="cleanForm">
			<template v-slot:dialog-title>Eliminar Registro</template>
			<template v-slot:dialog-content><span class="headline">Esta seguro de que desea eliminar el siguiente
					registro?</span></template>
		</dialog-confirm>

		<!-- DIalogo para crear o actualizar -->
		<dialog-basic :active="dialog == 'new' || dialog == 'edit'">
			<template v-slot:dialog-title>
				<span>{{dialog == 'edit' ? 'Editar orden de ingreso' : 'Nueva orden de ingreso'}}</span>
			</template>

			<template v-slot:dialog-content>

				<v-form ref="form" v-model="valid" lazy-validation>
					<v-row>

						<v-col cols="12" lg="6" md="6" sm="6" class="mt-2">
							<v-text-field v-model="nro_sada_guide" :rules="NroSadaGuideRules" label="Nº de Guia Sada"
								required placeholder="Ingresa el numero del a Guia Sada"></v-text-field>
						</v-col>

						<v-col cols="12" lg="6" md="6" sm="6" class="mt-2">
							<autocomplete-form uri="/providers" label="Selecciona un Provedor" column="name"
								itemValue="id" :defaultValue="provider_id" :getSelect="getSelectProvider" />
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

		<!-- Dialogo de detalle de una orden -->
		<purchases-orders-items :active="dialogFull" :hide="closeDialogFull" :order_id="order_id"></purchases-orders-items>

	</div>


</template>

<script>
import AppBar from '../components/AppBar.vue';
import SnackbarApp from '../components/SnackbarApp.vue';

import DataTable from '../components/DataTable.vue';
import AutocompleteForm from '../components/autocomplete-form.vue';
import DialogBasic from '../components/Dialog/DialogBasic.vue';
import DialogConfirm from '../components/Dialog/DialogConfirm.vue';
import PurchasesOrdersItems from '../views/PurchasesOrderItems.vue';
export default {
	components: {
		AppBar, SnackbarApp,
		DataTable, DialogBasic, DialogConfirm, AutocompleteForm, PurchasesOrdersItems
	},

	data() {
		return {
			dialog: null,
			dialogFull: false,
			valid: true,

			id: null,
			order_id: null,

			provider_id: null,
			providerIdRules: [v => !!v || 'Este campo es requerido!!'],

			nro_sada_guide: null,
			NroSadaGuideRules: [v => !!v || 'Nº de Guia Sada es requerido!!',],


			headers: [
				{ text: 'ID', align: 'start', value: 'id' },
				{ text: 'Nº Guia Sada', value: 'nro_sada_guide' },
				{ text: 'Estado', value: 'state' },
				{ text: 'Provedor', value: 'provider' },
				{ text: 'Total Productos', value: 'total_products' },
				{ text: 'Total No Coforme', value: 'total_nonconforming' },
				{ text: 'Creado el ', value: 'created_at' },
				{ text: 'Actualizado el', value: 'updated_at' },
				{ text: 'Acciones', value: 'actions' }
			],
			colorAlert: null,
			iconAlert: null,
			textAlert: null
		};
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
					let response = await window.axios.get(`purchases_orders/${id}`);

					this.id = response.data.id;
					this.provider_id = response.data.provider_id;
					this.nro_sada_guide = response.data.nro_sada_guide;

				}
				this.dialog = dialog;
			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}

		},

		openFullDialog(id) {
			this.order_id = id;
			this.dialogFull = true;
		},

		closeDialogFull() {
			this.dialogFull = false;
		},

		closeDialog() {
			this.$refs.form.reset();
			this.dialog = null;
		},

		cleanForm() {
			this.id = null;
			this.provider_id = null;
			this.nro_sada_guide = null;
			this.dialog = null;
		},

		validate() {
			if (this.$refs.form.validate() && this.dialog == 'new')
				this.create();

			if (this.$refs.form.validate() && this.dialog == 'edit')
				this.update();

		},

		getSelectProvider(id) {
			this.provider_id = id;
		},

		async create() {
			try {
				let response = await window.axios.post('purchases_orders', {
					provider_id: this.provider_id,
					nro_sada_guide: this.nro_sada_guide,
				});

				console.log(response);

				if (response.status != 201)
					throw new Error(response.message);

				await this.$refs.gridbox.getDataFromApi();
				this.alertApp("success", "check", response.data);

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async update() {
			try {
				let response = await window.axios.put(`purchases_orders/${this.id}`, {
					provider_id: this.provider_id,
					nro_sada_guide: this.nro_sada_guide,
				});

				if (response.status != 202)
					throw new Error(response.message);

				this.alertApp("success", "check", response.data);
				await this.$refs.gridbox.getDataFromApi();


			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async destroyOrder() {
			try {
				let response = await window.axios.delete(`purchases_orders/${this.id}`);

				if (response.status != 204)
					throw new Error(response.message);

				this.alertApp("success", "check", 'Eliminado Correctamente');
				await this.$refs.gridbox.getDataFromApi();

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.dialog = null;
			}
		}
	}
}
</script>