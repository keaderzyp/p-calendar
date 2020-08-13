import './p-calendar.scss'
import PWeekList from './p-week-list'
import PDateList from './p-date-list'
import PDateMonthList from './p-date-month-list'
import solarLunar from 'solarLunar';
export const PCalendar = {
	name:'p-calendar',
	props:{
		//type：日历展示形态，list（列表），date（日），months（月历）
		type:{
			required:false,
			type:String,
			default(){
				return 'list'
			}
		},
		collapse:{
			required:false,
			type:Boolean,
			default(){
				return true
			}
		}
	},
	data(){
		return {
			baseWeeks:[
				'日',
				'一',
				'二',
				'三',
				'四',
				'五',
				'六'
			],
			activeIndex:5,
			allMonthArr:[],
			activeDate:{}
		}
	},
	mounted(){
		let html = document.querySelector('html');
		html.style.fontSize = (window.innerWidth/375)+'px'
	},
	created(){
		let now = new Date();
		this.allMonthArr = [
			this.initYearMonthDays(now.getFullYear(),now.getMonth()-4),
			this.initYearMonthDays(now.getFullYear(),now.getMonth()-3),
			this.initYearMonthDays(now.getFullYear(),now.getMonth()-2),
			this.initYearMonthDays(now.getFullYear(),now.getMonth()-1),
			this.initYearMonthDays(now.getFullYear(),now.getMonth()),
			this.initYearMonthDays(),
			this.initYearMonthDays(now.getFullYear(),now.getMonth()+2)
		]
	},
	methods:{
		getMonthDays(year,month){
			let d = new Date(year,month,0)
			return d.getDate();
		},
		//获取当前选中的swipe
		getActiveSwipe(index){
			let monthObj = this.allMonthArr[index];
			let activeObj = monthObj.data.filter(item => item.today||item.active)
			this.$emit('change',{month:monthObj,activeDate:activeObj.length>0?activeObj[0]:this.activeDate})
			this.$emit('activeChange',activeObj.length>0?activeObj[0]:this.activeDate)
			this.activeDate = activeObj.length>0?activeObj[0]:this.activeDate
		},
		//初始化上月数据
		initPreMonthDaysArr(year,month,monthDays,thisLastMonthArr){
			let thisLastMonthFirstDay = thisLastMonthArr[0]
			let lastMonthDays = this.getMonthDays(year,month-1);
			let arr = []
			for(let step = thisLastMonthFirstDay.w,item = lastMonthDays;step>0;item--,step-- ){
				const dateItem = solarLunar.solar2lunar(year,month-1,item);
				arr.unshift({
					w:dateItem.nWeek,
					d:dateItem.cDay,
					dayCn:dateItem.dayCn,
					date:dateItem,
					type:'pre',
					active:false,
					today:false
				})
			}
			return arr;
		},
		//初始化本月数据
		initthisLastMonthDaysArr(year,month,monthDays){
			let arr = []
			let now = new Date();
			for(let i = 1 ; i <= monthDays ; i++){
				const dateItem = solarLunar.solar2lunar(year,month,i);
				let today,active
				if(month == now.getMonth()+1){
					if(now.getDate() == dateItem.cDay && now.getDay() == dateItem.nWeek){
						today = true;
						active = true;
						this.activeDate = {
							w:dateItem.nWeek,
							d:dateItem.cDay,
							date:dateItem,
							dayCn:dateItem.dayCn,
							type:'this',
							active,
							today
						};
						
					}else{
						today = false;
						active = false;
					}
				}else{
					if(i == 1){
						active = true;
						today = false;
					}else{
						active = false;
						today = false;
					}
				}
				arr.push({
					w:dateItem.nWeek,
					d:dateItem.cDay,
					date:dateItem,
					dayCn:dateItem.dayCn,
					type:'this',
					active,
					today
				})
			}
			return arr;
		},
		//初始化下月数据
		initNextMonthDaysArr(year,month,monthDays,thisLastMonthArr,preMonthArr){
			let needNextMonthDays = 42 - (thisLastMonthArr.length+preMonthArr.length);
			let arr = []
			for(let item = 1 ; item <= needNextMonthDays ; item++){
				const dateItem = solarLunar.solar2lunar(year,month+1,item);
				arr.push({
					w:dateItem.nWeek,
					d:dateItem.cDay,
					date:dateItem,
					dayCn:dateItem.dayCn,
					type:'next',
					active:false,
					today:false
				})
			}
			return arr;
		},
		//初始化年月日
		initYearMonthDays(year,month){
			year = year || new Date().getFullYear();
			month = month || new Date().getMonth()+1;
			let monthDays = this.getMonthDays(year,month)
			let thisLastMonthArr = this.initthisLastMonthDaysArr(year,month,monthDays);
			let preMonthArr = this.initPreMonthDaysArr(year,month,monthDays,thisLastMonthArr)
			let nextMonthArr = this.initNextMonthDaysArr(year,month,monthDays,thisLastMonthArr,preMonthArr)
			let totalMonthDaysArr = [...preMonthArr,...thisLastMonthArr,...nextMonthArr];
			// console.log(totalMonthDaysArr)
			return {
				m:month,
				y:year,
				data:totalMonthDaysArr
			}
		},
		//同步增量追加日期swipe
		syncPushDate(index){
			if(index == 0){
				let m = this.allMonthArr[0].m;
				let y = this.allMonthArr[0].y;
				let count = 12;
				let arr = [];
				while(count>0){
					if(m == 1){
						m = 12
						y--
					}else{
						m--;
					}
					arr.unshift(this.initYearMonthDays(y,m))
					count--
				}
				this.allMonthArr = [...arr,...this.allMonthArr]
				this.activeIndex = index+12
			}else if(index == this.allMonthArr.length - 1){
				let m = this.allMonthArr[index].m;
				let y = this.allMonthArr[index].y;
				if(m == 12){
					m = 1
					y++
				}else{
					m++;
				}
				let nextMonthArr = this.initYearMonthDays(y,m)
				this.$nextTick().then(() => {
					this.allMonthArr = [...this.allMonthArr,nextMonthArr]
					this.activeIndex = index
				})
			}else{
				this.$nextTick().then(() => {
					this.activeIndex = index
				})
			}
		},
		//根据类型渲染
		switchRenderType(h){
			let _this = this;
			//当类型为列表活日期时
			if(this.type == 'list' || this.type == 'date'){
				return h('van-swipe',{
					props:{
						'show-indicators':false,
						loop:false,
						'initial-swipe':this.activeIndex
					},
					ref:'swiper',
					on:{
						change(index){
							// _this.activeIndex = index;
							_this.syncPushDate(index);
							_this.getActiveSwipe(index);
						}
					}
				},this.allMonthArr.map(item => {
					return h('van-swipe-item',{},
						[
							h(PWeekList,{
								props:{
									'base-weeks':this.baseWeeks
								}
							}),
							h(PDateList,{
								props:{
									data:item.data,
									month:item.m,
									year:item.y
								},
								on:{
									//活动日期变更触发
									activeChange(res){
										_this.$emit('activeChange',res)
										_this.activeDate = res;
										item.data.forEach( dateItem => {
											if(dateItem.d == res.d && dateItem.w == res.w){
												dateItem.active = true;
											}else{
												dateItem.active = false
											}
										})
									}
								}
							})
						])
					}
				))
			}else{
				
				return h('div',{
					class:'p-month-list'
				},[
					h(PWeekList,{
						props:{
							'base-weeks':this.baseWeeks,
							shadow:true,
							activeDate:this.activeDate,
							'show-title':true,
						},
						on:{
							swipeToYearMonth(year,month){
								_this.swipeToYearMonth(year,month)
							}
						}
					}),
					h('van-swipe',{
						props:{
							'show-indicators':false,
							loop:false,
							'initial-swipe':this.activeIndex
							
						},
						ref:'swiper',
						on:{
							change(index){
								// _this.activeIndex = index;
								_this.syncPushDate(index);
								_this.getActiveSwipe(index);
							}
						}
					},this.allMonthArr.map(item => {
						return h('van-swipe-item',{},
							[
								h(PDateMonthList,{
									props:{
										data:item.data,
										month:item.m,
										year:item.y
									}
								})
							])
						}
					))
				])
			}
		},
		//滚动到指定年月
		swipeToYearMonth(year,month){
			let nowLastMonth = this.allMonthArr[this.allMonthArr.length-1];
			let nowFirstMonth = this.allMonthArr[0];
			let thisFirstMonth = nowFirstMonth.m;
			let thisFirstYear = nowFirstMonth.y;
			let thisLastYear = nowLastMonth.y;
			let thisLastMonth = nowLastMonth.m;
			let arr = [];
			let index;
			if(year>thisLastYear){
				while(thisLastYear < year){
					while(thisLastMonth<12){
						thisLastMonth++;
						arr.push(this.initYearMonthDays(thisLastYear,thisLastMonth))
					}
					if(thisLastMonth == 12){
						thisLastMonth = 0
						thisLastYear++
					}
				}
				if(thisLastYear == year){
					while(thisLastMonth<month){
						thisLastMonth++;
						arr.push(this.initYearMonthDays(thisLastYear,thisLastMonth))
					}
				}
				index = this.allMonthArr.length + arr.length - 1
			}else if(year == thisLastYear && month>thisLastMonth){
				while(thisLastMonth<month){
					thisLastMonth++;
					arr.push(this.initYearMonthDays(thisLastYear,thisLastMonth))
				}
				index = this.allMonthArr.length + arr.length - 1
			}
			if(year < thisFirstYear){
				while(thisFirstYear > year){
					while(thisFirstMonth>0){
						thisFirstMonth--;
						arr.unshift(this.initYearMonthDays(thisFirstYear,thisFirstMonth))
					}
					if(thisFirstMonth == 0){
						thisFirstMonth = 12
						thisFirstYear--
					}
				}
				if(thisFirstYear == year){
					while(thisFirstMonth>month){
						thisFirstMonth--;
						arr.unshift(this.initYearMonthDays(thisFirstYear,thisFirstMonth))
					}
				}
				index = 0
			}else if(year == thisFirstYear && month<thisFirstMonth){
				while(thisFirstMonth>month){
					thisFirstMonth--;
					arr.unshift(this.initYearMonthDays(thisFirstYear,thisFirstMonth))
				}
				index = 0
			}else{
				this.allMonthArr.forEach((item,index1) => {
					if(item.y == year && item.m == month){
						this.$nextTick().then(()=>{
							this.$refs.swiper.swipeTo(index1)
						})
					}
				})
			}
			if(index == 0){
				this.$refs.swiper.swipeTo(arr.length + this.activeIndex)
				this.allMonthArr = [...arr,...this.allMonthArr]
			}else{
				this.allMonthArr = [...this.allMonthArr,...arr]
			}
			this.$nextTick().then(()=>{
				this.$refs.swiper.swipeTo(index)
			})
		}
	},
	render(h){
		let _this = this
		return h('div',{
			class:'p-calendar'
		},[
			this.switchRenderType(h),
			// h('button',{
			// 	on:{
			// 		click(){
			// 			_this.swipeToYearMonth(2022,5)
						
			// 		}
			// 	}
			// },'点我去2022-03')
		])
	}
}
