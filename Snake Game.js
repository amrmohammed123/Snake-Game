$(document).ready(function()
{
	var direction = "up" , score = 0 , snakeXPositions = [], snakeYPositions = []
	, SNAKE_WIDTH = 15 , SNAKE_HEIGHT = 15 , SNAKE_COLOR = "#0F0" , FRUIT_COLOR = "#F00";
	//set the width and height of the gameArea to the width and height of the user's window
	var gameArea = document.getElementById("gameArea");
	gameArea.width = $(window).innerWidth();
	gameArea.height = $(window).innerHeight();
	//draw the snake in the center of the gameArea
	var context = gameArea.getContext("2d");
	context.fillStyle = SNAKE_COLOR;
	for(var i = 0 ; i < 6 ; i++)
	{
		context.fillRect(gameArea.width/2 , gameArea.height/2 - i * SNAKE_HEIGHT , SNAKE_WIDTH , SNAKE_HEIGHT);
		snakeYPositions.push(gameArea.height/2 - i * SNAKE_HEIGHT);
	}
	snakeXPositions.push(gameArea.width/2);
	//move the snake with the event of pressing an arrow key
	document.addEventListener("keydown",function(event)
    {
		var temp = 0;
		if(event.keyCode == 37) //left arrow
		{
			if(direction == "right")
				return;
			temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
			if(temp < 0)
			{
				temp += gameArea.width;
			}
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			if(direction == "up" || direction == "down") //make one more step
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] - SNAKE_WIDTH);
				if(temp < 0)
				{
					temp += gameArea.width;
				}
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
			}
			direction = "left";
		}
		else if(event.keyCode == 38) //up arrow
		{
			if(direction == "down")
				return;
			temp = (snakeYPositions[snakeYPositions.length - 1] - SNAKE_HEIGHT);
			if(temp < 0)
			{
				temp += gameArea.height;
			}
			context.fillRect(snakeXPositions[snakeXPositions.length - 1]
				 ,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeYPositions.push(temp);
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
			}
			direction = "up";
		}
		else if(event.keyCode == 39) //right arrow
		{
			if(direction == "left")
				return;
			temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
			context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeXPositions.push(temp);
			if(direction == "up" || direction == "down") //do one more step
			{
				temp = (snakeXPositions[snakeXPositions.length - 1] + SNAKE_WIDTH) % gameArea.width;
				context.fillRect(temp,snakeYPositions[snakeYPositions.length - 1],SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeXPositions.push(temp);
			}
			direction = "right";
		}
		else if(event.keyCode == 40) //down arrow
		{
			if(direction == "up")
				return;
			temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
			context.fillRect(snakeXPositions[snakeXPositions.length - 1]
				,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
			snakeYPositions.push(temp);
			if(direction == "right" || direction == "left") //do one more step
			{
				temp = (snakeYPositions[snakeYPositions.length - 1] + SNAKE_HEIGHT) % gameArea.height;
				context.fillRect(snakeXPositions[snakeXPositions.length - 1]
					,temp,SNAKE_WIDTH,SNAKE_HEIGHT);
				snakeYPositions.push(temp);
			}
			direction = "down";
		}
    });	
});