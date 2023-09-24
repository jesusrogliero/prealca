<template>
     <span style ="width: fit-content; width: -moz-max-content; margin-right: 5px;">
            
            <v-btn  :color = "color" v-if = "typeof text == 'string' && typeof icon != 'string' " :disabled="disabled" outlined dark v-on:click = "execFunction">
                <span>{{ text }}</span>
            </v-btn>

            <v-tooltip top v-else-if = "typeof text == 'string' && typeof icon == 'string'">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                        :color = "color" 
                        :disabled="disabled" 
                        icon
                        v-on:click = "execFunction"
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon size = "30px">mdi-{{ icon }}</v-icon>
                    </v-btn>
                </template>
                <span>{{ text }}</span>
            </v-tooltip>

            <v-btn v-else dark :color = "color" :disabled="disabled" icon v-on:click = "execFunction">
                <v-icon size = "20px">mdi-{{ icon }}</v-icon>
            </v-btn>
        </span>
</template>


<script>
export default {
    name: "ButtonsActions",
     // prototipo
     props: ["event", "button", "icon", "text", "resource", "color", "index", "disabled", "size"],

    // metodos del componente
    methods: {
        // funcion que evalua y ejecuta una funcion paralela
        execFunction: function () {
            let id = typeof this.resource === "object" ? this.resource.id : null;
            typeof this.event === "function" ? this.event(
                id, this.button,
                this.index, this.resource
            ) : console.error(`Usted no definio correctamente la funcion a ejecutar en el boton ${this.button}`);
        },
    }
}
</script>