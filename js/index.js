$(document).ready(function(){
	var app = new Vue({
		el:'#app',
		data:{
			inp:'童话',
			song:null,
			songsource:null,
			lyric:null,
			afterlyric:null,
		},
		methods:{
			getsong:function(){
				this.$http.get('https://api.imjad.cn/cloudmusic/?type=search&s='+this.inp).then(response =>{
					this.song = response.body.result;
				},reject =>{
					alert('you basters');
				})
				
				/*var _this = this;
				$.ajax({
					type:'get',
					url:'https://api.imjad.cn/cloudmusic/?type=search&s='+this.inp,
					async:true,
					success:function(data){
						_this.song = data.result;
				
					}
				})*/
			},
			broadsong:function(id){
				/*$.ajax({
					type:'get',
					url:'https://api.imjad.cn/cloudmusic/?type=song&id='+id,
					async:true,
					success:(data) =>{
						this.songsource = data.data[0].url
					}
				})*/
				this.$http.get('https://api.imjad.cn/cloudmusic/?type=song&id='+id).then(response =>{
					this.songsource = response.body.data[0].url;
				},reject =>{
					alert('you basters');
				});
				
				this.$http.get('https://api.imjad.cn/cloudmusic/?type=lyric&id='+id).then(response =>{
					this.lyric = response.body.lrc.lyric;
					
//					alert(typeof(this.lyric));
					//转换成数组
					let brreg = /\n/;
					let timereg = /\[\d{2,3}\:\d{2,3}\.\d{1,3}\]/;
					this.lyric = this.lyric.split(brreg);
//					alert(typeof(this.lyric));
					
					//时间批配
					let time = [];
					for(let i =0;i < this.lyric.length;i++){
						time.push(this.lyric[i].match(timereg));
					}
					
					//歌词匹配
					let lyr = [];
					for(let i =0;i < this.lyric.length;i++){
						this.lyric[i] = this.lyric[i].replace(timereg,'');
						lyr.push(this.lyric[i]);
					}
					
					//合并数组
					var aft = [];
					var t = [];
					for(let i = 0;i <time.length-1;i++){
						t = time[i].toString().slice(1,-1).split(":");
            t= parseInt(t[0],10) * 60 + parseInt(t[1]);
						console.log(t);
						aft[i] = [t,lyr[i]];
					}
					var _this = this;
					this.$refs.Video.ontimeupdate = function(){
						for(let i =0;i< aft.length;i++){
							if(this.currentTime > aft[i][0]){
//								console.log(this.currentTime);
								_this.afterlyric = aft[i][1];
//								console.log(_this.afterlyric);
							}
						}
					}
					
				},reject =>{
					alert('hello again');
				});
				
			}
		}
	})
	
})