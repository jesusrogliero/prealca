<template>
	<div>
		<AppBar />

		<!-- Tabla de datos -->
		<data-table ref="gridbox" url="dispatches" :headers="headers" title="Despacho de Producto Terminado"
			:add="openDialog" :update="openDialog" :destroy="openDialog" :show="openFullDialog"></data-table>

		<!-- Dialogo de confirmacion antes de eliminar -->
		<dialog-confirm :active="dialog == 'delete'" :confirm="destroyOrder" :cancel="cleanForm">
			<template v-slot:dialog-title>Eliminar Registro</template>
			<template v-slot:dialog-content><span class="headline">Esta seguro de que desea eliminar el siguiente
					registro?</span></template>
		</dialog-confirm>

		<!-- DIalogo para crear o actualizar -->
		<dialog-basic :active="dialog == 'new' || dialog == 'edit'">
			<template v-slot:dialog-title>
				<span>{{ dialog == 'edit' ? 'Editar Orden de Despacho' : 'Nueva Orden de Despacho' }}</span>
			</template>

			<template v-slot:dialog-content>

				<v-form ref="form" v-model="valid" lazy-validation>
					<v-row>

						<v-col cols="12" lg="6" md="6" sm="6" class="mt-2">
							<autocomplete-form uri="/receivers" label="Selecciona el receptor" column="name" itemValue="id"
								:defaultValue="receiver_id" :getSelect="getSelectReceiver" />
						</v-col>

						<v-col cols="6" lg="6" md="6" sm="6" class="mt-2">
							<v-text-field v-model="sica_code" :rules="requiredRules" label="Codigo Sica" required
								placeholder="Ingresa el Codigo Sica"></v-text-field>
						</v-col>

						<v-col cols="6" lg="6" md="6" sm="6" class="mt-2">
							<v-text-field v-model="guide_sada" :rules="requiredRules" label="Nº de Guia Sada" required
								placeholder="Ingresa el numero del a Guia Sada"></v-text-field>
						</v-col>

						<v-col cols="12" lg="6" md="6" sm="6" class="mt-2">
							<v-text-field v-model="observation" :rules="requiredRules" label="Observación" required
								placeholder="Ingresa una observación"></v-text-field>
						</v-col>

						<v-col cols="12">
							<span>Datos del Chofer</span>
							<v-divider></v-divider>
						</v-col>

						<v-col cols="6" lg="6" md="6" sm="6" class="mt-2">
							<v-text-field v-model="drive_name" :rules="requiredRules" label="Name" required
								placeholder="Ingresa nombre y apellido del chofer"></v-text-field>
						</v-col>

						<v-col cols="6" lg="6" md="6" sm="6" class="mt-2">
							<v-text-field v-model="drive_identity" type="number" prefix="V-" :rules="requiredRules"
								label="Nro de Identidad" required placeholder="Ingresa la Cedula del chofer"></v-text-field>
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
		<dispatches-items :active="dialogFull" :hide="closeDialogFull" :order_id="order_id"></dispatches-items>

	</div>
</template>

<script>
import AppBar from '../components/AppBar.vue';
import SnackbarApp from '../components/SnackbarApp.vue';

import DataTable from '../components/DataTable.vue';
import AutocompleteForm from '../components/autocomplete-form.vue';
import DialogBasic from '../components/Dialog/DialogBasic.vue';
import DialogConfirm from '../components/Dialog/DialogConfirm.vue';
import DispatchesItems from '../views/DispatchesItems.vue';

export default {
	components: {
		AppBar, SnackbarApp,
		DataTable, DialogBasic, DialogConfirm, AutocompleteForm, DispatchesItems
	},

	data() {
		return {
			dialog: null,
			dialogFull: false,
			valid: true,

			order_id: null,

			id: null,
			receiver_id: null,
			sica_code: null,
			sada_guide: null,
			observation: null,
			drive_name: null,
			drive_identity: null,

			requiredRules: [v => !!v || 'Este campo es requerido!!'],

			headers: [
				{ text: 'Codigo', align: 'start', value: 'id' },
				{ text: 'Receptor', value: 'receiver_name' },
				{ text: 'Nº Guia Sada', value: 'guide_sada' },
				{ text: 'Estado', value: 'state' },
				{ text: 'Codigo Sica', value: 'sica_code' },
				{ text: 'Total', value: 'total' },
				{ text: 'Chofer', value: 'drive_name' },
				{ text: 'Nro Identidad', value: 'drive_identity' },
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
					let response = await window.axios.get(`dispatches/${id}`);

					this.id = response.data.id;
					this.receiver_id = response.data.receiver_id;
					this.guide_sada = response.data.guide_sada;
					this.sica_code = response.data.sica_code;
					this.observation = response.data.observation;
					this.drive_name = response.data.drive_name;
					this.drive_identity = response.data.drive_identity;
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
			this.receiver_id = null;
			this.sada_guide = null;
			this.observation = null;
			this.drive_name = null;
			this.drive_identity = null;
			this.dialog = null;
		},

		validate() {
			if (this.$refs.form.validate() && this.dialog == 'new')
				this.create();

			if (this.$refs.form.validate() && this.dialog == 'edit')
				this.update();

		},

		getSelectReceiver(id) {
			this.receiver_id = id;
		},

		async create() {
			try {
				let response = await window.axios.post('dispatches', {
					receiver_id: this.receiver_id,
					sica_code: this.sica_code,
					guide_sada: this.guide_sada,
					observation: this.observation,
					drive_name: this.drive_name,
					drive_identity: this.drive_identity,
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
				let response = await window.axios.put(`dispatches/${this.id}`, {
					receiver_id: this.receiver_id,
					sica_code: this.sica_code,
					guide_sada: this.guide_sada,
					observation: this.observation,
					drive_name: this.drive_name,
					drive_identity: this.drive_identity,
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
				let response = await window.axios.delete(`dispatches/${this.id}`);

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