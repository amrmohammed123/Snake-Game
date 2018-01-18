$(document).ready(function()
{
	var direction = "up" , score = 0 , snakeXPositions = [], snakeYPositions = [] , time = 50 , j = 0 , position
	, SNAKE_WIDTH = 15 , SNAKE_HEIGHT = 15 , SNAKE_COLOR = "#0F0" , FRUIT_COLOR = "#F00" , i = 0 , emptyKeys = []
	,xPosition = 0 , yPosition = 0 , t = 0;	
	//set the width and height of the gameArea to the width and height of the user's window
	var gameArea = document.getElementById("gameArea");
	gameArea.width = $(window).innerWidth();
	gameArea.height = $(window).innerHeight();
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
	console.log(Object.keys(emptyCells));
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
	console.log(Object.keys(emptyCells));
	//generate a fruit in a random place
	emptyKeys = Object.keys(emptyCells);	
	position = emptyKeys[Math.floor(Math.random() * emptyKeys.length)]; //random valid position
	console.log(position);
	t = position.indexOf("-");
	xPosition = position.substring(0,t);
	yPosition = position.substring(t+1);
	drawFruit(xPosition,yPosition);
	//move the snake 20 times a second in the current direction
	setTimeout(move,time);
	//move the snake with the event of pressing an arrow key
	$(document).keydown(function(event)
    {
		var temp = 0;
		if(event.keyCode == 37) //left arrow
		{
			if(direction == "left" || direction == "right")
				return;
			context.clearRect(0,0,gameArea.width,gameArea.height);
			drawFruit(xPosition,yPosition);
			snakeXPositions.shift();
			snakeYPositions.shift();
			redrawSnake();
			temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
			if(temp < 0)
			{
				temp += gameArea.width;
			}
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
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
				snakeXPositions.shift();
				snakeYPositions.shift();
			}
			direction = "left";
		}
		else if(event.keyCode == 38) //up arrow
		{
			if(direction == "up" || direction == "down")
				return;
			context.clearRect(0,0,gameArea.width,gameArea.height);
			drawFruit(xPosition,yPosition);
			snakeXPositions.shift();
			snakeYPositions.shift();
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
				snakeXPositions.shift();
				snakeYPositions.shift();
			}
			direction = "up";
		}
		else if(event.keyCode == 39) //right arrow
		{
			if(direction == "right" || direction == "left")
				return;
			context.clearRect(0,0,gameArea.width,gameArea.height);
			drawFruit(xPosition,yPosition);
			snakeXPositions.shift();
			snakeYPositions.shift();
			redrawSnake();
			temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
			if(direction == "up" || direction == "down") //do one more step
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
				snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
				snakeXPositions.shift();
				snakeYPositions.shift();
			}
			direction = "right";
		}
		else if(event.keyCode == 40) //down arrow
		{
			if(direction == "down" || direction == "up")
				return;
			context.clearRect(0,0,gameArea.width,gameArea.height);
			drawFruit(xPosition,yPosition);
			snakeXPositions.shift();
			snakeYPositions.shift();
			redrawSnake();
			temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
			context.fillRect(snakeXPositions[snakeXPositions.length - 1]
				,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeYPositions.push(temp);
			snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
			if(direction == "right" || direction == "left") //do one more step
			{
				temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
				snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
				snakeXPositions.shift();
				snakeYPositions.shift();
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
		context.clearRect(0,0,gameArea.width,gameArea.height);
		drawFruit(xPosition,yPosition);
		if(direction == "left")
		{
			snakeXPositions.shift();
			snakeYPositions.shift();
			redrawSnake();
			temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
			if(temp < 0)
			{
				temp += gameArea.width;
			}
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
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
				snakeXPositions.shift();
				snakeYPositions.shift();
			}
			direction = "left";
		}
		else if(direction == "up")
		{
			snakeXPositions.shift();
			snakeYPositions.shift();
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
				snakeXPositions.shift();
				snakeYPositions.shift();
			}
			direction = "up";
		}
		else if(direction == "right")
		{
			snakeXPositions.shift();
			snakeYPositions.shift();
			redrawSnake();
			temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
			if(direction == "up" || direction == "down") //do one more step
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
				snakeYPositions.push(snakeYPositions[snakeYPositions.length-1]);
				snakeXPositions.shift();
				snakeYPositions.shift();
			}
			direction = "right";
		}
		else if(direction == "down")
		{
			snakeXPositions.shift();
			snakeYPositions.shift();
			redrawSnake();
			temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
			context.fillRect(snakeXPositions[snakeXPositions.length - 1]
				,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeYPositions.push(temp);
			snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
			if(direction == "right" || direction == "left") //do one more step
			{
				temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
				snakeXPositions.push(snakeXPositions[snakeXPositions.length-1]);
				snakeXPositions.shift();
				snakeYPositions.shift();
			}
			direction = "down";
		}
		setTimeout(move,time);
    }
	function drawFruit(x,y)
	{
		context.fillStyle = FRUIT_COLOR;
		context.beginPath();
		context.arc(x,y,7.5,0,2 * Math.PI);
		context.fill();
		context.fillStyle = SNAKE_COLOR;
	}
});