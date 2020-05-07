	var CELL_SIZE = 50;
	var row_padding = 30;
	var col_padding = 20;

	var Category = {
		SABER:0,			// 劍
		ARCHER:1,			// 弓
		LANCER:2,			// 槍
		RIDER:3,			// 騎
		CASTER:4,			// 術
		ASSASSIN:5,			// 殺
		BERSERKER:6,		// 狂
		RULER:7,			// 秤
		AVENGER:8,			// 仇
		ALTEREGO:9,		// 丑
		FOREIGNER:10,		// 外
		MOONCANCER:11		// 月
	};

	var CategoryName = [
		'saber',			// 劍
		'archer',			// 弓
		'lancer',			// 槍
		'rider',			// 騎
		'caster',			// 術
		'assassin',			// 殺
		'berserker',		// 狂
		'ruler',			// 秤
		'avenger',			// 仇
		'alterego',			// 丑
		'foreigner',		// 外
		'mooncancer'		// 月
	];

	var CategoryNUM = [9, 8, 7, 8, 9, 7, 7, 3, 2, 3, 2, 0];

	document.oncontextmenu = function(){return false};

	document.onmouseup = function(e){
		if(e.button===2){
			rightClick(e);
		}
	}

	var Unit = function(imageUrl){
		var self = this;
		this.imageUrl = imageUrl;
		this.npLv = 0;
		this.image = new Image();
		this.image.src = this.imageUrl;
	};

	var CategoryKeys = Object.keys(Category);
	var CategoryLen = CategoryKeys.length;
	var categoryImages = new Array(CategoryLen);

	//載入職階圖

	for(var i = 0 ; i < CategoryLen ; ++ i){
		categoryImages[i] = new Image();
	}

	for(const key in Category) {
		categoryImages[Category[key]].src = "images-mini/class/class_" + (Category[key] + 1) + ".jpg";
		//unitnum += CategoryNUM[key];
	}

	//載入英靈圖

	var units = [];
	for (i = 0; i < CategoryLen; i++) {
		units[i] = [];
		for (j = 0; j < CategoryNUM[i]; j++) {
			units[i][j] = new Unit("images-mini/" + CategoryName[i] + "/" + (j + 1) + ".jpg");
		}
	}


	var canvas, context;

	function init(){
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		context.font="20px Microsoft JhengHei";

		canvas.onclick = onCanvasClick;

		context.fillStyle = 'rgb(176, 176, 176)';
		context.fillRect (0, 0, 700, 880);
		//context.fillStyle = 'rgba(0, 0, 200, 0.5)';
		//context.fillRect (30, 30, 500, 500);

		for(var category = 0; category < CategoryLen; category++){
			context.drawImage(categoryImages[category], 0, category * CELL_SIZE + row_padding * category, CELL_SIZE, CELL_SIZE);
		}

		for (i = 0; i < CategoryLen; i++) {
			for (j = 0; j < CategoryNUM[i]; j++) {
				context.drawImage(units[i][j].image, (j + 1) * (CELL_SIZE + col_padding), i * (CELL_SIZE + row_padding), CELL_SIZE, CELL_SIZE);
				context.fillStyle = 'rgb(0, 0, 0, 0.6)';
				context.fillRect ((j + 1) * (CELL_SIZE + col_padding), i * (CELL_SIZE + row_padding), CELL_SIZE, CELL_SIZE);
				context.fillStyle = 'rgb(0, 0, 0)';
				context.font="20px Microsoft JhengHei";
				context.fillText("寶0",(j + 1) * (CELL_SIZE + col_padding) + 8, (i + 1) * (CELL_SIZE + row_padding) - 10);
			}
		}
	}

	function rightClick(event){

		var rect = event.target.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		var attribute = Math.floor(x / (CELL_SIZE + col_padding));
		var category = Math.floor(y / (CELL_SIZE + row_padding));
		if(x - (attribute * (CELL_SIZE + col_padding)) < CELL_SIZE && y - category * (CELL_SIZE + row_padding) < CELL_SIZE && attribute != 0 && attribute <= CategoryNUM[category]){
			if(units[category][attribute - 1].npLv){
				units[category][attribute - 1].npLv -= 1;

				context.fillStyle = 'rgb(176, 176, 176)';
				context.fillRect(attribute * (CELL_SIZE + col_padding),
					(category + 1) * (CELL_SIZE + row_padding) - row_padding,
					CELL_SIZE,
					row_padding);
				
				//context.font="20px Microsoft JhengHei";
				context.fillStyle = 'rgb(0, 0, 0)';
				context.fillText("寶" + units[category][attribute - 1].npLv,	 attribute * (CELL_SIZE + col_padding) + 8, (category + 1) * (CELL_SIZE + row_padding) - 10);

				if(units[category][attribute - 1].npLv == 0){
					context.fillStyle = 'rgb(0, 0, 0, 0.6)';
					context.fillRect (attribute * (CELL_SIZE + col_padding), category * (CELL_SIZE + row_padding), CELL_SIZE, CELL_SIZE);
				}
			}
		}
	}

	function onCanvasClick(event){

		var rect = event.target.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		var attribute = Math.floor(x / (CELL_SIZE + col_padding));
		var category = Math.floor(y / (CELL_SIZE + row_padding));
		if(x - (attribute * (CELL_SIZE + col_padding)) < CELL_SIZE && y - category * (CELL_SIZE + row_padding) < CELL_SIZE && attribute != 0 && attribute <= CategoryNUM[category]){
			if(!units[category][attribute - 1].npLv){
				context.drawImage(units[category][attribute - 1].image, attribute * (CELL_SIZE + col_padding), category * (CELL_SIZE + row_padding), CELL_SIZE, CELL_SIZE);
			}
			if(units[category][attribute - 1].npLv < 5){
				units[category][attribute - 1].npLv += 1;
				context.fillStyle = 'rgb(176, 176, 176)';
				context.fillRect(attribute * (CELL_SIZE + col_padding),
					(category + 1) * (CELL_SIZE + row_padding) - row_padding,
					CELL_SIZE,
					row_padding);
				context.fillStyle = 'rgb(0, 0, 0)';
				context.fillText("寶" + units[category][attribute - 1].npLv,	 attribute * (CELL_SIZE + col_padding) + 8, (category + 1) * (CELL_SIZE + row_padding) - 10);
			}
			//context.fillStyle = 'rgb(0, 0, 0, 0.5)';
			//context.fillRect ( attribute * (CELL_SIZE + col_padding), category * (CELL_SIZE + row_padding), CELL_SIZE, CELL_SIZE);
		}
	
	}

	function openImage(){
		try{
			var image = new Image();
			var canvas = document.getElementById("canvas");
			image.src = canvas.toDataURL("image/png");
			window.open(image.src, "window");
		}catch(e){
			alert(e);
		}
	}
