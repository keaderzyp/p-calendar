export default {
	name:'p-collapse-bar',
	props:{
		collapse:{
			required:false,
			type:Boolean,
			default(){
				return false
			}
		}
	},
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
		},this.collapse?'down':'up')
	}
}