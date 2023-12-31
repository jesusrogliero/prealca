import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import es from 'vuetify/lib/locale/es'

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { es },
        current: 'es'
    },
    theme: {
      themes: {
        light: {
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107'
        },
      },
    },
  });
