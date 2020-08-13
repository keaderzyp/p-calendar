import {PCalendar} from './p-calendar'
import Swipe from 'vant/es/swipe'
import SwipeItem from 'vant/es/swipe-item'
import 'vant/es/swipe/index.css'
import 'vant/es/swipe-item/index.css'
PCalendar.install = Vue => {
	function resize(fn,delay){
		let first = true
		let flag = true
		return function(e){
			if(!first){
				if(flag){
					setTimeout(function(){
						fn&&fn(e)
						flag = true
					},delay)
				}
				flag = false
			}
			first = false;
		}
	}
	window.addEventListener('resize',resize(function(e){
		let html = document.querySelector('html');
		html.style.fontSize = (window.innerWidth/375)+'px'
	},100))
	Vue.component(PCalendar.name,PCalendar)
	Vue.component(Swipe.name,Swipe)
	Vue.component(SwipeItem.name,SwipeItem)
}
export default PCalendar;