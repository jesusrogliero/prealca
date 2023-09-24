<template>
    <div>
        <AppBar />

        <!-- Tabla de datos -->
        <data-table ref="gridbox" url="supplies_minors_noconform" :headers="headers"
            title="Insumos Menores No Conformes" :add="openDialog"></data-table>

        <!-- Dialogo de confirmacion antes de eliminar 

        <dialog-confirm :active="dialog == 'delete'" :confirm="destroyOrder" :cancel="cleanForm">
            <template v-slot:dialog-title>Eliminar Este registro?</template>
            <template v-slot:dialog-content><span class="headline">Esta seguro de que desea eliminar el siguiente
                    registro?</span></template>
        </dialog-confirm>

        -->

        <!-- Dialogo para crear o actualizar -->
        <dialog-basic :active="dialog == 'new' || dialog == 'edit'">
            <template v-slot:dialog-title>
                <span>{{ dialog == 'edit' ? 'Editar Insumo' : 'Nuevo Insumo'}}</span>
            </template>

            <template v-slot:dialog-content>

                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>

                        <v-col cols="12" lg="6" md="6" sm="6" class="mt-2">
                            <autocomplete-form uri="/supplies_minors" label="Selecciona un Insumo Menor"
                                column="name" itemValue="id" :defaultValue="supplie_minor_id"
                                :getSelect="getSelectSupplieMinor" />
                        </v-col>

                        <v-col cols="12" lg="6" md="6" sm="6" class="mt-2">
                            <v-text-field v-model="quantity" :rules="quantityRules" label="Cantidad" suffix="Kg" required
                                placeholder="Ingresa la cantidad no conforme"></v-text-field>
                        </v-col>


                        <v-col cols="12" lg="12" md="12" sm="12" class="mt-2">
                            <v-text-field v-model="observation" label="Observación" required
                                placeholder="Puedes ingresar una Observación"></v-text-field>
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
// import DialogConfirm from '../components/Dialog/DialogConfirm.vue';
import AutocompleteForm from '../components/autocomplete-form.vue';
export default {
    components: {
        AppBar, SnackbarApp,
        DataTable, DialogBasic, AutocompleteForm
    },

    data() {
        return {
            dialog: null,
            valid: true,

            id: null,
            supplie_minor_id: null,
            quantity: null,
            observation: null,

            quantityRules: [
                v => !!v || 'Este campo es requerido!!',
                v => /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/gm.test(v) || 'La cantidad a ingresar no es correcta'
            ],

            headers: [
                //{ text: 'ID', align: 'start', value: 'id' },
                { text: 'Producto Primario', value: 'supplie_minor' },
                { text: 'Existencia', value: 'quantity' },
                { text: 'Observación', value: 'observation' },
                { text: 'Creado el ', value: 'created_at' },
                // { text: 'Actualizado el', value: 'updated_at' },
                // { text: 'Acciones', value: 'actions' }
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
                    let response = await window.axios.get(`supplies_minors_noconform/${id}`);

                    this.id = response.data.id;
                    this.supplie_minor_id = response.data.supplie_minor_id;
                    this.quantity = response.data.quantity;
                    this.observation = response.data.observation;

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
            this.supplie_minor_id = null;
            this.quantity = null;
            this.observation = null;
            this.dialog = null;
        },

        validate() {
            if (this.$refs.form.validate() && this.dialog == 'new')
                this.create();

            if (this.$refs.form.validate() && this.dialog == 'edit')
                this.update();

        },

        getSelectSupplieMinor(id) {
            this.supplie_minor_id = id
        },

        async create() {
            try {

                let response = await window.axios.post('supplies_minors_noconform', {
                    supplie_minor_id: this.supplie_minor_id,
                    quantity: this.quantity,
                    observation: this.observation
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
    }
}
</script>