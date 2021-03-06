import './p-calendar.scss'
import PWeekList from './p-week-list'
import PDateList from './p-date-list'
import PDateMonthList from './p-date-month-list'
import PCollapseBar from './p-collapse-bar'
import solarLunar from 'solarLunar';
//折叠算法
const computedCollapseData = (_this,swiper,collapseHeight,minHeight,maxHeight,activeRow,i) => {
	//获取swipe对象
	//获取swipe-item对象
	let swiperItem = _this.$refs[`swiper-item${i?i:_this.activeIndex}`]
	//获取当前的swipe-item对象
	let item = swiperItem.$el.children[0];
	//设置实时的item大月份字体的透明度
	item.children[item.children.length-1].style.opacity = collapseHeight/maxHeight
	//换算当前swipe-item内部垂直偏移量
	let itemCollapseHeight = ((maxHeight+minHeight)-collapseHeight)*(activeRow-1)*minHeight/maxHeight*-1;
	//设置拖滑状态中实时swipe的高度
	swiper.$el.style.height = collapseHeight + 'px'
	//设置拖滑状态中实时swipe-item内部垂直的便宜量
	item.style.marginTop = (itemCollapseHeight)+'px'
	//判断swipe滑动临界点
	if(collapseHeight<=minHeight ){
		swiper.$el.style.height = minHeight+'px'
		item.style.marginTop = (minHeight*(activeRow-1)*-1) + 'px'
		item.children[item.children.length-1].style.opacity = 0
	}else if (collapseHeight >=maxHeight){
		swiper.$el.style.height = maxHeight+'px'
		item.style.marginTop = '0px'
		item.children[item.children.length-1].style.opacity = 1
	}
}
//设置折叠过度开关
const setCollapseTransition = (_this,flag) => {
	let swiper = _this.$refs.swiper;
	let swiperItem = _this.$refs[`swiper-item${_this.activeIndex}`]
	let item = swiperItem.$el.children[0];
	if(flag){
		swiper.$el.style.transition = '.3s'
		swiperItem.$el.children[0].style.transition = '.3s'
		item.children[item.children.length-1].style.transition = '.3s'
	}else{
		swiper.$el.style.transition = 'none'
		swiperItem.$el.children[0].style.transition = 'none'
		item.children[item.children.length-1].style.transition = 'none'
	}
}
//设置当前激活的日期
const setActiveDateItem = (_this,index,t) => {
	let thisMonth = _this.allMonthArr[index]
	thisMonth.data.forEach(item => {
		item.active = false;
		// if(item.type == 'this'){
		if(item.date.cYear == t.date.cYear
		&&item.date.cMonth == t.date.cMonth 
		&&item.date.cDay == t.date.cDay){
			item.active = true
		}
		// }
	})
	_this.activeIndex = index;
	_this.activeDate = t
}
//渲染type为date｜list类型的数据
const renderDateList = (h,_this) => {
	let touch = false;
	let minHeight = window.innerWidth/375*40;
	let maxHeight = window.innerWidth/375*240;
	let lastHeight = 0
	let upDown = 'down'
	let moved = false
	let activeRow;
	_this.getActiveMonth.data.find((item, index) => {
		if(item.active){
			activeRow = Math.floor(index/7)+1
		}
	})
	return [
		h('div',{
			class:`p-date-list-container ${_this.renderCollapse?'collapse':'not-collapse'}`
		},[
			h(PWeekList,{
				props:{
					'base-weeks':_this.baseWeeks
				}
			}),
			h('van-swipe',{
				props:{
					'show-indicators':false,
					loop:false,
					'initial-swipe':_this.activeIndex
				},
				ref:'swiper',
				on:{
					change(index){
						// _this.activeIndex = index;
						_this.syncPushDate(index);
						_this.getActiveSwipe(index);
						setCollapseAnimate.call(_this,index)
					}
				}
			},_this.allMonthArr.map((item,index) => {
				return h('van-swipe-item',{
						ref:`swiper-item${index}`
					},
					[
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
									setActiveDateItem(_this,_this.activeIndex,res)
								}
							}
						}),
					])
				}
			)),
			h(PCollapseBar,{
				props:{
					collapse:_this.renderCollapse
				},
				on:{
					touchstart(e){
						e.preventDefault()
						setCollapseTransition(_this,false)
						touch = true;
					},
					touchmove(e){
						if(touch){
							//判断滑动方向
							if(e.changedTouches[0].pageY >lastHeight){
								upDown = 'down'
							}else{
								upDown = 'up'
							}
							//设置手指滑动状态
							moved = true
							let swiper = _this.$refs.swiper
							//获取当前折叠的高度
							let collapseHeight = Math.floor(e.changedTouches[0].pageY - swiper.$el.offsetTop)
							computedCollapseData(_this,swiper,collapseHeight,minHeight,maxHeight,activeRow)
							lastHeight = e.changedTouches[0].pageY
						}
					},
					touchend(){
						if(moved){
							if(upDown == 'up'){
								_this.renderCollapse = true
							}else{
								_this.renderCollapse = false
							}
						}else{
							_this.renderCollapse = !_this.renderCollapse
						}
						touch = false
						moved = false
					}
				}
			})
		]),
		h('div',{
			class:`p-date-list-action-container`
		},[
			h('div',{
				class:`p-date-list-month-title`
			},[
				!_this.isThisDay?
				h('div',{
					class:'this-month',
					on:{
						click(){
							let setActive = true
							let t = _this.today
							let d = _this.activeDate
							_this.swipeToYearMonth(t.date.cYear,t.date.cMonth)
							if(t.date.cYear == d.date.cYear&&t.date.cMonth == d.date.cMonth){
								setActiveDateItem(_this,_this.activeIndex,t)
							}else{
								_this.$refs.swiper.$on('change',function(index){
									if(setActive){
										setActiveDateItem(_this,index,t)
										setActive = false
									}
								})
							}
						}
					}
				},'今'):h(''),
				_this.getActiveMonthData
			])
		])
	]
}
const setCollapseAnimate = function(i){
	let swiper = this.$refs.swiper;
	let minHeight = window.innerWidth/375*40;
	let maxHeight = window.innerWidth/375*240;
	let activeRow;
	this.allMonthArr[i?i:this.activeIndex].data.find((item, index) => {
		if(item.active){
			activeRow = Math.floor(index/7)+1
		}
	})
	if(this.renderCollapse){
		computedCollapseData(this,swiper,minHeight,minHeight,maxHeight,activeRow,i)
	}else{
		computedCollapseData(this,swiper,maxHeight,minHeight,maxHeight,activeRow,i)
	}
}
//渲染type为month的数据
const renderMonthList = (h,_this) => {
	return h('div',{
		class:'p-month-list-container'
	},[
		h(PWeekList,{
			props:{
				'base-weeks':_this.baseWeeks,
				shadow:true,
				activeDate:_this.activeDate,
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
				'initial-swipe':_this.activeIndex
				
			},
			ref:'swiper',
			on:{
				change(index){
					// _this.activeIndex = index;
					_this.syncPushDate(index);
					_this.getActiveSwipe(index);
				}
			}
		},_this.allMonthArr.map(item => {
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
			activeDate:{},
			renderCollapse:false,
			today:{}
		}
	},
	watch:{
		collapse(v){
			this.renderCollapse = v
		},
		renderCollapse(v){
			setCollapseTransition(this,true)
			setCollapseAnimate.call(this)
		}
	},
	mounted(){
		let html = document.querySelector('html');
		html.style.fontSize = (window.innerWidth/375)+'px'
		this.renderCollapse = this.collapse;
		setCollapseAnimate.call(this)
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
	computed:{
		getActiveMonth(){
			return this.allMonthArr[this.activeIndex]
		},
		getActiveMonthData(){
			return `${this.activeDate.date.cMonth}月${this.activeDate.date.cDay}日 ${this.activeDate.date.ncWeek}`	
		},
		isThisDay(){
			let d = this.activeDate.date;
			let t = this.today.date;
			if(d.cYear == t.cYear
			&&d.cMonth == t.cMonth
			&&d.cDay == t.cDay){
				return true
			}else{
				return false
			}
		},
	},
	methods:{
		getMonthDays(year,month){
			let d = new Date(year,month,0)
			return d.getDate();
		},
		
		//获取当前选中的swipe
		getActiveSwipe(index){
			let monthObj = this.allMonthArr[index];
			let activeObj = monthObj.data.filter(item => {
				if(item.type == 'this'){
					if(item.d == this.activeDate.d
						&&item.w == this.activeDate.w 
						&&item.dayCn == this.activeDate.dayCn){
						return true
					}
					if(item.today||item.active){
						return true
					}
				}
				return false
			})
			if(activeObj.length==2){
				this.activeDate = activeObj[1]
			}else if(activeObj.length==1){
				this.activeDate = activeObj[0]
			}else{
				this.activeDate = monthObj.data.filter(item => item.type=='this'&&item.d ==1)[0]
			}
			// this.activeDate = activeObj[1]||
			// let activeObj1 = activeObj.filter(item => item.type=="this"&&item.d == this.activeDate.d&&item.w == this.activeDate.w &&item.dayCn == this.activeDate.dayCn)
			// if(activeObj1.length>0){
			monthObj.data.forEach(item => {
				item.active = false
				if(item.type == 'this'){
					if(item.d == this.activeDate.d&&item.w == this.activeDate.w &&item.dayCn == this.activeDate.dayCn){
						item.active = true
					}
				}
			})
			// 	activeObj = activeObj1
			// }
			this.$emit('change',{month:monthObj,activeDate:this.activeDate})
			this.$emit('activeChange',this.activeDate)
			// this.activeDate = activeObj.length>0?activeObj[0]:this.activeDate
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
						this.today = {
							w:dateItem.nWeek,
							d:dateItem.cDay,
							date:dateItem,
							dayCn:dateItem.dayCn,
							type:'this',
							active,
							today
						}
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
				if(y>=1900){
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
				}
			}else if(index == this.allMonthArr.length - 1){
				let m = this.allMonthArr[index].m;
				let y = this.allMonthArr[index].y;
				if(y<=2100){
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
				}
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
				return renderDateList(h,_this)
			}else{
				return renderMonthList(h,_this)
			}
		},
		//滚动到指定年月
		swipeToYearMonth(year,month){
			if(year<=1900){
				year = 1900
			}
			if(year>=2100){
				year = 2100
			}
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
		])
	}
}
