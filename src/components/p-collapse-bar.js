export default {
	name:'p-collapse-bar',
	render(h){
		let _this = this;
		return h('div',{
			class:'p-collapse-bar',
			on:{
				touchstart(e){
					_this.$emit('touchstart',e)
				},
				touchmove(e){
					_this.$emit('touchmove',e)
				},
				touchend(e){
					_this.$emit('touchend',e)
				},
			}
		},'up')
	}
}