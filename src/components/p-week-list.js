export default{
	name:'p-week-list',
	data(){
		return {
			month:0,
			year:0
		}
	},
	props:{
		'base-weeks':{
			required:false,
			type:Array,
			default(){
				return []
			}
		},
		'show-title':{
			required:false,
			type:Boolean,
			default(){
				return false
			}
		},
		shadow:{
			required:false,
			type:Boolean,
			default(){
				return false
			}
		},
		activeDate:{
			required:false,
			type:Object,
			default(){
				return {}
			}
		}
	},
	computed:{
		getTitle(){
			return `${this.activeDate.date.cYear}年${this.activeDate.date.cMonth}月`
		},
		getYear(){
			return this.activeDate.date.cYear
		},
		getMonth(){
			return this.activeDate.date.cMonth
		},
		isThisMonth(){
			if(this.getYear == this.year&&
				 this.getMonth == this.month){
				return true
			}else{
				return false
			}
		}
	},
	created(){
		this.month = new Date().getMonth()+1;
		this.year = new Date().getFullYear();
	},
	render(h){
		let _this = this;
		return h('div',{
			class:`p-week-list ${this.shadow?'shadow':''}`
		},
		[
			this.showTitle?
			h('div',{
				class:'title'
			},
			[
				!this.isThisMonth?
				h('div',{
					class:'this-month',
					on:{
						click(){
							_this.$emit('swipeToYearMonth',_this.year,_this.month)
						}
					}
				},'今'):h(''),
				this.getTitle
			]):h(''),
			this.baseWeeks.map(item => {
				return h('div',{
					class:'p-week-list-item'
				},item)
			})
		])
	}
}