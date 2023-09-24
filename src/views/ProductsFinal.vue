<template>
	<div>
		<AppBar />

		<!-- Tabla de datos -->
		<data-table ref="gridbox" url="products_finals" :headers="headers" title="Productos Terminados"
			:add="openDialog"></data-table>

		<!-- DIalogo para crear o actualizar -->
		<dialog-basic :active="dialog == 'new' || dialog == 'edit'">
			<template v-slot:dialog-title>
				<span>{{ dialog == 'edit' ? 'Editar el Producto Final' : 'Nuevo Producto Final'}}</span>
			</template>

			<template v-slot:dialog-content>

				<v-form ref="form" v-model="valid" lazy-validation>
					<v-row>

						<v-col cols="12" lg="6" md="6" sm="6"  class="mt-2">
							<v-text-field v-model="name" :rules="nameRules" label="Nombre" required
								placeholder="Ingresa el numero del Producto"></v-text-field>
						</v-col>

						<v-col cols="12" lg="6" md="6" sm="6"  class="mt-2">
							<v-text-field v-model="stock" :rules="stockRules" label="Existencia" required
								placeholder="Ingresa la existencia del producto" suffix="Kg"></v-text-field>
						</v-col>

						<v-col cols="12" lg="6" md="6" sm="6"  class="mt-2">
							<v-text-field v-model="presentation" :rules="stockRules" label="Presentación" required
								placeholder="Ingresa la existencia del producto"></v-text-field>
						</v-col>

						<v-col cols="12" lg="6" md="6" sm="6" class="mt-2">
							<v-select v-model="type" :items="items" label="Selecciona el tipo de Producto"></v-select>
					
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
export default {
	components: {
		AppBar, SnackbarApp,
		DataTable, DialogBasic
	},

	data() {
		return {
			dialog: null,
			valid: true,

			id: null,
			name: null,
			stock: null,
			type: null,
			presentation: null,

			nameRules: [v => !!v || 'Este campo es requerido!!'],
			stockRules: [
				v => !!v || 'Este campo es requerido!!',
				v => /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/gm.test(v) || 'La existencia no es correcta'
			],

			items: [
				'Institucional', 'Comercial'
			],

			headers: [
				//{ text: 'ID', align: 'start', value: 'id' },
				{ text: 'Nombre', value: 'name' },
				{ text: 'Tipo', value: 'type' },
				{ text: 'Existencia', value: 'stock' },
				{ text: 'Creado el ', value: 'created_at' },
				{ text: 'Actualizado el', value: 'updated_at' },
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

				/*
				if (id != null) {
					let response = await window.axios.get(`primaries_products/${id}`);

					this.id = response.data.id;
					this.name = response.data.name;
					this.stock = response.data.stock;

				}
				*/
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
			this.type = null;
			this.presentation = null;
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

				let response = await window.axios.post('products_finals', {
					name: this.name,
					stock: parseInt(this.stock),
					type: this.type,
					presentation: this.presentation
				});
				console.log(response);

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
	}
}
</script>