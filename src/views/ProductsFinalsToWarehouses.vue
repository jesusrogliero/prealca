<template>
    <div>
        <AppBar />

        <!-- Tabla de datos -->
        <data-table ref="gridbox" url="products_finals_to_warehouses" :headers="headers"
            title="Entregas de Producto Final a Almacén" :update="openDialog" :icome="approve">

            <template v-slot:action-btn="{ item_id }">
                <v-icon class="ml-3" color="grey" @click="openDialog(item_id, 'production_order_dialog')">
                    mdi-application-cog-outline
                </v-icon>
            </template>

        </data-table>

        <!-- DIalogo para crear o actualizar -->
        <dialog-basic :active="dialog == 'new' || dialog == 'edit'" >
            <template v-slot:dialog-title>
                <span>{{ dialog == 'edit' ? 'Editar el Producto Primario' : 'Nuevo Producto Primario'}}</span>
            </template>

            <template v-slot:dialog-content>

                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>

                        <v-col cols="12" lg="6" md="6" sm="6" class="mt-2 mb-n4">
                            <v-text-field v-model="quantity" suffix="Kg" :rules="requiredRules" label="Cantidad"
                                required placeholder="Cantidad a Ingresar"></v-text-field>
                        </v-col>

                        <v-col cols="12" lg="6" md="6" sm="6" class="mt-2 mb-n4">
                            <v-text-field v-model="number_control" append-icon="mdi-clipboard-text"
                                :rules="requiredRules" label="Numero de Control" required
                                placeholder="Ingresa el Numero de Control"></v-text-field>
                        </v-col>

                        <v-col cols="12" lg="6" md="6" sm="6" class="mb-n4">
                            <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="date" label="Fecha" :rules="requiredRules" required
                                        append-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="date" @input="menu = false"></v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-col cols="6" lg="6" md="6" sm="6">
                            <v-text-field append-icon="mdi-warehouse" v-model="origin" :rules="requiredRules"
                                label="Origen" required placeholder="Ingresa el Origen"></v-text-field>
                        </v-col>

                        <v-col cols="6" lg="6" md="6" sm="6">
                            <v-text-field v-model="destination" append-icon="mdi-warehouse" :rules="requiredRules"
                                label="Destino" required placeholder="Ingresa el Destino"></v-text-field>
                        </v-col>

                        <v-col cols="12" lg="6" md="6" sm="6">
                            <v-text-field v-model="work_area" append-icon="mdi-warehouse" :rules="requiredRules"
                                label="Area de Trabajo" required
                                placeholder="Ingresa el Area de Trabajo"></v-text-field>
                        </v-col>

                        <v-col cols="12" lg="6" md="6" sm="6">
                            <v-text-field v-model="guide_sunagro" append-icon="mdi-clipboard-text"
                                :rules="requiredRules" label="Nº Guia Sunagro" required
                                placeholder="Ingresa el Nº de Guia Sunagro"></v-text-field>
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

        <!-- DIalogo para visualizar la orden de producción -->
        <dialog-basic :active="dialog == 'production_order_dialog'">
            <template v-slot:dialog-title>
                <span>Orden de Producción</span>
            </template>

            <template v-slot:dialog-content>

                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>

                        <v-col cols="6" lg="6" md="6" sm="6" class="mt-2">
                            <autocomplete-form uri="/products_finals" :readonly="true" label="Producto Final"
                                column="name" itemValue="id" :defaultValue="production_order.product_final_id" />
                        </v-col>

                        <v-col cols="6" lg="6" md="6" sm="6" class="mt-2">
                            <autocomplete-form uri="/formulas" :readonly="true" label="Formula" column="name"
                                itemValue="id" :defaultValue="production_order.formula_id" />
                        </v-col>

                        <v-col cols="6" lg="6" md="6" sm="6">
                            <v-text-field append-icon="mdi-weight" suffix="Kg" v-model="production_order.quantity"
                                label="Cantidad Solicitada" readonly></v-text-field>
                        </v-col>

                        <v-col cols="6" lg="6" md="6" sm="6">
                            <v-text-field append-icon="mdi-calendar" v-model="production_order.created_at"
                                label="Fecha de Emisión" readonly></v-text-field>
                        </v-col>

                    </v-row>
                </v-form>
            </template>

            <template v-slot:dialog-actions>
                <v-btn @click="closeDialog" color="transparent" text style="color: #f44336 !important;">
                    <span>Cerrar</span>
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
import AutocompleteForm from '../components/autocomplete-form.vue';
import DataTable from '../components/DataTable.vue';
import DialogBasic from '../components/Dialog/DialogBasic.vue';
export default {
    components: {
        AppBar, SnackbarApp,
        DataTable, DialogBasic, AutocompleteForm
    },

    data() {
        return {
            dialog: null,
            valid: true,
            menu: null,

            dialog_production_order: null,
            production_order: {},

            id: null,
            quantity: null,
            number_control: null,
            date: null,
            work_area: null,
            origin: null,
            destination: null,
            guide_sunagro: null,

            requiredRules: [v => !!v || 'Este campo es requerido!!'],

            headers: [
                //{ text: 'ID', align: 'start', value: 'id' },
                { text: 'Producto Final', value: 'product_final' },
                { text: 'Cantidad', value: 'quantity' },
                { text: 'Estado', value: 'state' },
                { text: 'Numero de Control', value: 'number_control' },
                { text: 'Nº Guia Sunagro', value: 'guide_sunagro' },
                { text: 'Fecha', value: 'date' },
                { text: 'Area de Trabajo', value: 'work_area' },
                { text: 'Origen', value: 'origin' },
                { text: 'Destino', value: 'destination' },
                { text: 'Acciones', value: 'actions' }
            ],

            colorAlert: null,
            iconAlert: null,
            textAlert: null
        };
    },

    methods: {

        alertApp: function (color, icon, text) {

            this.$refs.notify.$forceUpdate();
            this.colorAlert = color;
            this.iconAlert = icon;
            this.textAlert = text;
        },

        async openDialog(id, dialog) {
            try {
                this.dialog = null;

                if (id != null) {
                    let response = await window.axios.get(`products_finals_to_warehouses/${id}`);

                    this.id = response.data.id;
                    this.quantity = response.data.quantity;
                    this.number_control = response.data.number_control;
                    this.date = response.data.date;
                    this.work_area = response.data.work_area;
                    this.origin = response.data.origin;
                    this.destination = response.data.destination;
                    this.guide_sunagro = response.data.guide_sunagro;

                }

                if (id != null && dialog == 'production_order_dialog') {

                    let response = await window.axios.get(`productions_orders/${id}`);
                    this.production_order = response.data;
                    
                    let fecha = new Date(this.production_order.created_at);

                    let dia = fecha.getDate();
                    let mes = fecha.toLocaleString('es-ES', { month: 'long' });
                    let anio = fecha.getFullYear();

                    this.production_order.created_at = `${dia} de ${mes} de ${anio}`;

                
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
            this.number_control = null;
            this.work_area = null;
            this.origin = null;
            this.destination = null;
            this.guide_sunagro = null;
            this.dialog = null;
        },

        validate() {
            if (this.$refs.form.validate() && this.dialog == 'edit')
                this.update();

        },

        async update() {
            try {
                let response = await window.axios.put(`products_finals_to_warehouses/${this.id}`, {
                    quantity: this.quantity,
                    number_control: this.number_control,
                    date: this.date,
                    origin: this.origin,
                    destination: this.destination,
                    work_area: this.work_area,
                    guide_sunagro: this.guide_sunagro
                });

                if (response.status != 202)
                    throw new Error(response.message);

                this.alertApp("success", "check", response.data);

                await this.$refs.gridbox.getDataFromApi();

            } catch (error) {
                if(error.response.data.message != null) {
                    this.alertApp('error', 'alert', error.response.data.message);
                }else {
                    console.log(error);
                }
                
            } finally {
                this.$refs.form.reset();
                this.dialog = null;
            }

        },


        async approve(order_id) {
            try {
                let response = await window.axios.get(`enter_products_finals_to_warehouses/${order_id}`);

                if (response.status != 202)
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