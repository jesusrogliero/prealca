<template>
    <div class="text-center">
        <v-bottom-sheet v-model="active" inset>
            <v-sheet class="text-center" rounded height="500px">

                <v-toolbar color="red" fat  class="mb-n4">
                    <v-toolbar-title class="white--text mt-n2">Registro de Merma en el Consumo de Producción</v-toolbar-title>

                    <v-spacer></v-spacer>

                    <v-btn  text class="mt-n2" color="white" @click="hide">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>


                <v-card class="rounded-xl">

                    <v-card-text>
                        <data-table ref="gridbox" title="Merma"
                            :url="'loss_production_items/' + loss_production_id" :headers="headers"
                            :update="openDialog"></data-table>


                        <!-- DIalogo para crear o actualizar -->
                        <dialog-basic :max-width="350" :active="dialog == 'new' || dialog == 'edit'">
                            <template v-slot:dialog-title>
                                <span>{{ dialog == 'edit' ? 'Editar Merma' : 'Nuevo ingrediente' }}</span>
                            </template>

                            <template v-slot:dialog-content>

                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-row>

                                        <v-col cols="12" class="mb-n6">
                                            <v-text-field v-model="mixing_area_l1" :rules="quantityRules" suffix="Kg"
                                                label="Area de Mezclado L1" required placeholder="Ingrese la merma">
                                            </v-text-field>
                                        </v-col>

                                        <v-col cols="12" class="mt-2">
                                            <v-text-field v-model="mixing_area_l2" suffix="Kg" :rules="quantityRules"
                                                label="Area de Mezclado L2" required placeholder="Ingrese la merma">
                                            </v-text-field>
                                        </v-col>

                                    </v-row>
                                </v-form>
                            </template>

                            <template v-slot:dialog-actions>
                                <v-btn :disabled="!valid" color="transparent" text style="color:#2c823c !important;"
                                    class="mr-4" @click="validate">
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
                    </v-card-text>
                </v-card>
            </v-sheet>
        </v-bottom-sheet>
    </div>
</template>

<script>

import SnackbarApp from '../components/SnackbarApp.vue';
import DialogBasic from "../components/Dialog/DialogBasic.vue";
import DataTable from "../components/DataTable.vue";

export default {
    components: {
        DataTable, DialogBasic, SnackbarApp
    },

    props: ["loss_production_id", "active", "hide"],

    data() {
        return {
            valid: true,
            dialog: null,
            menu: false,

            id: null,
            mixing_area_l1: null,
            mixing_area_l2: null,

            quantityRules: [
                v => !!v || 'Este campo es requerido!!',
                v => /[+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)(?:[eE][+-]?\d+)?/gm.test(v) || 'La cantidad a ingresar no es correcta'
            ],

            formula: {},

            headers: [
                //{ text: 'ID', align: 'start', value: 'id', sortable: false},
                { text: 'Materia Prima', value: 'primary_product' },
                { text: 'Merma Recuperada', value: 'loss_quantity' },
                { text: 'Area de Mezclado L1', value: 'mixing_area_l1' },
                { text: 'Area de Mezclado L2', value: 'mixing_area_l2' },
                { text: 'Total Recuperado', value: 'total' },
                //{ text: 'Creado el ', value: 'created_at' },
                //{ text: 'Actualizado el', value: 'updated_at' },
                { text: 'Acciones', value: 'actions', sortable: false }
            ],

            buttonsToolbar: [
                {
                    id: "approvate",
                    color: "white",
                    icon: "check",
                    text: "Aprobar",
                    action: this.approve,
                },
            ],

            colorAlert: null,
            iconAlert: null,
            textAlert: null,
        };
    },

    watch: {
        async formula_id(val) {
            await this.getDetails(val);
        }

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
                    console.log(id);
                    let response = await window.axios.get(`loss_productions_items/${id}`);

                    if (response.status == 200) {
                        this.id = response.data.id;
                        this.mixing_area_l1 = response.data.mixing_area_l1;
                        this.mixing_area_l2 = response.data.mixing_area_l2;
                    }
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
            this.mixing_area_l1 = null;
            this.mixing_area_l2 = null;
            this.dialog = null;
        },

        validate() {
            if (this.$refs.form.validate() && this.dialog == 'new')
                this.create();

            if (this.$refs.form.validate() && this.dialog == 'edit')
                this.update();

        },

        async update() {
            try {
                let response = await window.axios.put(`loss_productions_items/${this.id}`, {
                    mixing_area_l1: this.mixing_area_l1,
                    mixing_area_l2: this.mixing_area_l2,
                });

                if (response.status != 202)
                    throw new Error(response.message);

                this.getDetails(this.order_id);
                this.alertApp("success", "check", response.data);


            } catch (error) {
                this.alertApp('error', 'alert', error.response.data.message);
            } finally {
                this.$refs.form.reset();
                this.dialog = null;
                await this.$refs.gridbox.getDataFromApi();
            }

        },

        async destroyItem() {
            try {
                let response = await window.axios.delete(`formulas_items/${this.id}`);

                if (response.status != 204)
                    throw new Error(response.message);

                this.getDetails(this.formula_id);
                this.alertApp("success", "check", 'Eliminado Correctamente');

            } catch (error) {
                if (error.response.data.code == 23000)
                    this.alertApp('error', 'alert', 'Este registro no puede ser eliminado');
                else
                    this.alertApp('error', 'alert', error.response.data.message);
            } finally {
                this.dialog = null;
                this.cleanForm();
            }
        }
    }


}
</script>

<style>
.card-info-invoice {
    border: 1px solid #ddd;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
    margin: 0px;
}
</style>