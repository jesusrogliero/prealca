<template>
	<div>
		<AppBar />

		<!-- Tabla de datos -->
		<data-table ref="gridbox" url="lines_productions" :headers="headers" title="Lineas De Producción" :add="openDialog"
			:update="openDialog" :destroy="openDialog" ></data-table>

		<!-- Dialogo de confirmacion antes de eliminar -->
		<dialog-confirm :active="dialog == 'delete'" :confirm="destroyOrder" :cancel="cleanForm">
			<template v-slot:dialog-title>Eliminar Linea de Producción?</template>
			<template v-slot:dialog-content><span class="headline">Esta seguro de que desea eliminar el siguiente
					registro?</span></template>
		</dialog-confirm>

		<!-- DIalogo para crear o actualizar -->
		<dialog-basic :active="dialog == 'new' || dialog == 'edit'" :max-width="360">
			<template v-slot:dialog-title>
				<span>{{dialog == 'edit' ? 'Editar Linea de Producción' : 'Nueva Linea de Producción'}}</span>
			</template>

			<template v-slot:dialog-content>

				<v-form ref="form" v-model="valid" lazy-validation>
					<v-row>

						<v-col cols="12" class="mt-2">
							<v-text-field v-model="name" :rules="nameRules" label="Nombre"
								required placeholder="Ingresa el nombre de la linea de producción"></v-text-field>
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

	</div>


</template>

<script>
import AppBar from '../components/AppBar.vue';
import SnackbarApp from '../components/SnackbarApp.vue';

import DataTable from '../components/DataTable.vue';
import DialogBasic from '../components/Dialog/DialogBasic.vue';
import DialogConfirm from '../components/Dialog/DialogConfirm.vue';
export default {
	components: {
		AppBar, SnackbarApp,
		DataTable, DialogBasic, DialogConfirm
	},

	data() {
		return {
			dialog: null,
			valid: true,

			id: null,
			name: null,
			stock: null,

			nameRules: [v => !!v || 'Este campo es requerido!!'],

			headers: [
				//{ text: 'ID', align: 'start', value: 'id' },
				{ text: 'Nombre', value: 'name' },
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
					let response = await window.axios.get(`lines_productions/${id}`);

					this.id = response.data.id;
					this.name = response.data.name;
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

		cleanForm() {
			this.id = null;
			this.name = null;
			this.stock = null;
			this.dialog = null;
		},

		validate() {
			if (this.$refs.form.validate() && this.dialog == 'new')
				this.create();

			if (this.$refs.form.validate() && this.dialog == 'edit')
				this.update();

		},

		async create() {
			try {
				
				let response = await window.axios.post('lines_productions', {
					name: this.name,
				});

				if (response.status != 201)
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

		async update() {
			try {
				let response = await window.axios.put(`lines_productions/${this.id}`, {
					name: this.name,
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
				let response = await window.axios.delete(`lines_productions/${this.id}`);

				if (response.status != 204)
					throw new Error(response.message);

				this.alertApp("success", "check", 'Eliminado Correctamente');
				await this.$refs.gridbox.getDataFromApi();

			} catch (error) {
				if(error.response.data.code == 23000 )
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