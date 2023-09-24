<template>

	<v-container>
		<AppBar />

		<v-data-table :headers="headers" :items="employes" sort-by="calories" class="elevation-0 ms-n5 mt-n9"
			hide-default-footer @page-count="pageCount = $event" :page.sync="page" :items-per-page="16"
			:search="search">
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Personal De la Planta</v-toolbar-title>
					<v-divider class="mx-4" inset vertical></v-divider>

					<v-scroll-x-reverse-transition>

						<v-text-field v-show="hidden" v-model="search" append-icon="mdi-magnify" label="Buscar"
							single-line hide-details></v-text-field>

					</v-scroll-x-reverse-transition>

					<v-spacer></v-spacer>

					<v-dialog v-model="dialog" max-width="580px">

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
											<v-text-field v-model="editedItem.name" label="Nombres"></v-text-field>
										</v-col>

										<v-col cols="6">
											<v-text-field v-model="editedItem.lastname" label="Apellidos">
											</v-text-field>
										</v-col>

										<v-col cols="6">
											<v-text-field prepend-icon="mdi-card-account-details"
												v-model="editedItem.cedula" type="number" label="Nº de Cedula">
											</v-text-field>
										</v-col>

										<v-col cols="6">
											<v-select :items="genere" v-model="editedItem.genere"
												label="Selecciona el Sexo"></v-select>
										</v-col>

										<v-col cols="6">
											<autocomplete-form uri="/get_positions" label="Selecciona el Cargo"
												column="name" itemValue="id" :defaultValue="editedItem.position_id"
												:getSelect="getSelectPosition" :key="key_component" />
										</v-col>

										<v-col cols="6">

											<v-menu ref="menu" v-model="menu" :close-on-content-click="false"
												:return-value.sync="editedItem.data_admission"
												transition="scale-transition" offset-y min-width="auto">
												<template v-slot:activator="{ on, attrs }">
													<v-text-field v-model="editedItem.data_admission"
														label="Fecha de Ingreso" prepend-icon="mdi-calendar" readonly
														v-bind="attrs" v-on="on"></v-text-field>
												</template>
												<v-date-picker v-model="editedItem.data_admission" no-title scrollable>
													<v-spacer></v-spacer>
													<v-btn text color="primary" @click="menu = false">
														Cancel
													</v-btn>
													<v-btn text color="primary"
														@click="$refs.menu.save(editedItem.data_admission)">
														OK
													</v-btn>
												</v-date-picker>
											</v-menu>
										</v-col>

										<v-col cols="6">
											<autocomplete-form uri="/get_provinces" label="Selecciona el Estado"
												column="name" itemValue="id" :defaultValue="editedItem.province_id"
												:getSelect="getSelectProvince" :key="key_component" />
										</v-col>


										<v-col cols="6">
											<autocomplete-form
												:uri="'/get_cities_of_provinces/' + editedItem.province_id"
												label="Selecciona la Ciudad" column="name" itemValue="id"
												:defaultValue="editedItem.city_id" :getSelect="getSelectCity"
												:key="key_component" />
										</v-col>

										<v-col cols="6">
											<v-text-field prepend-icon="mdi-home" v-model="editedItem.address"
												label="Direccion"></v-text-field>
										</v-col>

										<v-col cols="6">

											<v-menu ref="menus" v-model="menus" :close-on-content-click="false"
												:return-value.sync="editedItem.date_brith" transition="scale-transition"
												offset-y min-width="auto">
												<template v-slot:activator="{ on, attrs }">
													<v-text-field v-model="editedItem.date_brith"
														label="Fecha de Nacimiento" prepend-icon="mdi-calendar" readonly
														v-bind="attrs" v-on="on"></v-text-field>
												</template>
												<v-date-picker v-model="editedItem.date_brith" no-title scrollable>
													<v-spacer></v-spacer>
													<v-btn text color="primary" @click="menus = false">
														Cancel
													</v-btn>
													<v-btn text color="primary"
														@click="$refs.menus.save(editedItem.date_brith)">
														OK
													</v-btn>
												</v-date-picker>
											</v-menu>
										</v-col>

										<v-col cols="6">
											<v-text-field v-model="editedItem.nacionality" label="Nacionalidad">
											</v-text-field>
										</v-col>

										<v-col cols="6">
											<v-text-field prepend-icon="mdi-phone" v-model="editedItem.phone"
												label="Telefono"></v-text-field>
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
							<v-card-title class="text-h5">Estas seguro que deseas eliminar este Empleado?</v-card-title>
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

	</v-container>
</template>

<script>
import AppBar from '../components/AppBar.vue';
import SnackbarApp from '../components/SnackbarApp.vue';
import AutocompleteForm from '../components/autocomplete-form.vue';
export default {
	name: 'Employes',
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
				{ text: 'Nombre', value: 'name', width: 100 },
				{ text: 'Apellido', value: 'lastname', width: 100 },
				{ text: 'Cedula', value: 'cedula' },
				{ text: 'Genero', value: 'genere', width: 100 },
				{ text: 'Cargo', value: 'position', width: 100 },
				{ text: 'Fecha de Ingreso', value: 'data_admission', width: 150 },
				{ text: 'Direccion', value: 'address', width: 100 },
				{ text: 'Ciudad', value: 'city', width: 100 },
				{ text: 'Estado', value: 'province', width: 100 },
				{ text: 'Nacionalidad', value: 'nacionality', width: 130 },
				{ text: 'Telefono', value: 'phone' },
				{ text: 'Fecha de Nacimiento', value: 'date_brith', width: 120 },
				{ text: 'Actualizado', value: 'updated_at', width: 120 },
				{ text: 'Acciones', value: 'actions', sortable: false },
			],

			genere: [
				{ text: 'Hombre', value: 1 },
				{ text: 'Mujer', value: 2 }
			],

			employes: [],
			editedIndex: -1,
			editedItem: {},

			key_component: 0,

			menu: false,
			menus: false,

			textAlert: null,
			colorAlert: null,
			iconAlert: null,
		};
	},

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'Registrar Nuevo Personal de Planta' : 'Actualizar Datos de Personal de Planta';
		}
	},


	created() {
		this.initialize();
		this.cleanForm();
	},

	methods: {

		initialize: async function () {
			try {
				let response = await window.axios.get('/employes');

				if (response.status == 200)
					this.employes = response.data;
				else
					throw new Error(response.data);

				if (Math.round(Object.keys(this.employes).length / 16) >= 1)
					this.pageCount = Math.round(Object.keys(this.employes).length / 16);

			} catch (error) {
				console.error(error.message)

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
				lastname: '',
				position_id: '',
				cedula: '',
				data_admission: '',
				address: '',
				city_id: '',
				province_id: '',
				nacionality: '',
				phone: '',
				genere: '',
				date_brith: ''
			};

			this.key_component++;


		},

		getSelectPosition: function (id) {
			this.$set(this.editedItem, 'position_id', id);
			//this.editedItem.position_id = id;
		},

		getSelectProvince: function (id) {
			this.$set(this.editedItem, 'province_id', id);
			//this.editedItem.province_id = id;
		},

		getSelectCity: function (id) {
			this.$set(this.editedItem, 'city_id', id);
			//this.editedItem.city_id = id;
		},

		alertApp: function (color, icon, text) {
			this.colorAlert = color;
			this.iconAlert = icon;
			this.textAlert = text;
		},

		editItem: async function (item) {
			try {
				this.editedIndex = item.id;

				let response = await window.axios.get(`/employes/${item.id}`);

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

				let response = await window.axios.get(`/employes/${item.id}`);

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

				let response = await window.axios.delete(`/employes/${this.editedIndex}`);

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

				if (this.editedIndex > -1)
					response = await window.axios.put(`/employes/${this.editedItem.id}`, this.editedItem);
				else
					response = await window.axios.post('/employes', this.editedItem);


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