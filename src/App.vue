<template>
	<div style="height: 100%;position: relative;padding-top: 20px;box-sizing: border-box;">
		<div style="height: 20px;position: absolute;top: 0;left: 0;width: 100%;font-size: 14px;">
			切换形态:
			<input type="radio" name="a" @change="handleRadioChange('list')" >列表
			<input type="radio" name="a" @change="handleRadioChange('date')" >日期
			<input type="radio" name="a" @change="handleRadioChange('month')" >月份
			<button @click="handleClick">测试</button>
		</div>
		
		<p-calendar 
			class="p-date-container"
			:type="type"
			:collapse="collapse"
			@activeChange="handleActiveChange" 
			@change="handleChange"
			ref="p">
			
		</p-calendar>
	</div>
</template>

<script>
	
	export default{
		data(){
			return {
				type:'list',
				collapse:true
			}
		},
		mounted(){
			// setTimeout(() => {
			// 	this.$refs.p.swipeToYearMonth(2050,12)
			// },1000)
		},
		methods:{
			handleActiveChange(e){
				console.log(e)
			},
			handleChange(e){
				console.log(e)
			},
			handleRadioChange(e){
				console.log(e)
				this.type = e
			},
			handleClick(){
				this.collapse = !this.collapse
			}
		}
	}
</script>

<style  lang="scss">	
	body,html{
		margin: 0;
		padding: 0;
		height: 100%;
	}
	
</style>
