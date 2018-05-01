$(document).ready(function()
{
	var direction = "up" , score = 0 , snakeXPositions = [], snakeYPositions = [] , time = 70 , j = 0 , position
	, SNAKE_WIDTH = 15 , SNAKE_HEIGHT = 15 , SNAKE_COLOR = "#0F0" , FRUIT_COLOR = "#F00" , i = 0 , emptyKeys = []
	,xPosition = 0 , yPosition = 0 , t = 0 , over = false;	
	//set the width and height of the gameArea to the width and height of the user's window
	var gameArea = document.getElementById("gameArea");
	gameArea.width = Math.floor($(window).innerWidth()/SNAKE_WIDTH) * SNAKE_WIDTH;
	gameArea.height = Math.floor($(window).innerHeight()/SNAKE_HEIGHT) * SNAKE_HEIGHT;
	$("#gameArea").css("margin-left","" + ($(window).innerWidth()-gameArea.width) / 2 + "px");
	$("#gameArea").css("margin-right","" + ($(window).innerWidth()-gameArea.width) / 2 + "px");
	$("#gameArea").css("margin-top","" + ($(window).innerHeight()-gameArea.height) / 2 + "px");
	$("#gameArea").css("margin-down","" + ($(window).innerHeight()-gameArea.height) / 2 + "px");
	//draw the snake in the center of the gameArea
	var context = gameArea.getContext("2d");
	context.fillStyle = SNAKE_COLOR;
	//generate empty cells positions (for fruits)
	var emptyCells = {};
	var xLimit = Math.floor(gameArea.width / SNAKE_WIDTH);
	var yLimit = Math.floor(gameArea.height / SNAKE_HEIGHT);
	for(i = 1 ; i < xLimit ; i++)
	{
		for(j = 1 ; j < yLimit ; j++)
		{
			emptyCells[((i * 15) + "-" + (j * 15))] = true;	
		}
	}
	for(i = 0 ; i < 6 ; i++)
	{
		context.fillRect(Math.floor(Math.floor(gameArea.width/2) / SNAKE_WIDTH) * SNAKE_WIDTH 
						 , Math.floor(Math.floor(gameArea.height/2)/SNAKE_HEIGHT)*SNAKE_HEIGHT - i * SNAKE_HEIGHT 
						 , SNAKE_WIDTH , SNAKE_HEIGHT);
		delete emptyCells[(Math.floor(Math.floor(gameArea.width/2) / SNAKE_WIDTH) * SNAKE_WIDTH) + "-" 
						  + (Math.floor(Math.floor(gameArea.height/2)/SNAKE_HEIGHT)*SNAKE_HEIGHT - i * SNAKE_HEIGHT)];
		snakeYPositions.push(Math.floor(Math.floor(gameArea.height/2)/SNAKE_HEIGHT)*SNAKE_HEIGHT - i * SNAKE_HEIGHT);
		snakeXPositions.push(Math.floor(Math.floor(gameArea.width/2)/SNAKE_WIDTH)*SNAKE_WIDTH);
	}	
	//generate a fruit in a random place
	generateFruit();
	//move the snake 20 times a second in the current direction
	setTimeout(move,time);
	//move the snake with the event of pressing an arrow key
	$(document).keydown(function(event)
    {
		var temp = 0;
		if(over)
			return;
		if(event.keyCode == 37) //left arrow
		{
			if(direction == "left" || direction == "right")
				return;
			context.clearRect(0,0,gameArea.width,gameArea.height);
			drawFruit(xPosition,yPosition);
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];			
			redrawSnake();
			temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
			if(temp < 0)
			{
				temp += gameArea.width;
			}
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "up" || direction == "down") //make one more step
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
				if(temp < 0)
				{
					temp += gameArea.width;
				}
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
				snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "left";
		}
		else if(event.keyCode == 38) //up arrow
		{
			if(direction == "up" || direction == "down")
				return;
			context.clearRect(0,0,gameArea.width,gameArea.height);
			drawFruit(xPosition,yPosition);
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			redrawSnake();
			temp = (snakeYPositions[snakeYPositions.length - 1] - SNAKE_HEIGHT);
			if(temp < 0)
			{
				temp += gameArea.height;
			}
			context.fillRect(snakeXPositions[snakeXPositions.length - 1]
				 ,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeYPositions.push(temp);
			snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "right" || direction == "left") //do one more step
			{
				temp = (snakeYPositions[snakeYPositions.length - 1] - SNAKE_HEIGHT);
				if(temp < 0)
				{
					temp += gameArea.height;
				}
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					 ,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
				snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "up";
		}
		else if(event.keyCode == 39) //right arrow
		{
			if(direction == "right" || direction == "left")
				return;
			context.clearRect(0,0,gameArea.width,gameArea.height);
			drawFruit(xPosition,yPosition);
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			redrawSnake();
			temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "up" || direction == "down") //do one more step
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
				snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "right";
		}
		else if(event.keyCode == 40) //down arrow
		{
			if(direction == "down" || direction == "up")
				return;
			context.clearRect(0,0,gameArea.width,gameArea.height);
			drawFruit(xPosition,yPosition);
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			redrawSnake();
			temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
			context.fillRect(snakeXPositions[snakeXPositions.length - 1]
				,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeYPositions.push(temp);
			snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "right" || direction == "left") //do one more step
			{
				temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
				snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "down";
		}
    });	
	function redrawSnake()
	{
		var i = 0;
		for(i = 0 ; i < snakeXPositions.length ; i++)
		{
			context.fillRect(snakeXPositions[i],snakeYPositions[i],SNAKE_WIDTH,SNAKE_HEIGHT);
		}
	}
	function move()
    {
		var temp = 0;
		if(over)
			return;
		context.clearRect(0,0,gameArea.width,gameArea.height);
		drawFruit(xPosition,yPosition);
		if(direction == "left")
		{
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			redrawSnake();
			temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
			if(temp < 0)
			{
				temp += gameArea.width;
			}
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "up" || direction == "down") //make one more step
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
				if(temp < 0)
				{
					temp += gameArea.width;
				}
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
				snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "left";
		}
		else if(direction == "up")
		{
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];	
			redrawSnake();
			temp = (snakeYPositions[snakeYPositions.length - 1] - SNAKE_HEIGHT);
			if(temp < 0)
			{
				temp += gameArea.height;
			}
			context.fillRect(snakeXPositions[snakeXPositions.length - 1]
				 ,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeYPositions.push(temp);
			snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "right" || direction == "left") //do one more step
			{
				temp = (snakeYPositions[snakeYPositions.length - 1] - SNAKE_HEIGHT);
				if(temp < 0)
				{
					temp += gameArea.height;
				}
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					 ,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
				snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "up";
		}
		else if(direction == "right")
		{
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			redrawSnake();
			temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "up" || direction == "down") //do one more step
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
				snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "right";
		}
		else if(direction == "down")
		{
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			redrawSnake();
			temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
			context.fillRect(snakeXPositions[snakeXPositions.length - 1]
				,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeYPositions.push(temp);
			snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "right" || direction == "left") //do one more step
			{
				temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
				snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "down";
		}
		setTimeout(move,time);
    }
	function drawFruit(x,y)
	{
		context.fillStyle = FRUIT_COLOR;
		context.fillRect(x,y,SNAKE_WIDTH,SNAKE_HEIGHT);
		context.fillStyle = SNAKE_COLOR;
	}
	function checkFruit(x,y)
	{
		if(xPosition == x && yPosition == y)
		{
			generateFruit();
			if(time - 3 > 10)
				time -= 3;
			//increase size
			increaseSize();
			score += 100;
		}
	}
	function generateFruit()
	{
		emptyKeys = Object.keys(emptyCells);	
		position = emptyKeys[Math.floor(Math.random() * emptyKeys.length)]; //random valid position
		t = position.indexOf("-");
		xPosition = position.substring(0,t);
		yPosition = position.substring(t+1);
		drawFruit(xPosition,yPosition);
	}
	function updateEmptyCells()
	{
		delete emptyCells[snakeXPositions[snakeXPositions.length-1] + "-" + snakeYPositions[snakeYPositions.length-1]];
		checkFruit(snakeXPositions[snakeXPositions.length-1],snakeYPositions[snakeYPositions.length-1]);
	}
	function increaseSize()
	{
		var temp = 0 , k = 0;
		context.clearRect(0,0,gameArea.width,gameArea.height);
		drawFruit(xPosition,yPosition);
		if(direction == "left")
		{
			for(k = 0 ; k < 3 ; k++)
			{
				redrawSnake();
				temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
				if(temp < 0)
				{
					temp += gameArea.width;
				}
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
				snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
			}
			updateEmptyCells();
		}
		else if(direction == "up")
		{
			redrawSnake();
			for(k = 0 ; k < 3 ; k++)
			{
				temp = (snakeYPositions[snakeYPositions.length - 1] - SNAKE_HEIGHT);
				if(temp < 0)
				{
					temp += gameArea.height;
				}
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					 ,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
				snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
			}
			updateEmptyCells();
		}
		else if(direction == "right")
		{
			redrawSnake();
			for(k = 0 ; k < 3 ; k++)
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
				snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
				updateEmptyCells();
			}				
		}
		else if(direction == "down")
		{
			for(k = 0 ; k < 3 ; k++)
			{
				redrawSnake();
				temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
				snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
				updateEmptyCells();
			}
		}
	}
	function checkEndGame()
	{
		var i = 0 , x = snakeXPositions[snakeXPositions.length - 1] , y = snakeYPositions[snakeYPositions.length - 1];
		for(i = 0 ; i < snakeXPositions.length - 1 ; i++)
		{
			if(snakeXPositions[i] == x && snakeYPositions[i] == y) //game over
			{
				over = true;
				$("#endGame").html('You Lost<br>Your Score:' + score + '<br><button id="again">Play Again</button>').show();
				$("#gameArea").css("background-color","#000").css("opacity","0.9");
				$("#again").click(function()
				{
					$("#endGame").hide();
					$("#gameArea").css("background-color","#FFF").css("opacity","1");
					context.clearRect(0,0,gameArea.width,gameArea.height);
					snakeXPositions = [];
					snakeYPositions = [];
					emptyCells = {};
					for(i = 1 ; i < xLimit ; i++)
					{
						for(j = 1 ; j < yLimit ; j++)
						{
							emptyCells[((i * 15) + "-" + (j * 15))] = true;	
						}
					}
					for(i = 0 ; i < 6 ; i++)
					{
						context.fillRect(Math.floor(Math.floor(gameArea.width/2) / SNAKE_WIDTH) * SNAKE_WIDTH 
										 , Math.floor(Math.floor(gameArea.height/2)/SNAKE_HEIGHT)*SNAKE_HEIGHT - i * SNAKE_HEIGHT 
										 , SNAKE_WIDTH , SNAKE_HEIGHT);
						delete emptyCells[(Math.floor(Math.floor(gameArea.width/2) / SNAKE_WIDTH) * SNAKE_WIDTH) + "-" 
										  + (Math.floor(Math.floor(gameArea.height/2)/SNAKE_HEIGHT)*SNAKE_HEIGHT - i * SNAKE_HEIGHT)];
						snakeYPositions.push(Math.floor(Math.floor(gameArea.height/2)/SNAKE_HEIGHT)*SNAKE_HEIGHT - i * SNAKE_HEIGHT);
						snakeXPositions.push(Math.floor(Math.floor(gameArea.width/2)/SNAKE_WIDTH)*SNAKE_WIDTH);
					}	
					//generate a fruit in a random place
					generateFruit();					
					score = 0;
					time = 70;
					over = false;
					moveAgain();
				});
				break;
			}
		}
	}
	function moveAgain()
	{
		var temp = 0;
		if(over)
			return;
		context.clearRect(0,0,gameArea.width,gameArea.height);
		drawFruit(xPosition,yPosition);
		if(direction == "left")
		{
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			redrawSnake();
			temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
			if(temp < 0)
			{
				temp += gameArea.width;
			}
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "up" || direction == "down") //make one more step
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
				if(temp < 0)
				{
					temp += gameArea.width;
				}
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
				snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "left";
		}
		else if(direction == "up")
		{
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];	
			redrawSnake();
			temp = (snakeYPositions[snakeYPositions.length - 1] - SNAKE_HEIGHT);
			if(temp < 0)
			{
				temp += gameArea.height;
			}
			context.fillRect(snakeXPositions[snakeXPositions.length - 1]
				 ,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeYPositions.push(temp);
			snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "right" || direction == "left") //do one more step
			{
				temp = (snakeYPositions[snakeYPositions.length - 1] - SNAKE_HEIGHT);
				if(temp < 0)
				{
					temp += gameArea.height;
				}
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					 ,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
				snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "up";
		}
		else if(direction == "right")
		{
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			redrawSnake();
			temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "up" || direction == "down") //do one more step
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
				snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "right";
		}
		else if(direction == "down")
		{
			emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			redrawSnake();
			temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
			context.fillRect(snakeXPositions[snakeXPositions.length - 1]
				,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeYPositions.push(temp);
			snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
			updateEmptyCells();
			checkEndGame();
			if(direction == "right" || direction == "left") //do one more step
			{
				temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
				snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
				updateEmptyCells();
				checkEndGame();
				emptyCells[snakeXPositions.shift() + "-" + snakeYPositions.shift()];
			}
			direction = "down";
		}
		setTimeout(moveAgain,time);
	}
});
