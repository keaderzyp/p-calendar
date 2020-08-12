export default{
	name:'p-week-list',
	props:{
		'base-weeks':{
			required:false,
			type:Array,
			default(){
				return []
			}
		}
	},
	render(h){
		return h('div',{
			class:'p-week-list'
		},this.baseWeeks.map(item => {
			return h('div',{
				class:'p-week-list-item'
			},item)
		}))
	}
}