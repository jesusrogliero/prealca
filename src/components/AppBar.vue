<template>
	<v-container>
		<v-navigation-drawer v-model="drawer" temporary app width="320">
			<v-list>
				<v-list-item>
					<v-list-item-content>
						<v-list-item-title class="text-h6">
							{{ name }}
						</v-list-item-title>
						<v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
						<v-list-item-subtitle>Cargo: {{ role }}</v-list-item-subtitle>
					</v-list-item-content>

					<v-list-item-avatar>
						<v-img src="https://www.ibei.org/images/4611/person_box.png"></v-img>
					</v-list-item-avatar>
				</v-list-item>


			</v-list>

			<v-divider></v-divider>

			<v-list nav>

				<v-list-item-group active-class="red--text text--accent-4">

					<v-list-item link @click="toDashboard">
						<v-list-item-icon>
							<v-icon>mdi-view-dashboard</v-icon>
						</v-list-item-icon>
						<v-list-item-title class="ml-n4">Dashboard</v-list-item-title>
					</v-list-item>


					<v-list-group active-class="red--text text--accent-4" prepend-icon="mdi-warehouse">
						<template v-slot:activator>
							<v-list-item-title class="ml-n4">Almacén</v-list-item-title>
						</template>

						<v-list-item link @click="toProviders" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-account-group</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Provedores</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toPurchases" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-forklift</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Ingreso de Materia Prima</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toProductsFinalsToWarehouses" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-content-save-move</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4 text-wrap">Entrega de Producto Final a almacen</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toDispatches" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-truck-delivery</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4 text-wrap">Despachos</v-list-item-title>
						</v-list-item>


						<v-list-item link @click="toPrimariesProducts" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-food-apple-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Productos Primarios</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toProductsFinals" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-clipboard-check-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Productos Finales</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toSuppliesMinors" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-text-box-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Insumos Menores</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toProductsNoConforming" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-warehouse</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4 text-wrap">Productos Primarios No
								Conformes</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toSuppliesMinorsNoconform" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-warehouse</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4 text-wrap">Insumos Menores No Conformes</v-list-item-title>
						</v-list-item>

					</v-list-group>


					<v-list-group active-class="red--text text--accent-4" prepend-icon="mdi-clipboard-list-outline">
						<template v-slot:activator>
							<v-list-item-title class="ml-n4">Producción</v-list-item-title>
						</template>

						<v-list-item link class="ml-4 mr-4" @click="toProductionsOrders">
							<v-list-item-icon>
								<v-icon>mdi-truck</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Orden de Produccion</v-list-item-title>
						</v-list-item>

						<v-list-item link class="ml-4 mr-4" @click="toFormulas">
							<v-list-item-icon>
								<v-icon>mdi-clipboard-list-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Formulas</v-list-item-title>
						</v-list-item>

						<v-list-item link class="ml-4 mr-4" @click="toLines">
							<v-list-item-icon>
								<v-icon>mdi-relation-many-to-many</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Lineas de Producción</v-list-item-title>
						</v-list-item>

					</v-list-group>


					<v-list-group active-class="red--text text--accent-4" prepend-icon="mdi-clipboard-list-outline">
						<template v-slot:activator>
							<v-list-item-title class="ml-n4">Administracion</v-list-item-title>
						</template>

						<v-list-item link @click="toMaquinariesConsumable" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-truck</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Consumibles de Maquinaria</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toCleaningSupplies" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-clipboard-list-outline</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Insumos de Limpieza</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toCleaningTools" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-broom</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Utensilios de Limpieza</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toTransactions" class="ml-4 mr-4">
						<v-list-item-icon>
							<v-icon>mdi-history</v-icon>
						</v-list-item-icon>
						<v-list-item-title class="ml-n4">Moviemientos</v-list-item-title>
					</v-list-item>


					</v-list-group>


					<v-list-group active-class="red--text text--accent-4" prepend-icon="mdi-clipboard-account">
						<template v-slot:activator>
							<v-list-item-title class="ml-n4">RR-HH</v-list-item-title>
						</template>

						<v-list-item link @click="toEmployes" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-account-hard-hat</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Empleados</v-list-item-title>
						</v-list-item>

						<v-list-item link @click="toMilitiamen" class="ml-4 mr-4">
							<v-list-item-icon>
								<v-icon>mdi-account-multiple</v-icon>
							</v-list-item-icon>
							<v-list-item-title class="ml-n4">Milicianos</v-list-item-title>
						</v-list-item>

					</v-list-group>

				</v-list-item-group>

			</v-list>
		</v-navigation-drawer>

		<v-app-bar app fixed color="white">

			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			<v-img src="../assets/nutrivida.jpg" max-height="55" max-width="90"></v-img>
			<v-toolbar-title class="ml-3">LINEA NUTRIVIDA</v-toolbar-title>

			<v-spacer></v-spacer>

			<div>
				<v-row>
					<v-col cols="6" >
						<v-list-item>
							<v-list-item-avatar>
								<v-img src="https://www.ibei.org/images/4611/person_box.png"></v-img>
							</v-list-item-avatar>
						</v-list-item>
					</v-col>

					<v-col cols="6">
						<v-menu offset-y>

							<template v-slot:activator="{ on, attrs }">
								<v-btn icon v-bind="attrs" v-on="on">
									<v-icon>mdi-dots-vertical</v-icon>
								</v-btn>
							</template>

							<v-list>
								<v-list-item link @click="logout">
									<v-list-item-icon>
										<v-icon>mdi-logout-variant</v-icon>
									</v-list-item-icon>
									<v-list-item-title class="ml-n4">Cerrar Sesión</v-list-item-title>
								</v-list-item>
							</v-list>

						</v-menu>
					</v-col>
				</v-row>


			</div>
		</v-app-bar>
	</v-container>

</template>

<script>
export default {
	name: 'AppBar',
	data: () => ({
		drawer: false,
		name: null,
		email: null,
		role: null
	}),

	created() {
		let user = JSON.parse(localStorage.user);
		let role = localStorage.role;

		window.name = user.name;
		this.name = user.name;
		this.email = user.email;
		this.role = role;
	},

	methods: {

		logout: function () {
			localStorage.user = null;
			localStorage.token = null;
			localStorage.role = null;
			window.axios.defaults.headers.common['Authorization'] = '';
			this.$router.push('/login');
		},

		toDashboard() { this.$router.push('/'); },
		toTransactions() { this.$router.push('/transactions'); },

		//Almacen
		toPrimariesProducts() { this.$router.push('/primaries_products'); },
		toProductsNoConforming() { this.$router.push('/products_no_conforming'); },
		toProductsFinals() { this.$router.push('/products_finals'); },
		toSuppliesMinors() { this.$router.push('/supplies_minors'); },
		toSuppliesMinorsNoconform() { this.$router.push('/supplies_minors_noconform'); },
		toMaquinariesConsumable() { this.$router.push('/machinaries_consumable'); },
		toPurchases() { this.$router.push('/purchases_orders'); },
		toProductsFinalsToWarehouses() { this.$router.push('/products_finals_to_warehouses'); },
		toDispatches() { this.$router.push('/dispatches'); },
		
		// Producción
		toFormulas() { this.$router.push('/formulas') },
		toLines() { this.$router.push('/lines') },
		toProductionsOrders() { this.$router.push('productions_orders') },

		// Administracion
		toCleaningSupplies() { this.$router.push('/cleaning_supplies'); },
		toCleaningTools() { this.$router.push('/cleaning_tools'); },
		toEmployes() { this.$router.push('/employes'); },
		toMilitiamen() { this.$router.push('/militiamen'); },
		toProviders() { this.$router.push('/providers'); },

		// Usuarios
		toUsers() { this.$router.push('/users'); },
		toRoles() { this.$router.push('/roles'); },



	}
}
</script>