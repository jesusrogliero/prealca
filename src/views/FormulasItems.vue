<template>
	<dialog-full-screen :active="active" :hide="hide" color="red lighten-1" :buttonsToolbar="buttonsToolbar">
		<template v-slot:dialog-title>
			<span>Detalles de la Fomula</span>
		</template>

		<template v-slot:dialog-content>
			<data-table ref="gridbox" title="Lista de Ingredientes" :url="'get_formula_items/' + formula_id"
				:headers="headers" :add="openDialog" :update="openDialog" :destroy="openDialog"></data-table>


			<v-container>
				<v-row>
					<v-col cols="12" md="6" lg="4" class="card-info-invoice">
						<v-row>
							<v-col cols="12" class="text-center">
								<h3>Datos de la formula</h3>
							</v-col>
							<v-col cols="12">
								<b>Nombre: </b>
								<span class="float-right">{{ formula.name == null ? '-' : formula.name }}</span>
							</v-col>
							<v-col cols="12">
								<b>Cantidad x Batch: </b>
								<span class="float-right"> {{
									formula.quantity_batch == null ? '0 Kg' :
										formatNumber(formula.quantity_batch) + ' Kg'
								}}</span>
							</v-col>
							<v-col cols="12">
								<b>Cantidad total: </b>
								<span class="float-right"> {{(formula.total_formula == null ? '0 Kg' :
								formatNumber(formula.total_formula) + ' Kg')}}</span>
							</v-col>
						</v-row>
					</v-col>



				</v-row>
			</v-container>


			<!-- Dialogo de confirmacion antes de eliminar -->
			<dialog-confirm :active="dialog == 'delete'" :confirm="destroyItem" :cancel="cleanForm">
				<template v-slot:dialog-title>Eliminar el ingrediente</template>
				<template v-slot:dialog-content><span class="headline">Esta seguro de que desea eliminar el siguiente
						ingrediente?</span></template>
			</dialog-confirm>

			<!-- DIalogo para crear o actualizar -->
			<dialog-basic :active="dialog == 'new' || dialog == 'edit'">
				<template v-slot:dialog-title>
					<span>{{ dialog == 'edit' ? 'Editar el ingrediente' : 'Nuevo ingrediente' }}</span>
				</template>

				<template v-slot:dialog-content>

					<v-form ref="form" v-model="valid" lazy-validation>
						<v-row>

							<v-col cols="6" class="mt-2">
								<autocomplete-form uri="/primaries_products" label="Selecciona un Producto Primario"
									column="name" itemValue="id" :defaultValue="primary_product_id"
									:getSelect="getSelectPrimaryProduct" />
							</v-col>

							<v-col cols="6" class="mt-2">
								<v-text-field v-model="quantity" :rules="quantityRules" label="Cantidad" required
									placeholder="Ingresa la cantidad del articulo">
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

export default {
	components: {
		DialogFullScreen, DataTable, DialogBasic, SnackbarApp, DialogConfirm, AutocompleteForm
	},

	props: ["formula_id", "active", "hide"],

	data() {
		return {
			valid: true,
			dialog: null,
			menu: false,

			id: null,
			primary_product_id: null,
			quantity: null,


			quantityRules: [
				v => !!v || 'Este campo es requerido!!',
				v => /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/gm.test(v) || 'La cantidad a ingresar no es correcta'
			],

			formula: {},

			headers: [
				//{ text: 'ID', align: 'start', value: 'id', sortable: false},
				{ text: 'Producto Primario', value: 'primary_product' },
				{ text: 'Cantidad', value: 'quantity' },
				{ text: 'Creado el ', value: 'created_at' },
				{ text: 'Actualizado el', value: 'updated_at' },
				{ text: 'Acciones', value: 'actions', sortable: false }
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
		async formula_id() {
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
					let response = await window.axios.get(`formulas_items/${id}`);

					if (response.status == 200) {
						this.id = response.data.id;
						this.primary_product_id = response.data.primary_product_id;
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

				let formula = await window.axios.get(`formulas/${this.formula_id}`);
				this.formula = formula.data;
				await this.$refs.gridbox.getDataFromApi();

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
			this.getDetails();
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
				let response = await window.axios.post('formulas_items', {
					primary_product_id: this.primary_product_id,
					quantity: this.quantity,
					formula_id: this.formula_id
				});

				if (response.status != 201)
					throw new Error(response.message);

				this.getDetails();
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
				let response = await window.axios.put(`formulas_items/${this.id}`, {
					primary_product_id: this.primary_product_id,
					quantity: this.quantity,
				});

				if (response.status != 202)
					throw new Error(response.message);

				this.getDetails();
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
				let response = await window.axios.delete(`formulas_items/${this.id}`);

				if (response.status != 204)
					throw new Error(response.message);

				this.getDetails();
				this.alertApp("success", "check", 'Eliminado Correctamente');

			} catch (error) {
				if (error.response.data.code == 23000)
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