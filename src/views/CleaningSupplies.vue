<template>

	<div class="ml-3">
		<AppBar />

		<v-data-table :headers="headers" :items="cleaning_supplies" sort-by="calories" class="elevation-0 ms-n5 mt-n9"
			hide-default-footer @page-count="pageCount = $event" :page.sync="page" :items-per-page="16"
			:search="search">
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Insumos de Limpieza Y Desinfección</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>

					<v-scroll-x-reverse-transition>

						<v-text-field v-show="hidden" v-model="search" append-icon="mdi-magnify" label="Buscar"
							single-line hide-details></v-text-field>

					</v-scroll-x-reverse-transition>

					<v-spacer></v-spacer>

					<v-dialog v-model="dialog" max-width="500px">

						<template v-slot:activator="{ on, attrs }">
							<v-btn color="primary" icon class="mb-2" v-bind="attrs" v-on="on">
								<v-icon>mdi-plus</v-icon>
							</v-btn>


							<v-btn color="primary" icon class="mb-2" v-bind="attrs" @click="initialize">
								<v-icon> mdi-reload </v-icon>
							</v-btn>


							<v-btn color="primary" icon class="mb-2" v-bind="attrs" @click="hidden = !hidden">
								<v-icon> mdi-magnify </v-icon>
							</v-btn>
						</template>

						<v-card>
							<v-card-title>
								<span class="text-h5">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>

								<v-container>
									<v-row>
										<v-col cols="6">
											<v-text-field v-model="editedItem.name" label="Nombre"></v-text-field>
										</v-col>

										<v-col cols="6">
											<v-text-field v-model="editedItem.stock" type="number" label="Existencia">
											</v-text-field>
										</v-col>

										<v-col cols="12">
											<v-text-field v-model="editedItem.description" label="Descripción">
											</v-text-field>
										</v-col>

										<v-col cols="6">
											<autocomplete-form uri="/presentations" label="Presentacion" column="name"
												itemValue="id" :defaultValue="editedItem.presentation_id"
												:getSelect="getSelectPresentation" :key="key_component" />
										</v-col>

										<v-col cols="6">
											<v-text-field v-model="editedItem.requirement" label="Requerimiento">
											</v-text-field>
										</v-col>

									</v-row>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="error" text @click="close"> Cancelar </v-btn>
								<v-btn color="success" text @click="save"> Guardar </v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>

					<v-dialog v-model="dialogDelete" max-width="600px">
						<v-card>
							<v-card-title class="text-h5">Estas seguro que deseas eliminar este Insumo?</v-card-title>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="error" text @click="closeDelete">Cancelar</v-btn>
								<v-btn color="success" text @click="deleteItemConfirm">Confirmar</v-btn>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<v-icon dense class="mr-2" @click="editItem(item)" color="primary"> mdi-pencil </v-icon>
				<v-icon dense @click="deleteItem(item)" color="error"> mdi-delete </v-icon>
			</template>

		</v-data-table>

		<div class="text-center pt-2" v-if="pageCount">
			<v-pagination v-model="page" :length="pageCount"></v-pagination>
		</div>


		<!-- Alerta de la app -->
		<snackbar-app :color="colorAlert" :text="textAlert" :icon="iconAlert"></snackbar-app>

	</div>
</template>

<script>
import AppBar from '../components/AppBar.vue';
import SnackbarApp from '../components/SnackbarApp.vue';
import AutocompleteForm from '../components/autocomplete-form.vue';
export default {
	name: 'CleaningSupplies',
	components: {
		AppBar, SnackbarApp, AutocompleteForm
	},
	data: function () {
		return {
			dialog: false,
			dialogDelete: false,
			page: 1,
			pageCount: 1,
			search: "",
			hidden: false,
			headers: [
				{
					text: 'ID',
					align: 'start',
					sortable: false,
					value: 'id',
				},
				{ text: 'Nombre', value: 'name' },
				{ text: 'Existencia', value: 'stock' },
				{ text: 'Descripcion', value: 'description' },
				{ text: 'Requerimiento', value: 'requirement' },
				{ text: 'Creado', value: 'created_at' },
				{ text: 'Actualizado', value: 'updated_at' },
				{ text: 'Acciones', value: 'actions', sortable: false },
			],
			cleaning_supplies: [],
			editedIndex: -1,
			editedItem: {},

			key_component: 0,


			textAlert: null,
			colorAlert: null,
			iconAlert: null,
		};
	},

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Nuevo Insumo de Limpieza' : 'Actualizar un Insumo de Limpieza';
		}
	},

	watch: {
		dialog(val) {
			val || this.close()
		},
		dialogDelete(val) {
			val || this.closeDelete()

		},
	},

	created() {
		this.initialize();
		this.cleanForm();
	},

	methods: {

		initialize: async function () {
			try {
				let response = await window.axios.get('/cleaning_Supplies');

				if (response.status == 200)
					this.cleaning_supplies = response.data;
				else
					throw new Error(response.data);

				if (Math.round(Object.keys(this.cleaning_Supplies).length / 16) >= 1)
					this.pageCount = Math.round(Object.keys(this.cleaning_Supplies).length / 16);

			} catch (error) {
				if (error.response.data.message != null)
					this.alertApp('error', 'alert', error.response.data.message);
				else
					this.alertApp('error', 'alert', error.message);
			}

		},

		cleanForm: function () {
			this.editedItem = {
				id: '',
				name: '',
				stock: '',
				description: '',
				presentation_id: '',
				requirement: ''
			};

			this.key_component++;
		},

		getSelectPresentation: function (id) {
			this.editedItem.presentation_id = id;
		},


		alertApp: function (color, icon, text) {
			this.colorAlert = color;
			this.iconAlert = icon;
			this.textAlert = text;
		},

		editItem: async function (item) {
			try {
				this.editedIndex = item.id;

				let response = await window.axios.get(`/cleaning_Supplies/${item.id}`);

				this.editedItem = response.data;
				this.dialog = true;

			} catch (error) {

				if (error.response.data.message != null)
					this.alertApp('error', 'alert', error.response.data.message);
				else
					this.alertApp('error', 'alert', error.message);
			}

		},

		deleteItem: async function (item) {
			try {
				this.editedIndex = item.id;

				let response = await window.axios.get(`/cleaning_Supplies/${item.id}`);

				if (response.status == 200)
					this.editedItem = response.data;

				this.dialogDelete = true
			} catch (error) {

				if (error.response.data.message != null)
					this.alertApp('error', 'alert', error.response.data.message);
				else
					this.alertApp('error', 'alert', error.message);
			}

		},

		deleteItemConfirm: async function () {
			try {

				let response = await window.axios.delete(`/cleaning_Supplies/${this.editedIndex}`);

				if (response.status == 204) {
					this.alertApp("success", "check", 'Eliminado Correctamente');
				}

				this.closeDelete();
			} catch (error) {

				if (error.response.data.message != null)
					this.alertApp('error', 'alert', error.response.data.message);
				else
					this.alertApp('error', 'alert', error.message);
			}

		},

		close() {
			this.dialog = false;

			this.initialize();
			this.cleanForm();
			this.editedIndex = -1;
		},

		closeDelete() {
			this.dialogDelete = false;
			this.initialize();
			this.cleanForm();
			this.editedIndex = -1;
		},

		save: async function () {
			try {
				let response = null;

				if (this.editedIndex > -1) {
					response = await window.axios.put(
						`/cleaning_Supplies/${this.editedItem.id}`, this.editedItem);
				} else {
					response = await window.axios.post('/cleaning_Supplies', this.editedItem);
				}

				if (response.status == 201 || response.status == 202) {
					this.alertApp("success", "check", response.data);
					this.close();
				}

			} catch (error) {

				if (error.response.data.message != null)
					this.alertApp('error', 'alert', error.response.data.message);
				else
					this.alertApp('error', 'alert', error.message);
			}


		},
	}
}
</script>