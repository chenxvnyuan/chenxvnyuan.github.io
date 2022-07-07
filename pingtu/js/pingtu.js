/**
 * 拼图游戏   
 */

$(function(){
		var $divs=$(".box div");    //每个格子中的div,负责显示图片的某一部分
		var $showTimeP=$(".game p");  //P标签用来计时
		
		var my$imgs=["images/pt1.jpg","images/pt2.jpg","images/pt3.jpg","images/pt4.jpg"];   //要使用的图片
		var imgIndex=0;   //当前使用的图片序号
		
		var grids=[];   //一个格子系统，用于定义每个格子的左上角位置
		var boxWidth=540; //固定界面的宽度，界面的高度由图片的宽高等比例缩放
		var boxHeight=540;
		
		var time=0;   //已经用了多少秒
		var timer;     //计时器
		var isstart=false;   //是否已经开始计时		
		/**
		 * 初始化大盒子，img,div的宽高，并初始化格子系统的宽高
		 * 
		 */
		function initImg(){  
			var $imgs=$(".box img");
			$imgs.attr("src",my$imgs[imgIndex]);
			var imgWidth=$imgs.eq(0).width();
			var imgHeight=$imgs.eq(0).height();			 
		    boxHeight=Math.ceil(540*imgHeight/imgWidth);
			$imgs.width(boxWidth);   // 每个img中的图片缩放到大盒子的宽高一样
			$imgs.height(boxHeight);
			
			$(".box").width(boxWidth+2);   //缩放大盒子的宽度和高度
			$(".box").height(boxHeight+2);
	
			var divHeight=Math.ceil(boxHeight/3);  //计算出每个小格子的宽高
			var divWidth=Math.ceil(boxWidth/3);
			
			$divs.height(divHeight);   //缩放每个格子的宽高
			$divs.width(divWidth);
			
			initGrid(divWidth,divHeight);   //初始化格子系统，记录每个格子的位置
			
			$.each($imgs,function(i,v){		//每个格子中显示图片的某一部分		
				$(this).css({"top":-grids[i].top+"px","left":-grids[i].left+"px"});
				
			});
			
		}
		
		/**
		 * 计算出每个格子的左上角位置和当前位置放的div的序号，最后一个格子没有div，序号是-1
		 * 
		 */		 
		function initGrid(width,height){
			for(var i=0;i<9;i++){		
				if(i==8){
					grids[i]={"top":parseInt(i/3)*height,"left":i%3*width,"div":-1};
				}else{
					grids[i]={"top":parseInt(i/3)*height,"left":i%3*width,"div":i};
				}
			}
		}
		
		/**
		 * 点击一个div时，移动到它相邻的空格
		 */
		$divs.click(function(){  
			
			if(!isstart){   //游戏是否已经开始计时，如果没有开始，就开始计时				
				isstart=true;
				timer=setInterval(showTime,1000);
			}
			
			var divi=$divs.index($(this));	//获取当前点击的div序号		
			var grid=-1;
			for(g in grids){     //通过div序号获取到点击的格子序号
				if(grids[g].div==divi){
					grid=g;
				}				
			}					 
			 
			switch(grid){  //通过格子序号，获取格子能移动到的相邻的格子
				case '0':
					move(0,[1,3]);					 
					break;
				case '1':
					move(1,[0,2,4]);					 
					break;
				case '2':
					move(2,[1,5]);					 
					break;
				case '3':
					move(3,[0,4,6]);					 
					break;
				case '4':
					move(4,[1,3,5,7]);					 
					break;
				case '5':
					move(5,[2,4,8]);					 
					break;						
				case '6':
					move(6,[3,7]);					 
					break;		
				case '7':
					move(7,[4,6,8]);					 
					break;	
				case '8':
					move(8,[5,7]);					 
					break;				
			}			
		});
		
		
		
		/**
		 * 判断目标格子是否为空，如果是空的，将源格子中的div移动到目标格子
		 * @param {Number} fromIndex   现在所有的格子序号
		 * @param {Number} toIndex    目标格子的序号
		 */
		function move(fromIndex,toIndex){ 
			for(var i in toIndex){
				var index=toIndex[i];
				if(grids[index].div<0){
					var divIndex=grids[fromIndex].div;								
					$divs.eq(divIndex).animate({"left":grids[index].left+"px","top":grids[index].top},500);
					grids[fromIndex].div=-1;
					grids[index].div=divIndex;
					isWin();
				}				
			}			
		}
		
		/**
		 * 产生从0到7随机排列的数组
		 */
		function getRandoms(){
			var nums=[];			 
			while(nums.length<8){
				/*
				 	产生一个大于等于m，但小于等于n的随机数
				 	Math.random()*(n-m+1)+m
				 */
				var num=Math.floor(Math.random()*8);
				if(nums.indexOf(num)<0){					
					nums.push(num);
				}
			}			 
			return nums;
		}
		
		
		/**
		 * 初始化，将每个div放在它的位置
		 */
		function init(){
			initImg();
			var randnums=getRandoms();  //获取一个由0到7组成的随机排列的数组
			randnums.push(-1);          //数组的最后添加-1，表示这里没有div
			$.each(grids,function(i,v){
				grids[i].div=randnums[i];
				if(randnums[i]>=0){
					$divs.eq(randnums[i]).css({"left":grids[i].left+"px",
												"top":grids[i].top+"px"});
				}				
			});
		}	
		
		/**
		 * 显示计时的时间
		 */
		function showTime(){
			time++;
			$showTimeP.text("已用时间"+time+"秒");
			
		}
		
		/**
		 * 判断是否赢了，如果赢了，显示大图，game over
		 */
		function isWin(){
			var win=true;
			for(var i=0;i<8;i++){
				if(grids[i].div!=i){
					win=false;
					break;
				}
			}
			if(win){
				clearInterval(timer);
				$divs.hide();
				$divs.eq(0).width(boxWidth);
				$divs.eq(0).height(boxHeight);	
				$divs.eq(0).show(500,function(){$showTimeP.text("你成功了，用时"+time+"秒");});				
			}
			
		} 
		
		/**
		 * 点击左边的图片，选择要使用的图片，并初始化，重新开始
		 */
		$(".pic img").click(function(){
			clearInterval(timer);
			imgIndex=$(".pic img").index($(this));
			init();
			time=-1;
			showTime();
			isstart=false;
			$divs.show();
			
		});
		
		init();		
		
	});
	