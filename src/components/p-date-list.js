export default{
	name:'p-date-list',
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
	methods:{
		setActive(item){
			this.$emit('activeChange',item)
		}
	},
	render(h){
		let _this = this;
		return h('div',{
			class:'p-date-list'
		},[
			this.data.map(item => {
				return h('div',{
					class:'p-date-list-item'
				},[
					h('div',{
						class:`p-date-list-item-container ${ item.today ?'today':'' }  ${ item.type != 'this'?'not-this-month':'' } ${item.active? 'active':''}`,
						on:{
							click(e){
								_this.setActive(item)
							}
						}
					},[
						h('div',{
							class:"p-date-list-item-date"
						},item.today?'今':item.d),
						h('div',{
							class:"p-date-list-item-date-cn"
						},item.dayCn)
					])
				])
			}),
			h('div',{
				class:'p-date-list-month'
			},this.month),
			// h('div',{
			// 	class:''
			// },this.year)
		])
	}
}