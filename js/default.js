var console;				// : Console
var canvas;					// : DOMElement
var stage;					// : Stage
var ballRadius = 5;			// : int
var bouncer;				// : Shape
var canvasOriginWidth = 900;
var canvasOriginHeight = 540;
var bouncerInitialWidth = 200; // :int
var bouncerWidth = bouncerInitialWidth; // : int
var origin;					// : Point
var mouseX;					// : int
var mouseY;					// : int
var animationTime = 1250;	// : int
var message;					// : Text
var background;				// : Container
var foreground;				// : Container
var gameElements;			// : Container
var topElements;			// : Container
var loadedImage;			// : Image
var oldBitmapContainer;		// : Container
var hits = 0;				// : int
var balls;					// : Array
var level = 1;				// : int
var numHitsToLevelUp = 5; 	// : int
var scoreTxt;				// : Text
var score = 0;				// : int
var totalScore;				// : int
var gameScore;				// : Text
var gameOver;				// : Container
var pts;					// : Text
var place;					// : Text
var submitScore;			// : Container
var playAgain;				// : Container
var inputSubmit;			// : Container
var inputName;				// : DOMElement
var errorNameContainer;		// : Container
var messageCenter;
var messageCenterBackground;
var highscorelist;
var userid;					// : String
var loaderSpriteSheet;
var loaderImage;
var loaderbar;

/*
var url = "https://www.scoreoid.com/api/";
var key = "ac41090c20e19d71ddb03c23f48e0ec967d0aba1";
var game = "rDbaOsLPJ";
*/
var api_url = "http://jorgen2.kan.local/PatricTest/";

//$(document).ready(function()
//);
$(document).ready(function()
{
	loaderImage = new Image();
	loaderImage.src = "images/spinner.png";
	loaderImage.onload = function()
	{
		
		loaderSpriteSheet  = new SpriteSheet({
			images: [loaderImage],
			frames: { regY: 0, regX: 0, count: 29, width: 30, height: 29 },
			animations: {
				start: [0, 28]
			}
		});
		loaderbar = new BitmapAnimation(loaderSpriteSheet);
		//loaderbar.x = loaderbar.y = 100;
		init();
	};
});



function init() // :void
{

	console = window.console;
	canvas = document.getElementById("myCanvas");
	
	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
	canvasW = canvas.width;
    canvasH = canvas.height;

	stage = new Stage(canvas);

	stage.mouseEventsEnabled = true;
	if (Touch.isSupported()) 
	{ 
		Touch.enable(stage);
	}

	background = new Container();
	stage.addChild(background);
	loadBitmap("http://lorempixel.com/"+canvasW+"/"+canvasH+"/sports/");

	foreground = new Container();
	stage.addChild(foreground);
	
	var color = new Shape();
	color.graphics.beginFill("#000000").drawRect(0,0,canvas.width, canvas.height).endFill();
	foreground.addChild(color);
	
	foreground.alpha = 0.8;

	gameElements = new Container();
	stage.addChild(gameElements);

	topElements = new Container();
	stage.addChild(topElements);

	scoreTxt = new Text(score+" pts", "50px Arial", "#FFFFFF");
	topElements.addChild(scoreTxt);
	scoreTxt.alpha = 0.5;
	scoreTxt.x = 30;
	scoreTxt.y = 50;

	gameOver = new Container();
	topElements.addChild(gameOver);

	gameOver.y = 0.5 * canvas.height;
	
	gameScore = new Text("Your score: "+totalScore, "60px Arial", "#FFFFFF");
	gameScore.visible = false;
	gameScore.alpha = 0;
	gameOver.addChild(gameScore);

	Ticker.setFPS(60);
	Ticker.addListener(stage, false);

	messageCenter = new Container()
	topElements.addChild(messageCenter);

	messageCenterBackground = new Shape();
	messageCenter.addChild(messageCenterBackground);	
	messageCenterBackground.graphics.beginFill("#666").drawRoundRect(0,0,390,320,12).endFill();

	messageCenter.alpha = 0;

	highscorelist = new Container();
	createToplist();
	messageCenter.addChild(highscorelist);

	console.log("Display loaderbar");
	messageCenter.addChild(loaderbar);
	loaderbar.x = 0.5 * (390 - 32);
	loaderbar.y = 150;
	loaderbar.gotoAndPlay("start");
	loaderbar.onAnimationEnd = function(){ 
		loaderbar.gotoAndPlay("start");
	};	

	message = new Text("Click to start game","36px Arial", "#999");
	message.x = 0.5 * (390 - message.getMeasuredWidth());
	message.y = 300;
	messageCenter.addChild(message);
	messageCenter.x = 0.5 * (canvas.width - 390);
	messageCenter.y = 20;//0.5 * canvas.height;

	// SUBMIT SCORE

	submitScore = new Container();
	messageCenter.addChild(submitScore);
	submitScore.visible = false;
	/*
	var submitBackground = new Shape();
	submitBackground.graphics.beginFill("#333").drawRoundRect(0,0,390,180,12).endFill();
	submitScore.addChild(submitBackground);

	submitScore.x = 0.5 * (canvas.width - 390);
	submitScore.y = 0.5 * (canvas.height - 180);
	*/
	var ptsHeading = new Text("pts", "14px Arial", "#FFF");
	submitScore.addChild(ptsHeading);
	ptsHeading.x = 20;

	var plcHeading = new Text("place", "14px Arial", "#FFF");
	submitScore.addChild(plcHeading);
	plcHeading.x = 390 - plcHeading.getMeasuredWidth() - 20;

	pts = new Text("45", "36px Arial", "#FFF");
	submitScore.addChild(pts);
	pts.x = 20;
	pts.y = 35;

	place = new Text("-", "36px Arial", "#FFF");
	submitScore.addChild(place);
	place.x = 390 - place.getMeasuredWidth() - 20;
	place.y = 35;

	var inputNameContainer = new Container();
	submitScore.addChild(inputNameContainer);
	inputNameContainer.x = 20;
	inputNameContainer.y = 50;

	var inputNameContainerBackground = new Shape();
	inputNameContainerBackground.graphics.setStrokeStyle(1).beginStroke("#FFF").beginFill("#666").drawRoundRect(0, 0, 350, 40, 8).endFill();
	inputNameContainer.addChild(inputNameContainerBackground);

	errorNameContainer = new Container();
	errorNameContainer.visible = false;
	inputNameContainer.addChild(errorNameContainer);

	var errorNameContainerBackground = new Shape();
	errorNameContainerBackground.graphics.setStrokeStyle(1).beginStroke("#FFF").beginFill("#990000").drawRoundRect(0, 0, 350, 40, 8).endFill();
	errorNameContainer.addChild(errorNameContainerBackground);

	inputName = new DOMElement("name");
	inputNameContainer.addChild(inputName);

	inputSubmit = new Container();
	submitScore.addChild(inputSubmit);
	inputSubmit.x = 0.5 * 390 -	120 - 10;
	inputSubmit.y = 100;
	
	var inputSubmitBackground = new Shape();
	inputSubmitBackground.graphics.setStrokeStyle(1).beginStroke("#FFF").beginFill("#0258CE").drawRoundRect(0, 0, 120, 40, 8).endFill();
	inputSubmit.addChild(inputSubmitBackground);

	var submit = new Text("Submit score","16px Arial", "#FFF");
	inputSubmit.addChild(submit);
	submit.x = 0.5 * (120 - submit.getMeasuredWidth());
	submit.y = 0.5 * (40 - submit.getMeasuredLineHeight()) + 13;

	playAgain = new Container();
	submitScore.addChild(playAgain);
	playAgain.x = 0.5 * 390 + 10;
	playAgain.y = 100;
	
	var playAgainBackground = new Shape();
	playAgainBackground.graphics.setStrokeStyle(1).beginStroke("#FFF").beginFill("#0258CE").drawRoundRect(0,0,120,40,8).endFill();
	playAgain.addChild(playAgainBackground);

	var play = new Text("Play again","16px Arial", "#FFF");
	playAgain.addChild(play);
	play.x = 0.5 * (120 - play.getMeasuredWidth());
	play.y = 0.5 * (40 - play.getMeasuredLineHeight()) + 13;

	Tween.get(messageCenter).to({alpha:1},500).call(onGameInitComplete);
}

function createToplist(id)
{
	userid = id;

	$.ajax({
		url: api_url + "scores?numberofscores=10",
		dataType: 'jsonp',
		success: populateHiscoreData
	});
}

function populateHiscoreData(data) // : Container
{
	var list = highscorelist;
	//list.x = 0.5 * (canvas.width - 390);
	//list.y = 20;

	console.log("Remove loaderbar");
	loaderbar.paused = true;
	messageCenter.removeChild(loaderbar);

	var highscoreHeader = new Text("High scores", "24px Arial", "#FFFFFF");
	list.addChild(highscoreHeader);
	highscoreHeader.x = 20;
	highscoreHeader.y = 30;

	var scoreHolder;
	var scoreHolderColor;
	var scoreObject;
	var highscoreWrapper;
	var highscoreName;
	var highscoreScore;
	
	for(var i in data)
	{
		scoreObject = data[i];
		highscoreWrapper = new Container();
		list.addChild(highscoreWrapper);


		if (userid == scoreObject.Id)
		{
			scoreHolder = "You"
			scoreHolderColor = "#66FFFF";
		}
		else
		{
			scoreHolder = scoreObject.ScoreHolder;
			scoreHolderColor = "#FFFFFF";
		}

		var num = parseInt(i) + 1;
		highscoreName = new Text(num.toString(), "18px Arial", scoreHolderColor);
		highscoreWrapper.addChild(highscoreName);
		highscoreName = new Text(scoreHolder, "18px Arial", scoreHolderColor);
		highscoreWrapper.addChild(highscoreName);
		highscoreName.x = 30;
		highscoreScore = new Text(scoreObject.Value, "18px Arial", scoreHolderColor);
		highscoreWrapper.addChild(highscoreScore);
		highscoreScore.x = 350 - highscoreScore.getMeasuredWidth();
		highscoreWrapper.x = 20;
		highscoreWrapper.y = 55 + i * 22;
	}
}

function onGameInitComplete()
{
	stage.onMouseUp = createGame;
}

function loadBitmap(urlToLoad) // :void
{
	var image = new Image();
	image.src = urlToLoad;
	image.onload = onImageLoaded;
	loadedImage = image;
}

function onImageLoaded()
{
	var bitmap = new Bitmap(loadedImage);
	var bitmapContainer = new Container();
	bitmapContainer.addChild(bitmap);
	bitmapContainer.alpha = 0;

	if (background.getNumChildren() > 0)
	{
		oldBitmapContainer = background.getChildAt(0);
		Tween.get(oldBitmapContainer).to({alpha:0},1000).set({visible:false}).call(onBitmapFadeOut);
	}

	background.addChild(bitmapContainer);
	Tween.get(bitmapContainer).to({alpha:1},1000);
}

function onBitmapFadeOut()
{
	background.removeChild(oldBitmapContainer);
}

function createGame(e) // :void
{
	stage.onMouseUp = null;
	
	bouncer = new Shape();
	//bouncer.graphics.beginFill("#FFFFFF").drawRect(-(bouncerWidth/2),0,bouncerWidth,10).endFill();
	redrawBouncer();
	gameElements.addChild(bouncer);
	bouncer.x = 0.5 * (canvas.width - bouncerWidth);
	bouncer.y = canvas.height - 10;
	bouncer.visible = false;

	createBalls();

	Tween.get(messageCenter).to({alpha:0}, 500).set({visible:false}).call(onInitComplete);
}

function onInitComplete() // :void
{
	var ball;
	for (var i in balls)
	{
		ball = balls[i];
		ball.visible = true;
	}

	bouncer.visible = true;

	startGame();
}

function startGame() // :void
{
	stage.onMouseMove = mouseMove;
	
	var ball;
	var pos;
	var speed = Math.min((canvas.height / canvasOriginHeight) * animationTime, animationTime);
	console.log("speed " + speed)
	for (var i in balls)
	{
		ball = balls[i];
		ball.alpha = 0;
		pos = calculateTargetPosition(true);
		Tween.get(ball).wait(i*300).to({alpha:1}, 200).wait(i*500).to( { x:pos.x, y:pos.y }, speed).call(onComplete);
	}
	bouncer.visible = true;
}

function prepareNextLevel(displayText) // :void
{
	highscorelist.visible = submitScore.visible = false;
	messageCenter.visible = message.visible = true;
	message.text = displayText;
	message.x = 20;
	message.y = 60;
	messageCenterBackground.graphics.clear().beginFill("#666").drawRoundRect(0,0,message.getMeasuredWidth() + 40,100,12).endFill();
	messageCenter.x = 0.5 * (canvas.width - message.getMeasuredWidth() + 40);

	Tween.get(messageCenter ,null, true).to({alpha:1});

	stage.mouseEventsEnabled = true;
	stage.onMouseUp = restartGame;
}

function prepareRestart() // :void
{
	stage.onMouseUp = null;
	pts.text = totalScore.toString();
	
	message.visible = false;
	messageCenter.visible = highscorelist.visible = submitScore.visible = true;
	submitScore.y = 275;
	messageCenterBackground.graphics.clear().beginFill("#666").drawRoundRect(0,0,390,440,12).endFill();

	if (totalScore == 0)
	{
		inputSubmit.alpha = 0.5;
	}
	else 
	{
		inputSubmit.alpha = 1;
	}
	//var ty = submitScore.y;
	//submitScore.y = ty - 30;
	Tween.get(messageCenter, null, true).to({alpha:1},500,Ease.circOut).call(activateScoreButtons);
}

function activateScoreButtons()
{
	if (totalScore > 0) inputSubmit.onClick = submitHiscore;
	playAgain.onClick = preRestartGame;
}


function submitHiscore()
{
	var name = document.getElementById("name").value;
	if (name != "Your name")
	{
		//console.log(api_url + "addscore?value="+totalScore+"&scoreholder="+name);
		$.ajax({
			url: api_url + "addscore?value="+totalScore+"&scoreholder="+name,
			dataType: 'jsonp',
			success: onScoreSubmissionComplete
		});

		Tween.get(highscorelist, null, true).to({alpha:0},500,Ease.circOut);
		Tween.get(submitScore, null, true).to({alpha:0},500,Ease.circOut);
		
		inputSubmit.onClick = null;
		playAgain.onClick = null;
		
		/* display preloader */
		console.log("Display loaderbar");
		messageCenter.addChild(loaderbar);
		loaderbar.gotoAndPlay("all");
		loaderbar.x = 0.5 * (390 - 32);
		loaderbar.y = 150;
		loaderbar.gotoAndPlay("start");
	}
	else
	{
		/* display name message */
		errorNameContainer.alpha = 0;
		errorNameContainer.visible = true;
		Tween.get(errorNameContainer, null, true).to({alpha:1},200).to({alpha:0},200).to({alpha:1},200).to({alpha:0},200).to({alpha:1},200).to({alpha:0},200).set({visible:false});
	}
}

function onScoreSubmissionComplete(data)
{
	//.call(onScoreSubmissionComplete);
	messageCenter.removeChild(highscorelist);
	highscorelist = new Container();
	createToplist(data);
	messageCenter.addChild(highscorelist);

	//console.log("onScoreSubmissionComplete " + data);
	messageCenter.visible = message.visible = true;
	message.text = "Click to start game";
	message.x = 0.5 * (390 - message.getMeasuredWidth());
	message.y = 300;
	messageCenterBackground.graphics.clear().beginFill("#666").drawRoundRect(0,0,390,320,12).endFill();

	Tween.get(highscorelist ,null, true).to({alpha:1});

	stage.mouseEventsEnabled = true;
	stage.onMouseUp = restartGame;

}

function preRestartGame()
{
	//console.log("preRestartGame");
	inputSubmit.onClick = null;
	playAgain.onClick = null;
	//var ty = submitScore.y + 30;
	Tween.get(messageCenter, null, true).to({alpha:0},500,Ease.circOut).call(restartGame);
}

function restartGame() // :void
{

	//loadBitmap("http://lorempixel.com/"+canvasW+"/"+canvasH+"/sports/");

	createBalls();

	//Tween.get(message ,null, true).to({alpha:0}, 500).set({visible:false});
	Tween.get(messageCenter ,null, true).to({alpha:0}, 500).set({visible:false}).call(onInitComplete);
}

function mouseMove(e)
{
    bouncer.x = e.stageX;
}

function createBalls()
{
	balls = new Array();
	//console.log("balls " + balls.length)
	var ball;
	for (var i = 0; i < level; i++)
	{
		ball = createBall();
		ball.name = "ball"+i;
		balls.push(ball);
		gameElements.addChild(ball);
		ball.visible = false;
		origin = new Point(0.5 * canvas.width, 0.5 * canvas.height);
		ball.x = origin.x;
		ball.y = origin.y;
	}
}

function removeBalls()
{
	var ball;
	for (var i in balls)
	{
		ball = balls[i];
		Tween.removeTweens(ball);
		gameElements.removeChild(ball);
	}
}

function createBall(radius) // :Shape
{
	var newBall = new Shape();
	if (!radius) radius = ballRadius;
	newBall.graphics.beginFill("#FFFFFF").drawCircle(0, 0, radius).endFill();
	return newBall;
}

function onComplete() // :void
{
	var tween = arguments[0];
	var ball = tween._target;
	var pos;
	var speed = Math.min((canvas.height / canvasOriginHeight) * animationTime, animationTime);

	if (ball.y == canvas.height - ballRadius)
	{
		if (ball.x > bouncer.x - (bouncerWidth / 2) && ball.x < bouncer.x + (bouncerWidth / 2))
		{
			score++;
			scoreTxt.text = score+" pts";
			if (hits == numHitsToLevelUp - 1)
			{
				removeBalls();
				
				bouncer.visible = false;
				bouncerWidth = bouncerInitialWidth;

				hits = 0;
				level++;
				prepareNextLevel("Level "+level+", click to continue");
			}
			else
			{
				pos = calculateTargetPosition(false);
				//console.log("pos " + pos + " " + balls.length)
				Tween.get(ball, null, true).to( { x:pos.x, y:pos.y }, speed).call(onComplete);
				hits = hits + (1 / level);
				bouncerWidth = bouncerWidth - 10;
			}
			redrawBouncer();
		}
		else
		{
			gameover();
		}
	}
	else
	{
		pos = calculateTargetPosition(true);
		Tween.get(ball, null, true).to( { x:pos.x, y:pos.y }, speed).call(onComplete);
	}

}

function gameover() // : void
{
	removeBalls();
	stage.onMouseMove = null;
	//window.removeEventListener("mousemove", mouseMove, false);

	bouncer.visible = false;
	bouncerWidth = bouncerInitialWidth;
	redrawBouncer();

	totalScore = score;
	hits = 0;
	score = 0;
	level = 1;
	scoreTxt.text = score+" pts";
	prepareRestart();
}

function redrawBouncer()
{
	var width = canvas.width / canvasOriginWidth * bouncerWidth 
	bouncer.graphics.clear();
	bouncer.graphics.beginFill("#FFFFFF").drawRect(-(width/2),0,width,10).endFill();
}

function calculateTargetPosition(atBottom) // : Point
{
	var tx = Math.floor(Math.random() * canvas.width);
	var ty;
	if (atBottom)
	{
		ty = canvas.height - ballRadius;
	}
	else
	{
		ty = ballRadius;
	}
	
	return new Point(tx, ty);
}

// DOM functions
function onNameFocus(event)
{
	var text = event.target.value;
	if (text == "Your name")
	{
		event.target.value = "";
	}
}

function onNameBlur(event)
{
	var text = event.target.value;
	if (text == "")
	{
		event.target.value = "Your name";
	}
}
