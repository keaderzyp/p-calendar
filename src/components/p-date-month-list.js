export default{
	name:'p-date-month-list',
	props:{
		data:{
			type:Array,
			required:false,
			default(){
				return []
			}
		},
		month:{
			type:Number,
			required:false,
			default(){
				return 0;
			}
		},
		year:{
			type:Number,
			required:false,
			default(){
				return 0;
			}
		}
	},
	created(){
		// console.log(this.data)
	},
	render(h){
		return h('div',{
			class:`p-date-month-list`
		},this.data.map(item => {
			return h('div',{
				class:`p-date-month-list-item ${item.type!='this'?'not-this-month':''} ${item.today?'today':''}`
			},[
				h('div',{
					class:'p-date-month-list-item-title'
				},[
					h('div',{
						class:'dc'
					},item.d),
					h('div',{
						class:'dl'
					},item.dayCn)
				])
			])
		}))
	}
}