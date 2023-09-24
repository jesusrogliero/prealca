<template>
    <v-row justify="center">
        <v-dialog persistent scrollable :value="active" min-width="320" :max-width=" maxWindow ">
            <v-card v-if="active" color="#f9f9f9">

                <v-card-title class="headline" style="background: #E53935; color: white;">
                    <slot name="dialog-title"></slot>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text>
                    <slot name="dialog-content"></slot>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions style="banckground: #fff;">
                    <v-spacer></v-spacer>
                    <slot name="dialog-actions"></slot>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
export default {
    props: ["active", "max-width"],

    data() {
        return {
            maxWindow: 640
        }
    },

    created() {
        if (this.maxWidth > 0)
            this.maxWindow = this.maxWidth;
    },

    watch: {
        maxWidth: function (value) {
            if (value > 0)
                this.maxWindow = value;
        }
    },
}
</script>