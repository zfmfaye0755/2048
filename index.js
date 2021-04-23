$(function() {
	localStorage.removeItem("maxScore");
	//是否产生新元素
	var isNewRndItme = false;
	var gameScore = 0; //记录当前分数
	var maxScore = 0; //历史最高纪录
	
	/*
	Web 存储 API 提供了 sessionStorage （会话存储） 和 localStorage（本地存储）两个存储对象来对网页的数据进行添加、删除、修改、查询操作。
	
	localStorage 用于长久保存整个网站的数据，保存的数据没有过期时间，直到手动去除。
	
	sessionStorage 用于临时保存同一窗口(或标签页)的数据，在关闭窗口或标签页之后将会删除这些数据。
	*/
	if (localStorage.maxScore) {
		maxScore = localStorage.maxScore-0;
	} else {
		maxScore = 0;
	}

	//游戏初始化
	gameInit();

	//上下左右监听事件
	$('body').keydown(function(e) {
		switch (e.keyCode) {
			case 37:
				// left
				console.log('left');
				isNewRndItme = false; //先不产生新元素
				move('left'); //先移动
				isGameOver(); //是否要结束游戏
				break;
			case 38:
				// up
				console.log('up');
				isNewRndItme = false;
				move('up');
				isGameOver();
				break;
			case 39:
				// right
				console.log('right');
				isNewRndItme = false;
				move('right');
				isGameOver();
				break;
			case 40:
				// down
				console.log('down');
				isNewRndItme = false;
				move('down');
				isGameOver();
				break;
		}
	});

	//解决移动问题
	function move(direction) {
		//获取所有非空元素
		var nonEmptyItems = $('.gameBody .row .nonEmptyItem');
		//如果按下的方向是左或者上，则正向遍历非空元素
		if (direction == 'left' || direction == 'up') {
			for (var i = 0; i < nonEmptyItems.length; i++) {
				var currentItem = nonEmptyItems.eq(i);
				itemMove(currentItem, direction); //从左向右遍历，左边的先移动，让出位置才会轮到
			}
		} else if (direction == 'right' || direction == 'down') { //如果是向右或者向下，就要反向遍历
			for (var i = nonEmptyItems.length - 1; i >= 0; i--) {
				var currentItem = nonEmptyItems.eq(i);
				itemMove(currentItem, direction);
			}

		}
		//是否产生新元素
		if (isNewRndItme) { //移动完成后，就会在空白的地方新生成一个2或者4
			newRndItem();
			refreshColor();
		}
	}

	//判断是否满了，是否不能移动
	function isGameOver() {
		//获取所有元素
		var items = $('.gameBody .row .item');
		//获取所有非空元素
		var nonEmptyItems = $('.gameBody .row .nonEmptyItem');
		if (items.length == nonEmptyItems.length) { //所有格子都有数
			//遍历所有非空元素
			for (var i = 0; i < nonEmptyItems.length; i++) {
				var currentItem = nonEmptyItems.eq(i);
				if (getSideItem(currentItem, 'up').length != 0 && currentItem.html() == getSideItem(currentItem, 'up').html()) {
					//当当前元素向上时，如果当前元素与上面元素内容相等，那么还有挽救的余地，没有结束游戏
					return;
				} else if (getSideItem(currentItem, 'down').length != 0 && currentItem.html() == getSideItem(currentItem, 'down')
					.html()) {
					//下边元素存在 且 当前元素中的内容等于下边元素中的内容
				} else if (getSideItem(currentItem, 'left').length != 0 && currentItem.html() == getSideItem(currentItem, 'left')
					.html()) {
					//左边元素存在 且 当前元素中的内容等于左边元素中的内容
					return;
				} else if (getSideItem(currentItem, 'right').length != 0 && currentItem.html() == getSideItem(currentItem,
						'right').html()) {
					//右边元素存在 且 当前元素中的内容等于右边元素中的内容
					return;
				}
			}

		}else{
			return;
		}
		 showGameOver(true);
	}
	//点击刷新游戏按钮会执行刷新游戏
	function refreshGame() {
		//获取所有的items（格子）。然后清空它
		var items = $(".gameBody .row .item");
		for (var i = 0; i < items.length; i++) {
			items.eq(i).html('').removeClass('nonEmptyItem').addClass('emptyItem');
		}
		gameScore = 0;
		//分数清零
		$('#gameScore').html(gameScore);
		//随机生成两个新元素
		newRndItem();
		newRndItem();
		//刷新颜色
		refreshColor();
		showGameOver(false);
	}


	//获取指定方向上的相邻格子
	function getSideItem(currentItem, direction) {
		//当前元素的位置
		var currentItemX = currentItem.attr("x") - 0;
		var currentItemY = currentItem.attr("y") - 0;

		//根据指定方向获取旁边的元素：
		switch (direction) {
			case 'left':
				var sideItemX = currentItemX;
				var sideItemY = currentItemY - 1;
				break;
			case 'right':
				var sideItemX = currentItemX;
				var sideItemY = currentItemY + 1;
				break;
			case 'up':
				var sideItemX = currentItemX - 1;
				var sideItemY = currentItemY;
				break;
			case 'down':
				var sideItemX = currentItemX + 1;
				var sideItemY = currentItemY;
				break;
		}
		//旁边元素
		var sideItem = $('.gameBody .row .x' + sideItemX + "y" + sideItemY); //如果匹配不到，那么返回[]
		return sideItem;
	}
	
	//移动格子元素
	function itemMove(currentItem, direction) {
		var sideItem = getSideItem(currentItem, direction);
	
		if (sideItem.length == 0) {
			//当前元素在最边上，不动
		} else if (sideItem.html() == '') { //当旁边元素为空时，数字可以向该方向移动
			sideItem.html(currentItem.html()).removeClass('emptyItem').addClass('nonEmptyItem');
			currentItem.html('').removeClass('nonEmptyItem').addClass('emptyItem'); //先移动最direction那边的，清空一个算一个
			itemMove(sideItem, direction); //一直移动，直到移到最边上
			isNewRndItme = true;
	
		} else if (sideItem.html() != currentItem.html()) { //左（右、上、下）侧元素和当前元素内容不同
			//不动，由此可以看出，向左移动就从左边开始遍历，向右移动就从右往左遍历
			//向上移动就从上往下开始遍历，向下移动就先从下开始遍历，因为为了腾地方
		} else { //相邻元素和当前内容一样
			sideItem.html((sideItem.html() - 0) * 2); //合并，加了一倍
			currentItem.html('').removeClass('nonEmptyItem').addClass('emptyItem');
			gameScore += (sideItem.text() - 0) * 10; //合成后的数值的十倍
			$("#gameScore").html(gameScore);
			maxScore = maxScore < gameScore ? gameScore : maxScore;
			$("#maxScore").html(maxScore);
			localStorage.maxScore = maxScore;
			isNewRndItme = true;
			return;
		}
	
	}
	
	function gameInit(){
		if (localStorage.maxScore) {
			maxScore = localStorage.maxScore-0;
		} else {
			maxScore = 0;
		}
		//初始化分数
		$('#gameScore').html(gameScore);
		//最大分值
		$('#maxScore').html(maxScore);
		//为刷新按钮绑定事件
		$('.refreshBtn').click(refreshGame);
		//随机生成两个新元素
		newRndItem();
		newRndItem();
		//刷新颜色
		refreshColor();
	}
	
	//产生随机数，包括min、max
	function getRandom(min, max){
	  return min + Math.floor(Math.random() * (max - min + 1));
	}
	
	//刷新颜色
	function refreshColor(){
	    var items = $('.gameBody .item');
	    for(var i = 0; i < items.length; i++) {
	        // console.log(items.eq(i).parent().index());
	        switch (items.eq(i).html()) {
	            case '': 
	                items.eq(i).css('background', '');
	                break;
	            case '2': 
	                items.eq(i).css('background', 'rgb(250, 225, 188)');
	                break;
	            case '4': 
	                items.eq(i).css('background', 'rgb(202, 240, 240)');
	                break;
	            case '8': 
	                items.eq(i).css('background', 'rgb(117, 231, 193)');
	                break;
	            case '16': 
	                items.eq(i).css('background', 'rgb(240, 132, 132)');
	                break;
	            case '32': 
	                items.eq(i).css('background', 'rgb(181, 240, 181)');
	                break;
	            case '64': 
	                items.eq(i).css('background', 'rgb(182, 210, 246)');
	                break;
	            case '128': 
	                items.eq(i).css('background', 'rgb(255, 207, 126)');
	                break;
	            case '256': 
	                items.eq(i).css('background', 'rgb(250, 216, 216)');
	                break;
	            case '512': 
	                items.eq(i).css('background', 'rgb(124, 183, 231)');
	                break;
	            case '1024': 
	                items.eq(i).css('background', 'rgb(225, 219, 215)');
	                break;
	            case '2048': 
	                items.eq(i).css('background', 'rgb(221, 160, 221)');
	                break;
	            case '4096': 
	                items.eq(i).css('background', 'rgb(250, 139, 176)');
	                break;
	        }
	    }
	}
	
	//随机生成新元素
	function newRndItem(){
	    //随机生成新数字
	    var newRndArr = [2, 2, 4];
	    var newRndNum = newRndArr[getRandom(0, 2)];
	    console.log('newRndNum: ' + newRndNum);
	    //随机生成新数字的位置
	    var emptyItems = $('.gameBody .row .emptyItem');
	    var newRndSite = getRandom(0, emptyItems.length - 1);
	    emptyItems.eq(newRndSite).html(newRndNum).removeClass('emptyItem').addClass('nonEmptyItem');
	}  
	 
	  
	  
	 function showGameOver(flag){
		 if(flag){//则显示
		
			 $('#gameOverModal').append("游戏结束！");
			 $('.gameover').show();
			 $('.gameoverInfo').show();
			  localStorage.setItem("maxScore",gameScore);
		 }else{//则隐藏
			 $('#gameOverModal').html('');
			 $('.gameover').hide();
			 $('.gameoverInfo').hide();
		 }
	 } 
});

$(window).resize(function(){
	console.log(window.innerWidth);
	console.log(window.innerHeight);
	var left = (window.innerWidth - 500)/2;
	console.log(left);
	$('.gameoverInfo')[0].style.left = left + "px";
})



