import Vue from 'vue'
import PCalendar from '@/components/p-calendar-export'
// import PCalendar from './p-calendar.min.js';
import App from './App'
Vue.use(PCalendar)
new Vue({
	render:(h) => h(App)
}).$mount('#app')