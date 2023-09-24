<template>
    <div>
        <AppBar />

        <!-- Tabla de datos -->
        <data-table ref="gridbox" url="transactions" :headers="headers" title="Registro de Movimientos"></data-table>

        <!-- Alerta de la app -->
        <snackbar-app :color="colorAlert" :text="textAlert" :icon="iconAlert"></snackbar-app>

    </div>


</template>

<script>
import AppBar from '../components/AppBar.vue';
import SnackbarApp from '../components/SnackbarApp.vue';

import DataTable from '../components/DataTable.vue';
export default {
    components: {
        AppBar, SnackbarApp, DataTable
    },

    data() {
        return {
            dialog: null,

            headers: [
                //{ text: 'ID', align: 'start', value: 'id' },
                { text: 'Fecha ', value: 'created_at' },
                { text: 'Usuario', value: 'user' },
                { text: 'Acción', value: 'action', align: 'center'},
                { text: 'Cantidad Antes', value: 'quantity_before' },
                { text: 'Cantidad', value: 'quantity' },
                { text: 'Cantidad Despues', value: 'quantity_after' },
                { text: 'Modulo', value: 'module' },
                { text: 'Observación', value: 'observation' }
                
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
    }
}
</script>