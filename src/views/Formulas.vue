<template>
	<div>
		<AppBar />

		<!-- Tabla de datos -->
		<data-table ref="gridbox" url="formulas" :headers="headers" title="Formulas para Producción" :add="openDialog"
			:update="openDialog" :destroy="openDialog" :show="openFullDialog"></data-table>

		<!-- Dialogo de confirmacion antes de eliminar -->
		<dialog-confirm :active="dialog == 'delete'" :confirm="destroyFormula" :cancel="cleanForm">
			<template v-slot:dialog-title>Eliminar Formula?</template>
			<template v-slot:dialog-content><span class="headline">Esta seguro de que desea eliminar la siguiente
					formula?</span></template>
		</dialog-confirm>

		<!-- DIalogo para crear o actualizar -->
		<dialog-basic :active="dialog == 'new' || dialog == 'edit'">
			<template v-slot:dialog-title>
				<span>{{ dialog == 'edit' ? 'Editar Formula' : 'Nueva Formula'}}</span>
			</template>

			<template v-slot:dialog-content>

				<v-form ref="form" v-model="valid" lazy-validation>
					<v-row>

						<v-col cols="12" class="mt-2">
							<v-text-field v-model="name" :rules="nameRules" label="Nombre" required
								placeholder="Ingresa el nombre de la formula"></v-text-field>
						</v-col>

						<v-col cols="6" class="mt-2">
							<autocomplete-form uri="/lines_productions" label="Selecciona la linea de Producción"
								column="name" itemValue="id" :defaultValue="line_id" :getSelect="getSelectLine" />
						</v-col>

						<v-col cols="6" class="mt-2">
							<v-text-field v-model="quantity_batch" :rules="quantityBatchRules"
								label="Cantidad por Batch" required placeholder="Ingresa la cantidad por batch"
								suffix="Kg"></v-text-field>
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
		<formulas-items :active="dialogFull" :hide="closeDialogFull" :formula_id="formula_id"></formulas-items>

	</div>


</template>

<script>
import AppBar from '../components/AppBar.vue';
import SnackbarApp from '../components/SnackbarApp.vue';

import DataTable from '../components/DataTable.vue';
import AutocompleteForm from '../components/autocomplete-form.vue';
import DialogBasic from '../components/Dialog/DialogBasic.vue';
import DialogConfirm from '../components/Dialog/DialogConfirm.vue';
import FormulasItems from '../views/FormulasItems.vue';
export default {
	components: {
		AppBar, SnackbarApp,
		DataTable, DialogBasic, DialogConfirm, AutocompleteForm, FormulasItems
	},

	data() {
		return {
			dialog: null,
			dialogFull: false,
			valid: true,

			id: null,
			formula_id: null,

			name: null,
			nameRules: [v => !!v || 'Este campo es requerido!!'],

			line_id: null,
			lineRules: [v => !!v || 'Este campo es requerido!!'],

			quantity_batch: null,
			quantityBatchRules: [
				v => !!v || 'Nº de Guia Sada es requerido!!',
				v => /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/gm.test(v) || 'La cantidad a ingresar no es correcta'
			],


			headers: [
				{ text: 'Codigo', align: 'start', value: 'id' },
				{ text: 'Nombre', value: 'name' },
				{ text: 'Linea', value: 'line' },
				//{ text: 'Cantida por Batch', value: 'quantity_batch' },
				{ text: 'Total en la Formula', value: 'total_formula' },
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

					let response = await window.axios.get(`formulas/${id}`);

					this.id = response.data.id;
					this.name = response.data.name;
					this.line_id = response.data.line_id;
					this.quantity_batch = response.data.quantity;
					this.total_formula = response.data.total_formula;
				}
				this.dialog = dialog;
			} catch (error) {
				this.alertApp('error', 'alert', error.response.data.message);
			}

		},

		openFullDialog(id) {
			this.formula_id = id;
			this.dialogFull = true;
		},

		closeDialogFull() {
			this.dialogFull = false;
			this.$refs.gridbox.getDataFromApi();
		},

		closeDialog() {
			this.$refs.form.reset();
			this.dialog = null;
		},

		cleanForm() {
			this.id = null;
			this.name = null;
			this.line_id = null;
			this.quantity_batch = null;
			this.dialog = null;
		},

		validate() {
			if (this.$refs.form.validate() && this.dialog == 'new')
				this.create();

			if (this.$refs.form.validate() && this.dialog == 'edit')
				this.update();

		},

		getSelectLine(id) {
			this.line_id = id;
		},

		async create() {
			try {
				let response = await window.axios.post('formulas', {
					name: this.name,
					line_id: this.line_id,
					quantity_batch: this.quantity_batch,
				});

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
				let response = await window.axios.put(`formulas/${this.id}`, {
					name: this.name,
					line_id: this.line_id,
					quantity_batch: this.quantity_batch,
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

		async destroyFormula() {
			try {
				let response = await window.axios.delete(`formulas/${this.id}`);

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
				this.cleanForm();
				this.dialog = null;
			}
		}
	}
}
</script>