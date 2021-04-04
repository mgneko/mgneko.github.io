	var canvas, context;
	var CELL_SIZE = 50;
	var caculateField = 70;
	var row_padding = 30;
	var col_padding = 20;
	var marginTop = 10;
	var marginLeft = 10;
	var country = "tw";
	var mode = 0;
	var luckyBag = 0;
	var CategoryNum;
	var bgcolor = "rgb(176, 176, 176)";
	var mask = "rgb(0, 0, 0, 0.6)";
	var font_color = "rgb(0, 0, 0)";
	var unitMissing = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsSAAALEgHS3X78AAAOoElEQVRoga2Ze3Bc1X3Hv79z7q5W+5B2Jetly9hjC9kWRpIhdkxSJ5kBbB4DBZt4kpnMpKT2TJqUMCbG/JshnbSDH5iM0zSUtCnMNHFiaIgdgmWGmqlNYlpobYpxHTCW/JSNtLvax93de8759Y9772ol7epBODNn9t5z7z3n9znf3++8FphFEoAAgI5gcN6acHgFAEhAzubbuSRJJAFgbWNjz/xAoKWy7T85CUCAiKKAta+p6eDRJUuSa4CbQAQJWJ9KIwAsIgtC4At1dSvf6u5O7U0kDkYACSL6k2EkkQARNUoZfLa+/uCFvj6+tHo1v5pIXP0c0PtpwfgQd8+fv+q/Fiy4dvWWW/jcypW807J+HQMCs4Gp6R5SCKGZTSIUCv1DPP7S+gUL7o22tqpYXx/HcrlYd6Gw8T9te+BjoisSsBgwnwhCCEsxq/uXLbt1d3394dZgsCXW1aUj0ajpBHpax8Zu/oPWB4pERgCCAZ41iBRCaGPMvMbG8IEHHnj5iw0Nd4lSSUV27LDk178uQsPDunF4OLbEcTa9bdsDyU8IY0lpKWPUxjVr1vx46dLD4evXmyPLl+vAd74j5dKlIvT++6qzrq6nLZ3unQlmCoglpdDGmL7e3ugb+/cfWhmJ3J47dkxFnnjCkrfeCh4ehli7VgQzGd0xPBxb6jibTtr2wMgcYSwpLaW1+vLtt9/2wubNr/Lx44lgZ6eu27pVwraBUAhi6VJRf/as0xkK3dSSTvedmAZmAogkciGWLQsf/sUvDs1vaflS8vvfV5GtW63A6tXg69cBY8D5PMQtt4hANqtbr1+P9TnOpo9s+8iFWcJYlmUprdW2LVvWPfeDH7ySe/75Rmit67dskSgWwYUCOJ8HhcMQixfL0AcfOAvD4Z7WdLr/hNa/KgJTYMogkkhoZrOyqyv08le/+nKHUrePPvmkimzebAU++1nwtWsAM+A4YMcBcjmI3l4RzOV0w+horNtxNp1zYS5PB+MrsXnDhi8+t3//bzNPPx1T772nw1u3SrZtcKEAKOW2k8sB9fUQnZ0ydO6c0xmJ9LSk0/0njJkCIwFAAGQAbotGg//S0fFvC5LJDfk33nAh1qyBGR4GM4NLJRfCz7kcqKdH1OVyumFsLLrMcTaes+3XasFYQljKGLVp7dp1+1944bfZffuihcOHTeQb35Amn3eVUMptp1QCKwWTy4FCIVBHhwwNDanOaHRFazq96oQxB4qAJoBcIQBigGNEwb+R8sVbwuF7rXxeRR9+2Ar098P4SpRKbnac8i+XSkA+D7FsmQhmszqWzcaWOc7Gam5mEbmj04oVn/vXRx55xd6/P2YfPWoiX/uaMLYN2LarhNcO+/Ur5SoTDIJaWkTo0iVnYUPDitZUqv+EMQdKHowEQAEA3wsGn7+nq2tTLBh0Ig8/HLCWL4fxYqKy4vJvBQzn8xBdXaIuk9GxQiF2Y6n04Ee2PXDRg5FEQjGruzo6Vj+7evXv1IkTcWdw0EQeekgY2wbb9gQlTEUb5TbzeXAwCNHUJENXrjid8fiKeanUkmPGvKQBIgBoAiJHV648215XN79u82ZjdXUJzmQAIVwQLzOze+3/VpYZAwSDUEeP6pEzZ+S7Fy8O/10yuf4tolMgwp2JxKo9zc0D8VBonhUO6/Bdd0l2HLBSrt8ZA55Ut39dbkNrQEqYTMaYU6fEVce5/KUzZ7qTQE4SIGyiUrsQ4s8CgfVOT4+R9fXEtk1+75sqaphqKuXzQGenCOZyOqZUbHmp9NC7hcLLN91wQ8vf1tUdbZRyXl08ruvWrZNs2zDF4oQ6UKGAqVSjok04DpcKBY5cvCieHx198hXbfoMAQQBAgGAi84+JxPavJBI7sxs36vDixYLzeWKvt2qq4PdahXIIBKDeecekzp8Xb+VyF+ZFIuhSamGkudkEPvMZAa3d3q1QmCvqm3LN7L4vBJfyeRM/fVq+lEw+/hdjY7vALAgwPog7vBOpnzY2PvZgIrE7c++9OrRwoeBcjkA0DlEJVQlRCWcMOBCAPnXKpNNpMlqj0bLY6u+fADG5rlowPoRj26bpj3+ULyWT27fkcrsVswVAceU8QoDRgPW7YvF4k+Ok+y9cuLsYixkRjZLJ5Vw3811tkuRlV6h0A9sGmpvJSiYRdBxYPT3CFArgSe5U+V2lCxsvflgpsDHsZLMmfO6c/Nno6GPbcrk9JcAiD6JCjPEbAVgaUDui0Ucfb2ram7/tNh1saxMoFKgclJNcq1qQlnvUGzBYqeouyp4p3jV7irFS8AYDVo5jEsmk3JlKbXsqn98rActUQEwBmQyzvaFh2+MNDXvyq1bpQEuLQKEwJWamHcl8w3yDK402Bqx1OchNsThRLa3BxrDR2jQJIXcXi9/dlc3uqQZRFWQyzGPx+He3RyK78suXa6upSaBUonLv1fJx/54ZBJTBykYWCvDdDI4z/h289YY7K7ABdJOU1u5S6fE96fSuWhDA9NtVIwHrzULhuJYyty6d3mBblibLIi4WafKQXL73/VopmEIBOpeDSiahRkbgfPwxdCoFncm4IFq7Sx8iGCIwERiAAVgz6yYprV2Os+PpGSBmAinD/L5YPGakzH8hk9mQl9JAiDKMKZVgfOMdB8a2ocbG4IyOQo2OQqVS0Pm8G9Sea7EQvsEuiJeN+5w1s0lIae1R6oln0umdM0HMBmQijGXZn8/n1+cBQ0TEjuPC2DZUJgMnmXQNz2Zdw41xe9nPzGDfeADGvx/P7DCbBiHkM0o98cOxsadmAzFbkDLMH4rF/6gTIr+uWNyQYYaxbVKpFNTYmNvrSrkGVbhJZY/7BpvqEFDMaBVCPK/1jqcymZ3WLCHmAgKvfevtYvHYQilHuorFewq2XR6VyoZXZmbXfaqUTy7TzAgD9Koxj3wvm92r3ZXzrCCAOZyA+LNnkQg/ymReX9zQkO2wrKg2hgkgf9SZ+BFP3VzzVNMYYElEHzHnfpTN/nuRCJIZerbGYQ6KSMDSRKqfue+v4/HX57e2JkQmwwxQNbcxc1CDAWKtWba1BbuBL1+y7SNXZthpfiIQH6LPhRhY3t7eGrhyxWhA+Ab7eVqDa5W5vU9WJmPmtbdHlzJvHLTt167OAWZGEAFYhkjdzNz37URiYEl7eysuXNAKkP5IVAlSVmQ2ZZgY+IqZkE7rxo6O2I3MG4ds+8hVoitiFjDTglRA9H47kRhY0tbWxkNDWhFJf/ic4j7VXadmeSUgA9CAQDKp4/Pnx250lTkyPAuYmiCVEN9KJAYWt7a2maEhrYkkKueEOUBUU6PadxoQ7MF0Mz84ZNsDM8FUBfEhVjLf/K1EYuCGlpZ27UEw0ZxdR0/3vEq5D2NSKR3v6Ih1AxtngpkCIisg/ioeH1jY2tquBge1mU6JGWBqKjWDkgYQJpnUjbOAmQDiK9HO3PvNePy1JS0tbaXBwXElqhisZ6nKbAJ+Sn2eMjqV0vH29tgiYNOpQmEgUwWmvIyvhHg0Hj+yvLm5tTA0pFkIOWWtX22im/S84oq9hggAVZsQ4SlQ5fvxZIwOLVokz6ZS155JpdZfJTopmC0DqDKIf/iwhLl3Szx+pLupqdUeGtIQovaoVsOgimfMAEJuJ6Mwrj7N+H2t58w6fMMN8mw6fe25VGr9OaKTxCwYMETu+am5Gej7y3h8oL2pqdUeHNQQQhLRbAx2Lyc9McymkUj+nPmbxGy+IsSzKWYt3T9sqFodM8F48aTDixbJ4bGxa/+UTK4/BZwkQEgAHAPEtkTicEtz85L84KBiIqvm6IQpPjz5PVaAiQLyReCxA1rvO838DojSvcDdeWbD7lkzzSquKtsBwESimEqphra2WLcQn3+zUPhJETAW4C4EKRLRanAQJXg+4G+CpumhKr3HBjAxInmAaPuLSj0tgAAB+KXWe7VliQeYd2eYtfdXGs0y1iYkDSBw4QLQ1qaK3uGGJEBowPxvNvtav2XdV29McwnQDIhZz9puZs1sokTy10LseEmpXWJ8P2EEYJ025jikzK0ENtiA8RacNO3QPClrQAcBKyXlR09ns/eljBktuxYBYox59DTRoT4p7w8Z01QJM4thlBVgIh7Ey0rt9CHKnevBvG/MMRYidxPzhsJkN5shK0AHADkm5fkfEt15SesP/Rj3RxIWgEwbM3IaONQrxH31HgzcF2tPgi6EDgPWISl3HKwCMRnmDPMxSJnv8ZTxXGxaZTwl5JiU5/cBd17S+kMBSH8ukRWNsADkGPPIGaKDNxPdX8fc5Hgw1RRhD6KByDosxOO/0XpXLYjJMP/HfIykzK1wYfR0MMZTIiPE+R8T3eFDGIzvveSkRnyY0TNCHFwJ/HmwAmZyTHijk3VSiO2/Mma3cXecNSEqkiHAOst8bIEQmQ7mu2spowEtPYifEN1xuQrEFJAKGGuMeeQDokP9RPdZU2FYA6YBkO8SPfbPzHv0pLPYmRK5hlv/zXy8nSi9CLg7PwnGeBBaiPM/Be68aMyHnuJTdsFVZ25f/rQHs4LovvqJbsZhQL5JtG0/8141R4hKGAas94A364HUYuCeoisE+TGRdSHuGBqHqKp4zSUIu/LLNPPIWaLfdBPdW888rwSoekC+TvToQeZn4EF4hs0p+zAGsE4Dv5dEo13APTagAoCVFuLDnwF3XjbmHLmBXfM8oiZIEKA4EEgA8xSzfR042Ul0VxSI/g/RvjeZ/z4CtIaAoAWEgkA44OZI0MsBN0e933BleRCI1AHhMBBpABpiQNt54KQA6hYBa1NE1w4RPZwy5sMEEAsATmGaHWLV03gG0AxYHUAjAy0BoNMBQk3AqhaiZe8xH7AAYwMjNpDJAyXfJXi8jloH5Oy/IwCuB2S92xGNAJqygO4nevAycGqE+e0o4AC4zMDoIJB1aqhStTH/mQSkBCwLCAogBHfiUhYQMkDJ89cJCwk5fZ3lpCtWP94qUsL9uzxYAmzhzdYKKABwlJv9xcacQD5R8itkTK2cJz3/NNP/AzCxaVBYl+dwAAAAAElFTkSuQmCC"

	var Category = [
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

	var Marks = [
		'kizuna',
		'heart'
	];

	var AllCategoryNUM = {
		// Saber,Archer,Lancer,Rider,Caster,
		// Assassin,Berserker,Ruler,Avenger,Alterego,
		// Foreigner,Mooncancer
		"tw": [10, 9, 8, 9, 11,
			    9, 9, 4, 3,  5,
				2, 2],
		"jp": [14, 11, 10, 13, 12,
			    9, 11, 7, 5, 6,
				6, 3],
		"en":[10, 9, 8, 8, 11,
		       9, 8, 4, 2, 5,
			   2, 1],
		// 19' 福袋
		"luck_up":[7,5,4,0,0,0,0,3,3,0,2,1],
		"luck_down":[0,0,0,4,6,6,5,0,0,4,0,0]
	};

	//右鍵選單取消,綁定功能
	document.oncontextmenu = function(){return false};

	//角色物件
	var Unit = function(imageUrl){
		var self = this;
		this.imageUrl = imageUrl;
		this.npLv = 0;
		this.mark = 0;
		this.image = new Image();
		this.image.src = this.imageUrl;
	};

	var CategoryLen = Category.length;
	var categoryImages = new Array(CategoryLen);
	var markImages = new Array(Marks.length);

	//設定標誌

	for(var i = 0 ; i < Marks.length ; ++ i){
		markImages[i] = new Image();
		markImages[i].src = "images/mark/" + Marks[i] + ".png";
	}

	//設定職階圖

	for(var i = 0 ; i < CategoryLen ; ++ i){
		categoryImages[i] = new Image();
		categoryImages[i].src = "images/class/class_" + (i + 1) + ".png";
	}

	var units = [];

	//設定英靈圖
	for (i = 0; i < CategoryLen; i++) {
		units[i] = [];
		for (j = 0; j < AllCategoryNUM["jp"][i]; j++) {
			units[i][j] = new Unit("images/" + Category[i] + "/" + (j + 1) + ".jpg");
		}
	}

	// 將圖用進units陣列
	function luckyInit(country){
		for (i = 0; i < CategoryLen; i++) {
			units[i] = [];
			if(country == 'luck_up' || country == 'luck_down'){
				if(country == 'luck_up'){
					for (j = 0; j < AllCategoryNUM["luck_up"][i]; j++) {
						units[i][j] = new Unit("images/lucky25/" + Category[i] + "/" + (j + 1) + ".jpg");
					}
				}
				if(country == 'luck_down'){
					for (j = 0; j < AllCategoryNUM["luck_down"][i]; j++) {
						units[i][j] = new Unit("images/lucky25/" + Category[i] + "/" + (j + 1) + ".jpg");
					}
				}
			}
			else if(country == 'jp' || country == 'tw' || country == 'en'){
				for (j = 0; j < AllCategoryNUM["jp"][i]; j++) {
					units[i][j] = new Unit("images/" + Category[i] + "/" + (j + 1) + ".jpg");
				}
			}
		}
		return units;
	}

	// 先跑初始化 圖才不會亮
	luckyInit("jp");
	luckyInit("luck_up");
	luckyInit("luck_down");

	function init(state = 0){
		CategoryNUM = Array.from(AllCategoryNUM[country]);
		units = luckyInit(country);

		canvas = document.getElementById('canvas');
		canvas.onclick = onCanvasClick;
		// 台GO 日GO 美GO
		twButton = document.getElementById('tw-button');
		jpButton = document.getElementById('jp-button');
		enButton = document.getElementById('en-button');
		// 福袋(變動)
		newButtonUp = document.getElementById('new-button-up');
		newButtonDown = document.getElementById('new-button-down');
		//
		setButton = document.getElementById('set-button');
		maskButton = document.getElementById('mask-button');
		luckyBagButton = document.getElementById('luckyBag-button');
		// Taiwan GO
		twButton.onclick = function(){
			if (country != "tw"){
				country = "tw";
				enButton.classList.remove('btn--checked');
				enButton.classList.add('btn--us')
				twButton.classList.remove("btn--primary");
				twButton.classList.add('btn--checked');
				jpButton.classList.remove("btn--checked");
				jpButton.classList.add('btn--primary');
				// 福袋(上)
				newButtonUp.classList.remove('btn--checked');
				newButtonUp.classList.add('btn--latest--up');
				//福袋(下)
				newButtonDown.classList.remove('btn--checked');
				newButtonDown.classList.add('btn--latest--down');
				init(1);
			}
		};
		// JP GO
		jpButton.onclick = function(){
			if (country != "jp"){
				country = "jp";
				enButton.classList.remove('btn--checked');
				enButton.classList.add('btn--us')
				jpButton.classList.remove("btn--primary");
				jpButton.classList.add('btn--checked');
				twButton.classList.remove("btn--checked");
				twButton.classList.add('btn--primary');
				// 福袋(上)
				newButtonUp.classList.remove('btn--checked');
				newButtonUp.classList.add('btn--latest--up');
				//福袋(下)
				newButtonDown.classList.remove('btn--checked');
				newButtonDown.classList.add('btn--latest--down');
				init(1);
			}
		};
		// English GO
			enButton.onclick = function(){
			if (country != "en"){
				country = "en";
				enButton.classList.remove("btn--us");
				enButton.classList.add('btn--checked');
				twButton.classList.remove("btn--checked");
				twButton.classList.add('btn--primary');
				jpButton.classList.remove("btn--checked");
				jpButton.classList.add('btn--primary');
				// 福袋(上)
				newButtonUp.classList.remove('btn--checked');
				newButtonUp.classList.add('btn--latest--up');
				//福袋(下)
				newButtonDown.classList.remove('btn--checked');
				newButtonDown.classList.add('btn--latest--down');
				init(1);
			}
		};
		// 福袋上池
		newButtonUp.onclick = function(){
			if(country != "luck_up"){
				country = 'luck_up';
				enButton.classList.remove('btn--checked');
				enButton.classList.add('btn--us');
				newButtonUp.classList.remove('btn--latest--up');
				newButtonUp.classList.add('btn--checked');
				newButtonDown.classList.remove('btn--checked');
				newButtonDown.classList.add('btn--latest--down');
				jpButton.classList.remove("btn--checked");
				jpButton.classList.add('btn--primary');
				twButton.classList.remove('btn--checked');
				twButton.classList.add('btn--primary');
				init(1);
			}
		};
		// 福袋下池
		newButtonDown.onclick = function(){
			if(country != "luck_down"){
				country = 'luck_down';
				enButton.classList.remove('btn--checked');
				enButton.classList.add('btn--us');
				newButtonUp.classList.add('btn--latest--up');
				newButtonUp.classList.remove('btn--checked');
				jpButton.classList.add('btn--primary');
				jpButton.classList.remove("btn--checked");
				twButton.classList.add('btn--primary');
				twButton.classList.remove('btn--checked');
				newButtonDown.classList.add('btn--checked');
				newButtonDown.classList.remove('btn--latest--down');
				init(1);
			}
		};

		//
		setButton.onclick = function(){
			mode = 0;
			setButton.classList.remove("btn--primary");
			setButton.classList.add('btn--checked');
			maskButton.classList.remove("btn--checked");
			maskButton.classList.add('btn--primary');
		};
		maskButton.onclick = function(){
			mode = 1;
			maskButton.classList.remove("btn--primary");
			maskButton.classList.add('btn--checked');
			setButton.classList.remove("btn--checked");
			setButton.classList.add('btn--primary');
		};
		luckyBagButton.onclick = function(){
			luckyBag = !luckyBag;
			if(luckyBag){
				luckyBagButton.classList.remove("btn--primary");
				luckyBagButton.classList.add('btn--checked');
				marginLeft += caculateField;
			}else{
				luckyBagButton.classList.remove("btn--checked");
				luckyBagButton.classList.add('btn--primary');
				marginLeft -= caculateField;
			}
			init(2);
		};

		if(!state){
			canvas.addEventListener('mousedown', function rightClickHandler(e) {
				if(e.button === 2) {
					rightClick(e);
				}
			});
		}

		canvas.width  = luckyBag ? (Math.max.apply(null,CategoryNUM) + 1) * (CELL_SIZE + col_padding) + caculateField : (Math.max.apply(null,CategoryNUM) + 1) * (CELL_SIZE + col_padding);
		// add width
		if(canvas.width < 600) canvas.width = 600;
		canvas.height = CategoryLen * (CELL_SIZE + row_padding) + marginTop;
		// 補正值
		canvas.height += 20;

		context = canvas.getContext('2d');
		context.font = "20px Microsoft JhengHei";
		context.textBaseline = 'top';

		context.fillStyle = bgcolor;
		luckyBag ? context.fillRect (0, 0, canvas.width + caculateField, canvas.height) : context.fillRect (0, 0, canvas.width, canvas.height);
		//context.fillRect (0, 0, canvas.width, canvas.height);

		fillTotalText();

		for(var category = 0; category < CategoryLen; category++){
			drawImage(0, category, categoryImages[category])
		}

		for (i = 0; i < CategoryLen; i++) {
			for (j = 0; j < CategoryNUM[i]; j++) {
				drawImage(j + 1, i, units[i][j].image);
				if(!units[i][j].npLv){
					fillRect(j, i, mask);
				}else{
					fillNPText(j, i, "寶" + units[i][j].npLv, font_color);
				}
				if(units[i][j].mark){
					drawImage(j + 1, i, markImages[units[i][j].mark - 1]);
				}
			}
		}

		if(luckyBag){
			fillCaculate();
		}

		context.font = "20px Microsoft JhengHei";
		context.fillStyle = mask;
		context.fillText("This image was made by mgneko, maintained by LeafLu @ ptt", marginLeft, canvas.height - 25);
	}

	function drawImage(x, y, image){
		if(image.complete){
			try{
				context.drawImage(image,
					x * (CELL_SIZE + col_padding) + marginLeft,
					y * (CELL_SIZE + row_padding) + marginTop,
					CELL_SIZE,
					CELL_SIZE);
				draw_done = 1;
			}catch(e){
				image.src = unitMissing;
				context.drawImage(image,
					x * (CELL_SIZE + col_padding) + marginLeft,
					y * (CELL_SIZE + row_padding) + marginTop,
					CELL_SIZE,
					CELL_SIZE);
			}
		}else{
			setTimeout(function(){
				drawImage(x, y, image);
			},1000);
		}
	}

	function fillCaculate(){
		context.font = "12px Microsoft JhengHei";
		var have = 0;
		var haveFull = 0;
		var like = 0;
		var percent = 0;
		var ex = 0;
		var ban = 0;

		context.fillStyle = bgcolor;
		context.fillRect(0, 0, caculateField + 10, canvas.height)
		context.fillStyle = font_color;

		for(var category = 0; category < CategoryLen; category++){
			if (category <= 7){
				have = 0;
				haveFull = 0;
				like = 0;
				ban = 0;
			}
			for(var attribute = 0; attribute < CategoryNUM[category]; attribute++){
				if (units[category][attribute].npLv){
					have += 1;
					if(units[category][attribute].npLv == 5){
						haveFull += 1;
					}
				}
				if (units[category][attribute].mark == 2){
					like += 1;
				}
				if (units[category][attribute].mark == 1){
					ban += 1;
				}
			}

			if (category <= 6){

				percent = ((1 - (have / attribute)) * 100);
				context.fillText("新:" + percent.toFixed(2) + "%",
				marginLeft - caculateField,
				marginTop + category * (CELL_SIZE + row_padding));

				percent = (haveFull / units[category].length * 100);
				context.fillText("盤:" + percent.toFixed(2) + "%",
				marginLeft - caculateField,
				marginTop + category * (CELL_SIZE + row_padding) + 20);

				percent = (like / units[category].length * 100);
				context.fillText("婆:" + percent.toFixed(2) + "%",
				marginLeft - caculateField,
				marginTop + category * (CELL_SIZE + row_padding) + 40);
				// 新增雷
				// percent = (ban / units[category].length * 100);
				// context.fillText("雷:" + percent.toFixed(2) + "%",
				// marginLeft - caculateField,
				// marginTop + category * (CELL_SIZE + row_padding) + 60);
			}else {
				ex += units[category].length;
			}
		}

		percent = ((1 - (have / ex)) * 100);
		context.fillText("新:" + percent.toFixed(2) + "%",
		marginLeft - caculateField,
		marginTop + 7 * (CELL_SIZE + row_padding));

		percent = (haveFull / ex * 100);
		context.fillText("盤:" + percent.toFixed(2) + "%",
		marginLeft - caculateField,
		marginTop + 7 * (CELL_SIZE + row_padding) + 20);

		percent = (like / ex * 100);
		context.fillText("婆:" + percent.toFixed(2) + "%",
		marginLeft - caculateField,
		marginTop + 7 * (CELL_SIZE + row_padding) + 40);
		// 新增 雷
		// percent = (ban / ex * 100);
		// msContentScript.fillText("雷:" + percent.toFixed(2) + "%",
		// marginLeft - caculateField,
		// marginTop + 7 * (CELL_SIZE + row_padding) + 60);

		context.font = "20px Microsoft JhengHei";
	}

	function fillRect(x, y, color){
		context.fillStyle = color;
		context.fillRect ((x + 1) * (CELL_SIZE + col_padding) + marginLeft,
			y * (CELL_SIZE + row_padding) + marginTop,
			CELL_SIZE,
			CELL_SIZE);
	}

	function fillTextMask(x, y, color){
		context.fillStyle = color;
		context.fillRect(x * (CELL_SIZE + col_padding) + marginLeft,
			(y + 1) * (CELL_SIZE + row_padding) - row_padding  + marginTop,
			CELL_SIZE,
			row_padding);
	}

	function fillNPText(x, y, msg, color){
		context.fillStyle = color;
		context.fillText(msg,
			(x + 1) * (CELL_SIZE + col_padding) + 8 + marginLeft,
			(y + 1) * (CELL_SIZE + row_padding) + marginTop - row_padding + 5,
			CELL_SIZE);
	}

	function fillTotalText(){
		var totalHave = 0;
		var totalNP = 0;
		var total = 0;
		context.fillStyle = bgcolor;
		context.fillRect(canvas.width - 200, canvas.height - 110, 200, 80)

		for (i = 0; i < CategoryLen; i++) {
			for (j = 0; j < CategoryNUM[i]; j++) {
				totalNP += units[i][j].npLv;
				if(units[i][j].npLv){
					totalHave += 1;
				}
			}
		}
		for (var i = 0; i < CategoryNUM.length; i++) {
			total += CategoryNUM[i];
		};
		var percent =(totalHave/total) * 100;

		context.fillStyle = font_color;
		context.fillText("英靈持有數:"+ totalHave + "/" + total,
			canvas.width - 200,
			canvas.height - 90);
		context.fillText("英靈持有率:" + percent.toFixed(2) + "%",
			canvas.width - 200,
			canvas.height - 70);
		context.fillText("總寶數:" + totalNP,
			canvas.width - 200,
			canvas.height - 50);
	}

	function getCoordinates (event){
		var rect = event.target.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		return {'x':x, 'y':y};
	}

	function getCategory(y){
		return Math.floor((y - marginTop) / (CELL_SIZE + row_padding));
	}

	function getAttribute(x){
		return Math.floor((x - marginLeft) / (CELL_SIZE + col_padding));
	}

	function rightClick(event){

		var rect = event.target.getBoundingClientRect();
		var point = getCoordinates(event);
		var attribute = getAttribute(point.x);
		var category = getCategory(point.y);
		if(point.x - (attribute * (CELL_SIZE + col_padding) + marginLeft) < CELL_SIZE &&
			point.x - (attribute * (CELL_SIZE + col_padding) + marginLeft) > 0 &&
			point.y - (category * (CELL_SIZE + row_padding) + marginTop) < CELL_SIZE &&
			point.y - (category * (CELL_SIZE + row_padding) + marginTop) > 0 &&
			attribute != 0 &&
			attribute <= CategoryNUM[category]){
			switch(mode) {
				case 0:
					if(units[category][attribute - 1].npLv){
						units[category][attribute - 1].npLv -= 1;
						fillTextMask(attribute, category, bgcolor);
						if(!units[category][attribute - 1].npLv){
							fillRect(attribute - 1, category, mask);
							units[category][attribute - 1].mark && drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
						}
						else{
							fillNPText(attribute - 1, category, "寶" + units[category][attribute - 1].npLv, font_color);
						}
					}
					else{
						units[category][attribute - 1].npLv = 5;
						drawImage(attribute , category, units[category][attribute - 1].image);
						units[category][attribute - 1].mark && drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
						fillTextMask(attribute, category, bgcolor);
						fillNPText(attribute - 1, category, "寶" + units[category][attribute - 1].npLv, font_color);
					}
					fillTotalText();
					if(luckyBag){
						fillCaculate();
					}
					break;
			case 1:
				drawImage(attribute , category, units[category][attribute - 1].image);
				if(!units[category][attribute - 1].npLv){
					fillRect(attribute - 1, category, mask);
				}
				if(units[category][attribute - 1].mark > 0){
					units[category][attribute - 1].mark--;
				}
				else{
					units[category][attribute - 1].mark = Marks.length;
				}
				if(units[category][attribute - 1].mark){
					drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
				}
				if(luckyBag){
					fillCaculate();
				}
				break;
			}
		}
	}

	function onCanvasClick(event){

		var rect = event.target.getBoundingClientRect();
		var point = getCoordinates(event);
		var attribute = getAttribute(point.x);
		var category = getCategory(point.y);

		if(point.x - (attribute * (CELL_SIZE + col_padding) + marginLeft) < CELL_SIZE &&
			point.x - (attribute * (CELL_SIZE + col_padding) + marginLeft) > 0 &&
			point.y - (category * (CELL_SIZE + row_padding) + marginTop) < CELL_SIZE &&
			point.y - (category * (CELL_SIZE + row_padding) + marginTop) > 0 &&
			attribute != 0 &&
			attribute <= CategoryNUM[category]){
			switch(mode) {
				case 0:
					if(!units[category][attribute - 1].npLv){
						drawImage(attribute , category, units[category][attribute - 1].image);
						units[category][attribute - 1].mark && drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
					}

					if(units[category][attribute - 1].npLv < 5){
						units[category][attribute - 1].npLv += 1;
						fillTextMask(attribute, category, bgcolor);
						fillNPText(attribute - 1, category, "寶" + units[category][attribute - 1].npLv, font_color);
					}
					else{
						units[category][attribute - 1].npLv = 0;
						fillRect(attribute - 1, category, mask);
						units[category][attribute - 1].mark && drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
						fillTextMask(attribute, category, bgcolor);
						//fillText(attribute - 1, category, "寶" + units[category][attribute - 1].npLv, font_color);
					}
					fillTotalText();
					if(luckyBag){
						fillCaculate();
					}
					break;
			case 1:
				drawImage(attribute , category, units[category][attribute - 1].image);
				if(!units[category][attribute - 1].npLv){
					fillRect(attribute - 1, category, mask);
				}
				units[category][attribute - 1].mark++;
				units[category][attribute - 1].mark = units[category][attribute - 1].mark % (Marks.length + 1);
				if(units[category][attribute - 1].mark){
					drawImage(attribute , category, markImages[units[category][attribute - 1].mark - 1]);
				}
				if(luckyBag){
					fillCaculate();
				}
				break;
			}
		}
	}

	function openImage(){
		try{
			var image = new Image();
			var canvas = document.getElementById("canvas");
			image.src = canvas.toDataURL("image/png");
			window.open().document.write('<img src="' + image.src + '" />');
		}catch(e){
			alert(e);
		}
	}
