<template>
    <v-row justify="center">
        <v-dialog persistent v-bind:value="active" min-width="320" max-width="640">
            <v-card>
                <v-card-title class="headline">
                    <slot name="dialog-title"></slot>
                </v-card-title>
                <v-card-text>
                    <slot name="dialog-content"></slot>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-on:click="confirm(true)" v-bind:elevation="0" color="transparent"
                        style="color:#2c823c !important;">
                        <span>Aceptar</span>
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-btn v-on:click="cancel(false)" v-bind:elevation="0" color="transparent"
                        style="color: #f44336 !important;">
                        <span>Cancelar</span>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    props: ["active", "confirm", "cancel"] 
}
</script>