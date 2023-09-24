<template>
    <div>
        <v-btn color="error" icon class="mb-2" @click="exportPdf" :loading="loading">
            <v-icon> mdi-file-pdf-box </v-icon>
        </v-btn>
        <!-- Alerta de la app -->
        <snackbar-app :color="colorAlert" :text="textAlert" :icon="iconAlert"></snackbar-app>
    </div>

</template>

<script>
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import SnackbarApp from '../components/SnackbarApp.vue';

export default {

    components: { SnackbarApp },

    name: 'poductions-consumptions-orders-export-pdf',
    props: ['production_order_id', 'headers'],
    data() {
        return {
            production_order: {},
            production_consumption: {},
            production_consumption_items: {},
            consumption_supply_minor: {},
            loss_production: {},

            colorAlert: null,
            iconAlert: null,
            textAlert: null,

            loading: false
        };
    },

    methods: {

        alertApp: function (color, icon, text) {
            this.colorAlert = color;
            this.iconAlert = icon;
            this.textAlert = text;
        },

        async get_details_order() {
            try {

                let response = await window.axios.get(`get_consumptions_details/${this.production_order_id}`);

                if (response.status != 200)
                    throw new Error(response.data.message);

                console.log(response.data);

                this.production_order = response.data.production_order;
                this.production_consumption = response.data.production_consumption;
                this.production_consumption_items = response.data.production_consumption_items;
                this.consumption_supply_minor = response.data.consumption_supply_minor;
                this.loss_production = response.data.loss_production;


                this.production_consumption.loss_missing = 0.00;
                this.production_consumption.loss_production = 0.00;
                this.production_consumption.loss_production_percentage = 0.00;


                if (this.production_consumption.consumption_production > 0) {
                    this.production_consumption.loss_production = parseFloat(this.production_consumption.total_production) - parseFloat(this.production_consumption.consumption_production);
                    this.production_consumption.loss_production_percentage = (this.production_consumption.loss_production / parseFloat(this.production_consumption.consumption_production)) * 100;
                    this.production_consumption.loss_missing = parseFloat(this.production_consumption.loss_production) + parseFloat(this.loss_production == null ? 0 : this.loss_production.total_recovered) + parseFloat(this.loss_production == null ? 0 : this.loss_production.hopper_auger) + parseFloat(this.loss_production == null ? 0 : this.loss_production.lab);

                    this.production_consumption.loss_production_percentage = this.production_consumption.loss_production_percentage.toFixed(2);
                }

            } catch (error) {
                this.alertApp('error', 'alert', error.response.data.message);
            }

        },

        getHeaders() {
            let headers = [];
            let item = {};
            for (let i = 0; i < this.headers.length; i++) {

                if (this.headers[i].value != 'actions' && this.headers[i].value != 'updated_at' && this.headers[i].value != 'created_at' && this.headers[i].value != 'id') {
                    item[this.headers[i].value] = this.headers[i].text;
                }

            }
            headers.push(item);
            return headers;
        },

        formatNumber: function (number) {
            return new Intl.NumberFormat('es-US', { style: 'decimal' }).format(number);
        },


        async exportPdf() {
            try {
                this.loading = true;
                await this.get_details_order();

                const doc = new jsPDF({ orientation: 'landscape' });

                autoTable(doc, {
                    body: [
                        [
                            {
                                content: '                Planta Experimental Linea Nutrivida',
                                styles: {
                                    halign: 'left',
                                    fontSize: 20,


                                }
                            },
                        ],
                    ],
                    theme: 'plain',
                    didDrawPage(data) {
                        doc.addImage("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", 'JPEG', data.settings.margin.left, 10, 25, 22);
                    }
                });

                autoTable(doc, {
                    body: [
                        [
                            {
                                content: 'Emitido por: ' + this.production_order.issued_by,
                                styles: {
                                    halign: 'left',
                                    fontSize: 11,
                                    style: { valign: 'middle' }

                                }
                            },
                            {
                                content: 'Producto Solicitado: ' + this.production_order.product_final_name,
                                styles: {
                                    halign: 'left',
                                    fontSize: 11,
                                    style: { valign: 'middle' }
                                }
                            },
                        ],
                        [
                            {
                                content: 'Estatus: ' + this.production_order.production_order_state,
                                styles: {
                                    halign: 'left',
                                    fontSize: 11,
                                    style: { valign: 'middle' }

                                }
                            },
                            {
                                content: 'Tipo de Producto: ' + this.production_order.product_final_type,
                                styles: {
                                    halign: 'left',
                                    fontSize: 11,
                                    style: { valign: 'middle' }
                                }
                            },
                        ],
                        [
                            {
                                content: 'Fecha de Emision: ' + this.production_order.created_at ,
                                styles: {
                                    halign: 'left',
                                    fontSize: 11,
                                    style: { valign: 'middle' }

                                }
                            },
                            {
                                content: 'Cantidad Solicitada: ' + this.production_order.quantity,
                                styles: {
                                    halign: 'left',
                                    fontSize: 11,
                                    style: { valign: 'middle' }

                                }
                            },
                        ],
                    ],
                    theme: 'plain',
                });

                autoTable(doc, {
                    head: [
                        [
                            {
                                content: 'Consumo de Producción',
                                styles: {
                                    halign: 'left',
                                    fontSize: 16,
                                }
                            }
                        ],
                    ],
                    theme: 'plain',
                });

                autoTable(doc, {
                    head: [
                        [
                            {
                                content: "CONSUMO DE INSUMOS MENORES",
                                colSpan: 2,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F44336',
                                    fontStyle: "bold",
                                    textColor: '#FFFFFF'
                                }
                            },
                            {
                                content: "BARRIDO DE MERMA",
                                colSpan: 2,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F44336',
                                    fontStyle: "bold",
                                    textColor: '#FFFFFF'
                                }
                            },
                            {
                                content: "REPORTE FINAL",
                                colSpan: 2,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F44336',
                                    fontStyle: "bold",
                                    textColor: '#FFFFFF'
                                }
                            },
                        ]
                    ],
                    body: [
                        [
                            {
                                content: "NUMERO DE EMPAQUES",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.consumption_supply_minor == null ? 0 : this.consumption_supply_minor.number_packages,
                                colSpan: 1,
                                styles: { valign: "middle" }
                            },
                            {
                                content: "AREA DE EMPAQUE",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.loss_production == null ? "0.00 Kg" : this.formatNumber(this.loss_production.packing_area) + ' Kg',
                                colSpan: 1,
                                styles: { valign: "middle" }
                            },
                            {
                                content: "CONSUMO DE PRODUCCIÓN",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.production_consumption == null ? "0.00 Kg" : this.formatNumber(this.production_consumption.consumption_production) + ' Kg',
                                colSpan: 1,
                                styles: { valign: "middle" }
                            }
                        ],

                        [
                            {
                                content: this.consumption_supply_minor == null ? "" : this.consumption_supply_minor.supply_name,
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.consumption_supply_minor == null ? "0.00 Kg" : this.consumption_supply_minor.consumption,
                                colSpan: 1,
                                styles: { valign: "middle" }
                            },
                            {
                                content: "PRUEBA DE LABORATORIO",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.loss_production == null ? "0.00 Kg" : this.formatNumber(this.loss_production.lab) + ' Kg',
                                colSpan: 1,
                                styles: { valign: "middle" }
                            },
                            {
                                content: "TOTAL PRODUCCIÓN",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.production_consumption == null ? '0.00 Kg' : this.formatNumber(this.production_consumption.total_production) + ' Kg',
                                colSpan: 1,
                                styles: { valign: "middle" }
                            }
                        ],
                        [
                            {
                                content: "BOLSONES",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.consumption_supply_minor == null ? "0.00 Kg" : this.consumption_supply_minor.consumption_bags,
                                colSpan: 1,
                                styles: { valign: "middle" }
                            },

                            {
                                content: "REMANENTE TOLVA Y TORNILLO SIN FIN",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.loss_production == null ? '0.00 Kg' : this.formatNumber(this.loss_production.hopper_auger) + ' Kg',
                                colSpan: 1,
                                styles: { valign: "middle" }
                            },
                            {
                                content: "MERMA DE PRODUCCIÓN (Kg)",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.production_consumption == null ? '0.00 Kg' : this.formatNumber(this.production_consumption.loss_production) + ' Kg',
                                colSpan: 1,
                                styles: { valign: "middle" }
                            }
                        ],
                        [
                            {
                                content: "ENVOPLAST",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.consumption_supply_minor == null ? "0.00 Kg" : this.consumption_supply_minor.envoplast_consumption,
                                colSpan: 1,
                                styles: { valign: "middle" }
                            },
                            {
                                content: "MERMA RECUPERADA",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.loss_production == null ? '0.00 Kg' : this.formatNumber(this.loss_production.total_recovered) + ' Kg',
                                colSpan: 1,
                                styles: { valign: "middle" }
                            },
                            {
                                content: "MERMA PRODUCCIÓN (%)",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.production_consumption == null ? '0 %' : this.formatNumber(this.production_consumption.loss_production_percentage) + ' %',
                                colSpan: 1,
                                styles: { valign: "middle" }
                            },
                        ],
                        [
                            {
                                content: "",
                                colSpan: 4,
                                styles: { valign: "middle" }
                            },
                            {
                                content: "MERMA FALTANTE",
                                colSpan: 1,
                                styles: {
                                    valign: "middle",
                                    fillColor: '#F5F5F5',
                                    fontStyle: "bold"
                                }
                            },
                            {
                                content: this.formatNumber(this.production_consumption.loss_missing) + ' Kg',
                                colSpan: 1,
                                styles: { valign: "middle" }
                            },
                        ]
                    ],
                    bodyStyles: {
                        lineWidth: 0.2,
                        lineColor: [73, 138, 159]
                    },
                    theme: "plain"
                });



                autoTable(doc, {
                    head: [
                        [
                            {
                                content: 'Consumo de Materia Prima',
                                styles: {
                                    halign: 'left',
                                    fontSize: 14
                                }
                            }
                        ]
                    ],
                    theme: 'plain'
                });

                let headers = this.getHeaders();
                autoTable(doc, {
                    head: headers,
                    body: this.production_consumption_items,
                    theme: 'striped',
                    headStyles: {
                        fillColor: '#343a40'
                    }
                });

                doc.save("reporte_consumo_de_producción");
                this.loading = false;

            } catch (error) {
                this.loading = false;
                console.log(error);
                this.alertApp('error', 'alert', 'Hubo un error exportar la información');
            }
        },

    }
}
</script>