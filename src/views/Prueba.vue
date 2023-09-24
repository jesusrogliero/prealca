<template>
	<div>
		<AppBar />

		<!-- Tabla de datos -->
		<data-table url="cleaning_tools" :headers="headers" title="Insumos de Limpieza Y Desinfección" :add="openDialog"
			:update="openDialog" :destroy="openDialog">
			<template v-slot:dialog-btn></template>
		</data-table>

		<!-- Dialogo de confirmacion antes de eliminar -->
		<dialog-confirm :active="dialog == 'delete'" :confirm="destroyPrueba" :cancel="cleanForm">
			<template v-slot:dialog-title>Eliminar Registro</template>
			<template v-slot:dialog-content><span class="headline">Esta seguro de que desea eliminar el siguiente
					registro?</span></template>
		</dialog-confirm>

		<!-- DIalogo para crear o actualizar -->
		<dialog-basic :active="dialog == 'new' || dialog == 'edit'">
			<template v-slot:dialog-title>
				<span>{{dialog == 'edit' ? 'Editar Insumo de limpieza' : 'Nuevo Insumo de limpieza'}}</span>
			</template>

			<template v-slot:dialog-content>

				<v-form ref="form" v-model="valid" lazy-validation>
					<v-row>

						<v-col cols="6" class="mt-2">
							<v-text-field v-model="name" :rules="nameRules" label="Nombre" required
								placeholder="Ingresa el nombre del producto"></v-text-field>
						</v-col>

						<v-col cols="6" class="mt-2">
							<v-text-field out v-model="stock" :rules="stockRules" label="Existencia" required
								placeholder="Ingresa la existencia del producto"></v-text-field>
						</v-col>

						<v-col cols="12" class="mt-n3">
							<v-text-field v-model="description" :counter="50" :rules="descriptionRules"
								label="Descripción" placeholder="Ingresa la description del producto" required>
							</v-text-field>
						</v-col>

						<v-col cols="12" class="mt-n3">
							<v-text-field v-model="requirement" :counter="50" :rules="descriptionRules"
								label="Requerimientos" placeholder="Ingresa los requerimientos del producto" required>
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
			nameRules: [v => !!v || 'Este campo es requerido!!'],

			stock: null,
			stockRules: [
				v => !!v || 'Este campo es requerido!!',
				v => /^([1-9][0-9]+|[1-9])$/gm.test(v) || 'Ingrese una existencia correcta'
			],

			description: null,
			descriptionRules: [v => /^.{0,50}$/gm.test(v) || 'Descripcion muy extensa'],

			requirement: null,
			requirementRules: [v => /^.{0,50}$/gm.test(v) || 'Limite alcanzado'],

			headers: [
				{
					text: 'ID',
					align: 'start',
					sortable: false,
					value: 'id',
				},
				{ text: 'Nombre', value: 'name' },
				{ text: 'Existencia', value: 'stock' },
				{ text: 'descripción', value: 'description' },
				{ text: 'requerimientos', value: 'requirement' },
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
			this.dialog = null;

			if (id != null) {
				let response = await window.axios.get(`cleaning_tools/${id}`);

				this.id = response.data.id;
				this.name = response.data.name;
				this.stock = response.data.stock;
				this.description = response.data.description;
				this.requirement = response.data.requirement;
			}
			this.dialog = dialog;
		},

		closeDialog() {
			this.$refs.form.reset();
			this.dialog = null;
		},

		cleanForm() {
			this.id = null;
			this.name = null;
			this.stock = null;
			this.description = null;
			this.requirement = null;
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
				let response = await window.axios.post('cleaning_tools', {
					name: this.name,
					stock: this.stock,
					description: this.description,
					requirement: this.requirement
				});

				console.log(response);

				if (response.status != 201)
					throw new Error(response.message);

				this.alertApp("success", "check", response.data);


			} catch (error) {
				this.alertApp('error', 'alert', error.message);

			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async update() {
			try {
				let response = await window.axios.put(`cleaning_tools/${this.id}`, {
					name: this.name,
					stock: this.stock,
					description: this.description,
					requirement: this.requirement
				});

				if (response.status != 202)
					throw new Error(response.message);

				this.alertApp("success", "check", response.data);


			} catch (error) {
				this.alertApp('error', 'alert', error.message);

			} finally {
				this.$refs.form.reset();
				this.dialog = null;
			}

		},

		async destroyPrueba() {
			try {
				let response = await window.axios.delete(`cleaning_tools/${this.id}`);

				if (response.status != 204)
					throw new Error(response.message);

				this.alertApp("success", "check", 'Eliminado Correctamente');


			} catch (error) {
				this.alertApp('error', 'alert', error.message);

			} finally {

				this.dialog = null;
			}
		}
	}
}
</script>