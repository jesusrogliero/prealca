<template>

	<v-app>

		<!-- Sizes your content based upon application components -->
		<v-main>

			<!-- Provides the application the proper gutter -->
			<v-container fluid>

				<!-- If using vue-router -->
				
					<router-view></router-view>
				

			</v-container>
		</v-main>


		<v-footer padless color="grey lighten-3">
			<v-col class="text-center" cols="12">
				{{ new Date().getFullYear() }} — <strong>Todos los derechos reservados</strong>
			</v-col>
		</v-footer>

	</v-app>

</template>

<style lang="css">

</style>
