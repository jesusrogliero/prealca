<template>
	<div>
		<v-autocomplete clearable :readonly="readonly" :label="label" v-model="select" :item-text="column" :item-value="itemValue" :items="suggestions"
			:search-input.sync="search">

			<template slot="selection" slot-scope="data">
				<div>
					<v-avatar v-if="icon != null">
						<v-icon>mdi-magnify</v-icon>
					</v-avatar>
					<span>{{ data.item[column] }}</span>
				</div>
			</template>

			<template slot="item" slot-scope="data">
				<v-avatar v-if="icon != null">
					<v-icon>mdi-magnify</v-icon>
				</v-avatar>
				<span>{{ data.item[column] }}</span>
			</template>

		</v-autocomplete>
	</div>
</template>

<script>
export default {
	props: ["getSelect", "label", "uri", "column", "itemValue", "defaultValue", "icon", "readonly"],

	name: 'autocomplete-form',

	data: function () {
		return {
			suggestions: [],
			search: null,
			signal: null,
			activeSearch: null,
			select: null
		};
	},


	mounted: function () {
		this.select = this.defaultValue;
		this.setSuggestions("", this.defaultValue);
	},

	methods: {

		// setea las sugerencias de una solicitud determiada
		setSuggestions: async function (q = "") {
			var controller = new AbortController();
			var signal = controller.signal;
			//var id = (this.defaultValue != null ? this.defaultValue : "");

			if (this.signal != null)
				this.signal.controller.abort();

			this.signal = { q, signal, controller };

			let response = await window.axios.get(this.uri);

			if (response.status == 200)
				this.suggestions = response.data.result;
		}

	},

	watch: {

		// por si por alguna razon a cambiado la direcion
		uri: function () {
			this.select = this.defaultValue;
			this.setSuggestions("", this.defaultValue);
		},

		// haciendo la busqueda
		search: function (q = "") {
			if (window.activeSearch != null)
				window.clearInterval(window.activeSearch);
			if (q != null)
				window.activeSearch = window.setTimeout(this.setSuggestions, 500, q);
		},

		// haciedo mas
		select: function (value) {
			// evaluamos si el invocador envia un prototipo para obtener el
			// valor seleccionado 
			typeof this.getSelect == "function" ? this.getSelect(value) : null;
		}

	},
}
</script>