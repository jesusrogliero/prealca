<template>

    <v-snackbar 
        v-model = "snackbar"  
        :color="color"
        timeout = "2500"
        :top = "true"
        :vertical="'vertical'"
        :key="alertId"
    >
        
        <div>
            <v-icon v-if = "icon != null" dark>
                mdi-{{ icon }}
            </v-icon>
            <span class="text-h6 text-wrap"  style = "margin: auto;">
                {{ text }}
            </span>
        </div>
    </v-snackbar>

</template>

<script>
export default {
    props: ["text", "icon", "color", "alertId"],

    data: function(){
        return {
            snackbar: false,
        };
    },

    watch: {
        text() {
            this.snackbar = true;
        },
        alertId() {
            this.snackbar = true;
        }
    },
}
</script>

