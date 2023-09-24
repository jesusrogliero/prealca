<template>
	<div>
		<AppBar />

		<!-- Tabla de datos -->
		<data-table  ref="gridbox" url="providers" :headers="headers" title="Provedores" :add="openDialog" :update="openDialog"
			:destroy="openDialog"></data-table>

		<!-- Dialogo de confirmacion antes de eliminar -->
		<dialog-confirm :active="dialog == 'delete'" :confirm="destroyProvider" :cancel="cleanForm">
			<template v-slot:dialog-title>Eliminar Provedor?</template>
			<template v-slot:dialog-content><span class="headline">Esta seguro de que desea eliminar el siguiente
					Provedor?</span></template>
		</dialog-confirm>

		<!-- DIalogo para crear o actualizar -->
		<dialog-basic :active="dialog == 'new' || dialog == 'edit'">
			<template v-slot:dialog-title>
				<span>{{dialog == 'edit' ? 'Editar Provedor' : 'Nuevo Provedor'}}</span>
			</template>

			<template v-slot:dialog-content>

				<v-form ref="form" v-model="valid" lazy-validation>
					<v-row>

						<v-col  cols="12" lg="5" md="5" sm="5" class="mt-2">
							<v-text-field v-model="name" :rules="nameRules" label="Nombre" required
								placeholder="Ingresa el nombre del provedor"></v-text-field>
						</v-col>

						<v-col cols="3" lg="2" md="2" sm="2" class="mt-2">
							<autocomplete-form uri="/types_identities" label="Tipo" column="type" itemValue="id"
								:defaultValue="type_identity_id" :getSelect="getSelectTypeIdentity" />
						</v-col>

						<v-col cols="9" lg="5" md="5" sm="5" class="mt-2">
							<v-text-field v-model="identity" :rules="identityRules" label="Nro de Identificación"
								required placeholder="Ingresa el nro de identificación"></v-text-field>
						</v-col>

						<v-col cols="6" class="mt-2">
							<v-text-field v-model="phone" :rules="phoneRules" label="Telefono" required
								placeholder="Ingresa el telefono del proveedor"></v-text-field>
						</v-col>

						<v-col cols="6" class="mt-2">
							<v-text-field v-model="address" :rules="addressRules" label="Dirección" required
								placeholder="Ingresa el telefono del proveedor"></v-text-field>
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
import AutocompleteForm from '../components/autocomplete-form.vue';
import DialogBasic from '../components/Dialog/DialogBasic.vue';
import DialogConfirm from '../components/Dialog/DialogConfirm.vue';
export default {
	components: {
		AppBar, SnackbarApp,
		DataTable, DialogBasic, DialogConfirm, AutocompleteForm
	},

	data() {
		return {
			dialog: null,
			valid: true,

			id: null,

			name: null,
			type_identity_id: null,
			identity: null,
			phone: null,
			address: null,

			nameRules: [v => !!v || 'Este campo es requerido!!'],
			TypeIdentityRules: [v => !!v || 'Este campo es requerido!!'],
			identityRules: [v => !!v || 'Este campo es requerido!!'],
			phoneRules: [v => !!v || 'Este campo es requerido!!'],
			addressRules: [v => !!v || 'Este campo es requerido!!'],

			headers: [
				{ text: 'ID', align: 'start', value: 'id' },
				{ text: 'Nombre', value: 'name' },
				{ text: 'Identidad', value: 'identity' },
				{ text: 'Dirección', value: 'address' },
				{ text: 'Telefono', value: 'phone' },
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
					let response = await window.axios.get(`providers/${id}`);

					this.id = response.data.id;
					this.name = response.data.name;
					this.type_identity_id = response.data.type_identity_id;
					this.identity = response.data.identity;
					this.phone = response.data.phone;
					this.address = response.data.address;
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
			this.type_identity_id = null;
			this.identity = null;
			this.phone = null;
			this.address = null;
			this.dialog = null;
		},

		validate() {
			if (this.$refs.form.validate() && this.dialog == 'new')
				this.create();

			if (this.$refs.form.validate() && this.dialog == 'edit')
				this.update();

		},

		getSelectTypeIdentity(id) {
			this.type_identity_id = id;
		},

		async create() {
			try {
				let response = await window.axios.post('providers', {
					name: this.name,
					type_identity_id: this.type_identity_id,
					identity: this.identity,
					phone: this.phone,
					address: this.address
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
				let response = await window.axios.put(`providers/${this.id}`, {
					name: this.name,
					type_identity_id: this.type_identity_id,
					identity: this.identity,
					phone: this.phone,
					address: this.address,
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

		async destroyProvider() {
			try {
				let response = await window.axios.delete(`providers/${this.id}`);

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