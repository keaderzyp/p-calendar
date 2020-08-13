<template>
	<div style="height: 100%;position: relative;padding-top: 20px;box-sizing: border-box;">
		<div style="height: 20px;position: absolute;top: 0;left: 0;width: 100%;">
			切换形态:
			<input type="radio" name="a" @change="handleRadioChange('list')" >列表
			<input type="radio" name="a" @change="handleRadioChange('date')" >日期
			<input type="radio" name="a" @change="handleRadioChange('month')" >月份
		</div>
		
		<p-calendar 
			class="p-date-container"
			:type="type"
			@activeChange="handleActiveChange" 
			@change="handleChange">
			
		</p-calendar>
	</div>
</template>

<script>
	
	export default{
		data(){
			return {
				type:'list'
			}
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
