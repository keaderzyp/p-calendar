import Vue from 'vue'
import PCalendar from '@/components/p-calendar'
// import PCalendar from './p-calendar.min.js';
console.log(PCalendar)
import App from './App'
Vue.use(PCalendar)
new Vue({
	render:(h) => h(App)
}).$mount('#app')