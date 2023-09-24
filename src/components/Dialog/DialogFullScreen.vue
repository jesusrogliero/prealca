<template>
    <v-row justify="center">
        <v-dialog v-bind:value="active" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>

                <!-- Barra de tarea -->
                <v-toolbar elevation="1" fixed :color="color">
                    <v-btn icon v-on:click="hide">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title style="color: white;">
                        <slot name="dialog-title"></slot>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <span style="position: relative; top: 5px; right: 0px; display: flex;">
                            <buttons-actions v-for="button in buttonsToolbar" 
                            :key="button.color"
                            :color="button.color" 
                            :button="button.id"
                            :text="button.text" 
                            :event="() => beforeCallback(button)" 
                            :icon="button.icon" 
                            />
                        </span>

                    </v-toolbar-items>
                </v-toolbar>

                <!-- contenido del desarrollo -->
                <slot name="dialog-content">
                </slot>

            </v-card>

        </v-dialog>
    </v-row>
</template>

<script>
import ButtonsActions from '../ButtonsActions.vue';
export default {
    components: {
        ButtonsActions
    },

    props: ["active", "color", "hide", "buttonsToolbar"],

    data() {
        return {

        };
    },

    methods: {
        beforeCallback: function (button) {
            typeof button.action == "function" ? button.action() : console.error(`El boton ${button.id} no tiene un evento relacionado`);
        }
    },

}
</script>