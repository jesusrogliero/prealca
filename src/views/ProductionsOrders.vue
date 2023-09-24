<template>
	<div>
		<AppBar />

		<!-- Tabla de datos -->
		<data-table ref="gridbox" url="productions_orders" :headers="headers" title="Ordenes de Producción"
			:add="openDialog" :update="openDialog" :destroy="openDialog" :show="openFullDialog"></data-table>

		<!-- Dialogo de confirmacion antes de eliminar -->
		<dialog-confirm :active="dialog == 'delete'" :confirm="destroyOrder" :cancel="cleanForm">
			<template v-slot:dialog-title>Eliminar la Orden de Producción?</template>
			<template v-slot:dialog-content>
				<p class="headline tea,amxt-wrap">Al eliminar esta orden de producción
					tambien se eliminaran los registros de consumos <br><strong>¿Deseas continuar?</strong>
				</p>
			</template>
		</dialog-confirm>

		<!-- DIalogo para crear o actualizar -->
		<dialog-basic :active="dialog == 'new' || dialog == 'edit'">
			<template v-slot:dialog-title>
				<span >{{ dialog == 'edit' ? 'Editar Orden de Producción' : 'Orden de Producción' }}</span>
			</template>

			<template v-slot:dialog-content>

				<v-form ref="form" v-model="valid" lazy-validation>
					<v-row>

						<v-col cols="12" lg="12" md="6" sm="12" class="mt-2">
							<autocomplete-form uri="/get_products_finals" label="Selecciona un Producto Terminado"
								column="name" itemValue="id" :defaultValue="product_final_id"
								:getSelect="getSelectProductFinal" />
						</v-col>


						<v-col cols="12" lg="12" md="6" sm="12" class="mt-2">
							<autocomplete-form uri="/formulas" label="Selecciona la formula" column="name"
								itemValue="id" :defaultValue="formula_id" :getSelect="getSelectFormula" />
						</v-col>



						<v-col cols="12" lg="12" md="6" sm="12" class="mt-2">
							<v-text-field v-model="quantity" :rules="quantityRules" suffix="Kg"
								label="Cantidad Solicitada" required
								placeholder="Ingresa la cantidad a producir"></v-text-field>
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

		<!-- Dialogo de consumo de produccion -->
		<production-consumption-dialog :active="dialogFull" :hide="closeDialogFull"
			:production_order_id="production_order_id"></production-consumption-dialog>

	</div>


</template>

<script>
import AppBar from '../components/AppBar.vue';
import SnackbarApp from '../components/SnackbarApp.vue';

import DataTable from '../components/DataTable.vue';
import DialogBasic from '../components/Dialog/DialogBasic.vue';
import DialogConfirm from '../components/Dialog/DialogConfirm.vue';
import AutocompleteForm from '../components/autocomplete-form.vue';

import ProductionConsumptionDialog from './ProductionConsumptionDialog.vue';
export default {
	components: {
		AppBar, SnackbarApp,
		DataTable, DialogBasic, DialogConfirm, AutocompleteForm,
		ProductionConsumptionDialog
	},

	data() {
		return {
			dialog: null,
			valid: true,
			dialogFull: false,
			production_order_id: null,
			keycomponent: 0,

			id: null,
			product_final_id: null,
			quantity: null,
			formula_id: null,

			quantityRules: [
				v => !!v || 'Este campo es requerido!!',
				v => /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/gm.test(v) || 'La cantidad a ingresar no es correcta'
			],

			headers: [
				//{ text: 'ID', align: 'start', value: 'id' },
				{ text: 'Producto Final', value: 'product_final' },
				{ text: 'Formula', value: 'formula' },
				{ text: 'Cantidad', value: 'quantity' },
				{ text: 'Estado', value: 'state' },
				{ text: 'Creado el ', value: 'created_at' },
				//{ text: 'Actualizado el', value: 'updated_at' },
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
					let response = await window.axios.get(`productions_orders/${id}`);

					this.id = response.data.id;
					this.product_final_id = response.data.product_final_id;
					this.formula_id = response.data.formula_id;
					this.quantity = response.data.quantity;
					this.state_id = response.data.state_id;

				}
				this.dialog = dialog;
			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}

		},

		closeDialog() {
			this.$refs.form.reset();
			this.dialog = null;
		},

		async openFullDialog(id) {
			this.production_order_id = id;
			this.dialogFull = true;
		},

		async closeDialogFull() {
			this.dialogFull = false;
			await this.$refs.gridbox.getDataFromApi();
			this.keycomponent++;
		},

		cleanForm() {
			this.id = null;
			this.product_final_id = null;
			this.quantity = null;
			this.formula_id = null;
			this.state_id = null;
			this.dialog = null;
		},

		validate() {
			if (this.$refs.form.validate() && this.dialog == 'new')
				this.create();

			if (this.$refs.form.validate() && this.dialog == 'edit')
				this.update();

		},

		getSelectProductFinal(id) {
			this.product_final_id = id
		},

		getSelectFormula(id) {
			this.formula_id = id
		},

		async create() {
			try {

				let response = await window.axios.post('productions_orders', {
					product_final_id: this.product_final_id,
					formula_id: this.formula_id,
					state_id: this.state_id,
					quantity: this.quantity,
				});

				if (response.status != 201)
					throw new Error(response.data.message);

				this.alertApp("success", "check", response.data);

				await this.$refs.gridbox.getDataFromApi();

			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);

			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async update() {
			try {
				let response = await window.axios.put(`productions_orders/${this.id}`, {
					product_final_id: this.product_final_id,
					formula_id: this.formula_id,
					state_id: this.state_id,
					quantity: this.quantity,
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
				let response = await window.axios.delete(`productions_orders/${this.id}`);

				if (response.status != 204)
					throw new Error(response.message);

				this.alertApp("success", "check", 'Eliminado Correctamente');
				await this.$refs.gridbox.getDataFromApi();

			} catch (error) {
				if (error.response.data.code == 23000)
					this.alertApp('error', 'alert', 'Este registro no puede ser eliminado');
				else
					this.alertApp('error', 'alert', error.response.data.message);
			} finally {
				this.dialog = null;
			}
		}
	}
}
</script>