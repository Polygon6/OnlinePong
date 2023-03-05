console.log('js works');

//----------------------- declareing variables -----------------------
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
var canvasW;
var canvasH;
var margin = 0;
var Rposition;
var Lposition;
var speed = 1;
var pongballs;
var rp = document.getElementById('right');
var lp = document.getElementById('left');
var scoreboard = document.getElementById('scoreboard');
var highscoreboard = document.getElementById('highscores');
var pongballsize = 20;
var pongpadsize = 60;
var menuO = document.getElementById('menuO');
var menu = document.getElementById('menu');
var menucontent = document.getElementsByClassName('menucontent');
var menubuttonsCL = document.getElementsByClassName('menubuttonCL');
var menubuttonsCR = document.getElementsByClassName('menubuttonCR');
var menudisplay = document.getElementById('menudisplay');
var playertags = document.getElementsByClassName('playertag');
var menuO_F = false;
var menuopacity = 0;
var centerbuttonY = [0];
var centerbuttonSY;
var menuR = document.getElementById('menuR');
var menuL = document.getElementById('menuL');
var menusideC1 = document.getElementsByClassName('sidepanelC1');
var menusideC2 = document.getElementsByClassName('sidepanelC2');
var menusideSX;
var config = [false,false,false,false,false,false,false,false,false,false,false,false];
var AIside = 'N';
var targetpongball;
var Lscore = 0;
var Rscore = 0;
var Lmiss = 0;
var Rmiss = 0;

//setting menu attributes (look, I know this dosen't make sense but I have to set these first before I can read them for some reason)
menu.style.top = '0px';
menu.style.height = '0px';
menuL.style.width = '0px';
menuR.style.width = '0px';

for (var i = menubuttonsCL.length - 1; i >= 0; i--) {
	menubuttonsCL[i].style.top = '0px';
	menubuttonsCR[i].style.top = '0px';
}

for (var i = highscoreboard.children[1].children.length - 1; i >= 0; i--) {
	highscoreboard.children[1].children[i].style.opacity = 1;
	highscoreboard.children[2].children[i].style.opacity = 1;
}

//----------------------- declareing objects -----------------------

//pongball class initializor
function pongball(speedx, speedy, x, y) { 
	this.speedx = speedx;
	this.speedy = speedy;
	this.x = x;
	this.y = y;
}
pongballs = [new pongball(speed, speed, null, null)];
targetpongball = pongballs[0]; //pongball targeted by the AI
console.log(pongballs); //debug stuff

//barriers
var bl = new pongball(null, null, null, null);
var br = new pongball(null, null, null, null);

//----------------------- declareing functions -----------------------

//updateing the board of highscores
function updateHS (side, score, value) {
	if (value > parseInt(highscoreboard.children[side].children[score].innerHTML)) {
		highscoreboard.children[side].children[score].innerHTML = value.toFixed(0);
	}
}

//checking for WS/UH key presses (event listener)
function keyhit () {
	if (config[4]){
		if (event.key == 'w'){
			Lposition = Lposition-30;

			if (config[0]) {
			Lmiss = Lmiss+(((Lposition - ((Lposition-30)-(margin+1))-(pongpadsize/2))*NC(Lposition - ((Lposition-30)-(margin+1))-(pongpadsize/2)))/500);
			}
		}
		if (event.key == 's'){
			Lposition = Lposition+30;

			if (config[0]) {
			Lmiss = Lmiss+(((Lposition - ((Lposition+30)-(margin+1))-(pongpadsize/2))*NC(Lposition - ((Lposition+30)-(margin+1))-(pongpadsize/2)))/500);
			}
		}
		if (event.key == 'u'){
			Rposition = Rposition-30;

			if (config[0]) {
			Rmiss = Rmiss+(((Rposition - ((Rposition-30)-(margin+1))-(pongpadsize/2))*NC(Rposition - ((Rposition-30)-(margin+1))-(pongpadsize/2)))/500);
			}
		}
		if (event.key == 'h'){
			Rposition = Rposition+30;

			if (config[0]) {
			Rmiss = Rmiss+(((Rposition - ((Rposition+30)-(margin+1))-(pongpadsize/2))*NC(Rposition - ((Rposition+30)-(margin+1))-(pongpadsize/2)))/500);
			}
		}
	}
}
window.addEventListener('keypress', keyhit);

//center menu button event listener/setttings changer (menuCBpress means 'menu-center-button-press')
function menuCBpress() {
	for (var i = menubuttonsCL.length - 1; i >= 0; i--)
	{
		if (event.target == menubuttonsCL[0].children[1])
		{
			speed = 1;
			menudisplay.children[0].innerHTML = 'Speed: Slow'
		}
		if (event.target == menubuttonsCL[1].children[1])
		{
			speed = 3;
			menudisplay.children[0].innerHTML = 'Speed: Normal'
		}
		if (event.target == menubuttonsCL[2].children[1])
		{
			speed = 5;
			menudisplay.children[0].innerHTML = 'Speed: Fast'
		}
		if (event.target == menubuttonsCL[3].children[1])
		{
			speed = 10;
			menudisplay.children[0].innerHTML = 'Speed: Expert'
		}
	}
	for (var i = menubuttonsCR.length - 1; i >= 0; i--)
	{
		if (event.target == menubuttonsCR[0].children[1])
		{
			pongballs=[new pongball(speed, speed, null, null)];
			menudisplay.children[1].innerHTML = 'Pongballs: 1'
		}
		if (event.target == menubuttonsCR[1].children[1])
		{
			pongballs=[new pongball(speed, speed, null, null), new pongball(speed, speed, null, null)];
			menudisplay.children[1].innerHTML = 'Pongballs: 2'
		}
		if (event.target == menubuttonsCR[2].children[1])
		{
			pongballs=[new pongball(speed, speed, null, null), new pongball(speed, speed, null, null), new pongball(speed, speed, null, null)];
			menudisplay.children[1].innerHTML = 'Pongballs: 3'
		}
		if (event.target == menubuttonsCR[3].children[1])
		{
			pongballs=[new pongball(speed, speed, null, null), new pongball(speed, speed, null, null), new pongball(speed), new pongball(speed, speed, null, null)];
			menudisplay.children[1].innerHTML = 'Pongballs: 4'
		}
	}
}
menucontent[1].addEventListener('mousedown', menuCBpress);

//menu side panel event listener
function menuSBpress() {
	for (var i = menusideC1.length - 1; i >= 0; i--)
	{
		if (event.target == menusideC1[i].children[1])
		{
			config[i] = !config[i];
		}
		if (event.target == menusideC2[i].children[1])
		{
			config[i+6] = !config[i+6];
		}
	}
}
menucontent[2].addEventListener('mousedown', menuSBpress);
menucontent[3].addEventListener('mousedown', menuSBpress);

//menu open/close (menuO_F means menuOn/Off)
function menuopen() {
	menuO_F = true;
	AIside = 'N';
}
function menuclose() {
	menuO_F = false;
}
menuO.addEventListener('mouseover', menuopen);
menuO.addEventListener('mouseout', menuclose);

//left and right pad movement

function Lmove() {
	if (config[4] == false) {
		if (config[0]){
			Lmiss = Lmiss+(((Lposition - (event.y-(margin+1))-(pongpadsize/2))*NC(Lposition - (event.y-(margin+1))-(pongpadsize/2)))/10000);
		}
		Lposition = (event.y-(margin+1))-(pongpadsize/2);
	}
	
	if (config[3] && (AIside !== 'R')) {
		Lscore = 0;
		Lmiss = 0;
		Rscore = 0;
		Rmiss = 0;
		AIside = 'R';
	}
}
function Rmove() {
	if (config[4] == false) {
		if (config[0]){
			Rmiss = Rmiss+(((Rposition - (event.y-(margin+1))-(pongpadsize/2))*NC(Rposition - (event.y-(margin+1))-(pongpadsize/2)))/10000);
		}
		Rposition = (event.y-(margin+1))-(pongpadsize/2);
	}

	if (config[3] && (AIside !== 'L')) {
		Rscore = 0;
		Rmiss = 0;
		Lscore = 0;
		Lmiss = 0;
		AIside = 'L';
	}
}
lp.addEventListener('mousemove', Lmove);
rp.addEventListener('mousemove', Rmove);

//function to check if number is negative or not (outpuuts 1 or -1)
function NC(int) {
	if (int < 0){
		return(-1);
	}else{
		return(1);
	}
}

//function for collision detection
function detectC (x, y, cx, cy, cw, ch) {
	if (((x >= cx) && (x <= (cx+cw))) && ((y >= cy) && (y <= (cy+ch)))){
		return(true);
	}
	else if ((((x+pongballsize) >= cx) && ((x+pongballsize) <= (cx+cw))) && ((y >= cy) && (y <= (cy+ch)))){
		return(true);
	}
	else if (((x >= cx) && (x <= (cx+cw))) && (((y+pongballsize) >= cy) && ((y+pongballsize) <= (cy+ch)))){
		return(true);
	}
	else if ((((x+pongballsize) >= cx) && ((x+pongballsize) <= (cx+cw))) && (((y+pongballsize) >= cy) && ((y+pongballsize) <= (cy+ch)))){
		return(true);
	}
	else{
		return(false);
	}
}

// ----------------------- canvas related stuff -----------------------

//starting function
function start() {
	//adjusting for settings
	if (config[2]) {
		pongpadsize = 120;
	} else {
		pongpadsize = 60;
	}
	if (config[1]) {
		pongballsize = 40;
	} else {
		pongballsize = 20;
	}

	//resetting score
	Lscore = 0;
	Rscore = 0;
	Lmiss = 0;
	Rmiss = 0;

	//positioning pongpads
	Lposition = (canvasH/2)-(pongpadsize/2);
	Rposition = (canvasH/2)-(pongpadsize/2);

	//setting speed
	for (var i = pongballs.length - 1; i >= 0; i--) {
		pongballs[i].speedx = speed;
		pongballs[i].speedy = speed;
	}

	bl.speedy = speed*-1;
	br.speedy = speed;

	//positioning barriers
	bl.y = canvasH-80;
	br.y = 0;

	//positioning pongballs
	if (pongballs.length == 1) {
		pongballs[0].x = (canvasW/2)-(pongballsize/2);
		pongballs[0].y = (canvasH/2)-(pongballsize/2);
	}
	if (pongballs.length == 2) {
		pongballs[0].x = (canvasW/3)-(pongballsize/2);
		pongballs[0].y = (canvasH/2)-(pongballsize/2);

		pongballs[1].x = ((canvasW/3)*2)-(pongballsize/2);
		pongballs[1].y = (canvasH/2)-(pongballsize/2);
	}
	if (pongballs.length == 3) {
		pongballs[0].x = (canvasW/4)-(pongballsize/2);
		pongballs[0].y = (canvasH/2)-(pongballsize/2);

		pongballs[1].x = ((canvasW/4)*2)-(pongballsize/2);
		pongballs[1].y = (canvasH/2)-(pongballsize/2);

		pongballs[2].x = ((canvasW/4)*3)-(pongballsize/2);
		pongballs[2].y = (canvasH/2)-(pongballsize/2);

	}
	if (pongballs.length > 3) {
		pongballs[0].x = (canvasW/3)-(pongballsize/2);
		pongballs[0].y = (canvasH/3)-(pongballsize/2);

		pongballs[1].x = ((canvasW/3)*2)-(pongballsize/2);
		pongballs[1].y = (canvasH/3)-(pongballsize/2);

		pongballs[2].x = (canvasW/3)-(pongballsize/2);
		pongballs[2].y = ((canvasH/3)*2)-(pongballsize/2);

		pongballs[3].x = ((canvasW/3)*2)-(pongballsize/2);
		pongballs[3].y = ((canvasH/3)*2)-(pongballsize/2);
	}
}

//repeating function
function repeat()
{
	requestAnimationFrame(repeat);

	if (canvasW === null){
		console.log('repeat called');
	}

	//resizeing to ajust to window
	canvasW = window.innerWidth/2;
	canvas.width = canvasW-2;

	canvasH = canvasW/2;
	canvas.height = canvasH-2;

	//setting margin
	margin = window.innerHeight/20;

	//relocating pong pads, scoreboard and canvas
	canvas.style.top = margin+'px';
	lp.style.top = margin+'px';
	rp.style.top = margin+'px';
	scoreboard.style.top = margin+'px';

	//resizeing pong pads and scoreboard
	lp.style.height = canvasH+'px';
	rp.style.height = canvasH+'px';
	scoreboard.style.height = canvasH+'px';

	//relocateing and resizeing menu
	menuO.style.top = (margin+canvasH)+'px'; 
	menuO.style.height = (window.innerWidth*0.025)+'px';

	//relocateing highscores
	highscoreboard.style.top = (margin+canvasH+(window.innerWidth*0.025)+20)+'px';

	//hideing highscores
	if (window.innerWidth < 800){
		highscoreboard.style.opacity = 0;
	}
	else{
		highscoreboard.style.opacity = 1;
	}

	//menu open and close animations
	for (var i = 0; i < 10; i++)
	{
		if (menuO_F)
		{
			if (menu.style.top !== (((canvasH.toFixed(0)*-1)-20)+'px'))
			{
				menu.style.top = (parseInt(menu.style.top)-1)+'px';
			}
			if (menu.style.height !== ((canvasH.toFixed(0)-(20*-1))+'px'))
			{
				menu.style.height = (parseInt(menu.style.height)+1)+'px';
			}

			if (menuL.style.width !== (parseInt(((canvasW-(window.innerWidth/10))/2).toFixed(0))+20)+'px')
			{
				menuL.style.width = (parseInt(menuL.style.width)+1)+'px';
				menuR.style.width = (parseInt(menuR.style.width)+1)+'px';
			}
		}
		else
		{
			if (menu.style.top !== '0px')
			{
				menu.style.top = (parseInt(menu.style.top)+1)+'px';
			}
			if (menu.style.height !== '0px')
			{
				menu.style.height = (parseInt(menu.style.height)-1)+'px';
			}

			if (menuL.style.width !== '0px')
			{
				menuL.style.width = (parseInt(menuL.style.width)-1)+'px';
				menuR.style.width = (parseInt(menuR.style.width)-1)+'px';
			}

			if (parseInt(menu.style.height) > (canvasH/3))
			{
				start();
			}
		}
	}

	if (menu.style.height == ((canvasH.toFixed(0)-(20*-1))+'px'))
	{	
		menuopacity = menuopacity+3;

		if (menuopacity > 100)
		{
			menuopacity = 100;
		}

		for (var i = menubuttonsCL.length - 1; i >= 0; i--)
		{
			menubuttonsCL[i].style.top = centerbuttonY[i]+'px';
			menubuttonsCR[i].style.top = centerbuttonY[i]+'px';
		}
	}
	else
	{
		menuopacity = menuopacity-10;

		if (menuopacity < 0)
		{
			menuopacity = 0;
		}
		
		for (var i = menubuttonsCL.length - 1; i >= 0; i--)
		{
			menubuttonsCL[i].style.top = '0px';
			menubuttonsCR[i].style.top = '0px';
		}
	}

	for (var i = menucontent.length - 1; i >= 0; i--)
	{
		menucontent[i].style.opacity = menuopacity/100;
	}

	//resizeing left and right menu segments
	menuL.style.height = (parseInt(menu.style.height)-20)+'px';
	menuR.style.height = (parseInt(menu.style.height)-20)+'px';

	//positioning menu center buttons
	centerbuttonY[0] = canvasH*0.025;

	for (var i = 1; i < 4; i++)
	{
		centerbuttonY[i] = centerbuttonY[i-1] + (canvasH/4);
	}

	//spaceing the sidepanel buttons
	menusideSX = parseInt(menuL.style.width)/40;
	for (var i = ((menusideC1.length/2)-1); i >= 0; i--)
	{
		menusideC1[i].style.right = ((((parseInt(menuR.style.width)*0.3)+menusideSX)*i)+menusideSX)+'px';
		menusideC2[i].style.right = ((((parseInt(menuR.style.width)*0.3)+menusideSX)*i)+menusideSX)+'px';
	}
	for (var i = (menusideC1.length/2); i <= (menusideC1.length-1); i++)
	{
		menusideC1[i].style.right = ((((parseInt(menuL.style.width)*0.3)+menusideSX)*(i-3))+menusideSX)+'px';
		menusideC2[i].style.right = ((((parseInt(menuL.style.width)*0.3)+menusideSX)*(i-3))+menusideSX)+'px';
	}

	//centering the sidepanel buttons
	for (var i = (menusideC1.length-1); i >= 0; i--)
	{
		menusideC1[i].children[0].style.left = (((parseInt(menuL.style.width)*0.3)-(parseInt(menuL.style.height)*0.2))/2)+'px';
	}
	for (var i = (menusideC2.length-1); i >= 0; i--)
	{
		menusideC2[i].children[0].style.left = (((parseInt(menuL.style.width)*0.3)-(parseInt(menuL.style.height)*0.2))/2)+'px';
	}

	//sidepanel buttons On/Off
	for (var i = config.length - 1; i >= 0; i--)
	{
		if (config[i] == true){
			if (i < 6)
			{
				menusideC1[i].style.borderRadius = '12px';
			}
			else
			{
				menusideC2[i-6].style.borderRadius = '12px';
			}
		}
		if (config[i] == false){
			if (i < 6)
			{
				menusideC1[i].style.borderRadius = '0px';
			}
			else
			{
				menusideC2[i-6].style.borderRadius = '0px';
			}
		}
	}

	//resizeing and relocateing menu icons
	for (var i = menubuttonsCL.length - 1; i >= 0; i--)
	{
		menubuttonsCL[i].children[0].style.height = ((window.innerWidth/10)*0.425)+'px';
		menubuttonsCR[i].children[0].style.height = ((window.innerWidth/10)*0.425)+'px';

		menubuttonsCL[i].children[0].style.top = ((((parseInt(menu.style.height)/20)*4)-((window.innerWidth/10)*0.425))/2)+'px';
		menubuttonsCR[i].children[0].style.top = ((((parseInt(menu.style.height)/20)*4)-((window.innerWidth/10)*0.425))/2)+'px';
	}

	//resizeing playertags
	if (window.innerWidth >= 1004)
	{
		playertags[0].style.fontSize = '22px';
		playertags[1].style.fontSize = '22px';
	}
	else
	{
		playertags[0].style.fontSize = '10px';
		playertags[1].style.fontSize = '10px';
	}

	//updateing playertags for win/lose
	if (((Lscore*!config[10])+Rmiss) > ((Rscore*!config[10])+Lmiss))
	{
		playertags[1].style.background = 'linear-gradient(to left top, #b37f23, #c89c3d, #d8af75)';
		playertags[0].style.background = 'linear-gradient(to right top, #6c798a, #9fa7b4, #e2e4e7)';
	}
	else if (((Lscore*!config[10])+Rmiss) < ((Rscore*!config[10])+Lmiss))
	{
		playertags[1].style.background = 'linear-gradient(to left top, #6c798a, #9fa7b4, #e2e4e7)';
		playertags[0].style.background = 'linear-gradient(to right top, #b37f23, #c89c3d, #d8af75)';
	}
	else
	{
		playertags[1].style.background = 'linear-gradient(to left top, #b37f23, #c89c3d, #d8af75)';
		playertags[0].style.background = 'linear-gradient(to right top, #b37f23, #c89c3d, #d8af75)';
	}

	//updateing highscores
	if ((AIside == 'R') || !(config[3] || menuO_F))
	{
		updateHS(1, 2, Lscore);

		if (!config[10]){
			updateHS(1, 1, (Lscore + Rmiss)-(Rscore + Lmiss));
			updateHS(1, 0, (Lscore + Rmiss));
		}
		else{
			updateHS(1, 1, (Rmiss - Lmiss));
			updateHS(1, 0, Rmiss);
		}
	}
	if ((AIside == 'L') || !(config[3] || menuO_F))
	{
		updateHS(2, 2, Rscore);

		if (!config[10]){
			updateHS(2, 1, (Rscore + Lmiss)-(Lscore + Rmiss));
			updateHS(2, 0, (Rscore + Lmiss));
		}
		else{
			updateHS(2, 1, (Lmiss - Rmiss));
			updateHS(2, 0, Lmiss);
		}
	}

	//resizeing the font of settings display
	if (window.innerWidth >= 1636){
		menudisplay.children[0].style.fontSize = '12px';
		menudisplay.children[1].style.fontSize = '12px';
	}
	else if (window.innerWidth >= 1441){
		menudisplay.children[0].style.fontSize = '9px';
		menudisplay.children[1].style.fontSize = '9px';
	}
	else if (window.innerWidth >= 801){
		menudisplay.children[0].style.fontSize = '6px';
		menudisplay.children[1].style.fontSize = '6px';
	}
	else {
		menudisplay.children[0].style.opacity = 0;
		menudisplay.children[1].style.opacity = 0;
	}

	if (window.innerWidth >= 801){
		menudisplay.children[0].style.opacity = 1;
		menudisplay.children[1].style.opacity = 1;
	}

	//updateing counters
	lp.children[0].innerHTML = 'Hits: ' + Lscore.toFixed(1);
	lp.children[1].innerHTML = 'Misses: ' + Lmiss.toFixed(1);

	rp.children[1].innerHTML = 'Hits: ' + Rscore.toFixed(1);
	rp.children[0].innerHTML = 'Misses: ' + Rmiss.toFixed(1);

	//hideing/showing counters
	if (config[5] && window.innerWidth >= 1280) {
		lp.style.opacity = 1;
		rp.style.opacity = 1;
	}else{
		lp.style.opacity = 0;
		rp.style.opacity = 0;
	}

	//updateing scoreboard
	if ((((Lmiss+(Rscore*!config[10]))+(Rmiss+(Lscore*!config[10])))%1) == 0) {
		scoreboard.children[0].innerHTML = Lmiss+(Rscore*!config[10])
		scoreboard.children[1].innerHTML = Rmiss+(Lscore*!config[10])
	}
	else {
		scoreboard.children[0].innerHTML = (Lmiss+(Rscore*!config[10])).toFixed(1);
		scoreboard.children[1].innerHTML = (Rmiss+(Lscore*!config[10])).toFixed(1);
	}

	//hideing/showing scoreboard
	if (config[11])
	{
		scoreboard.style.opacity = 1;
	}else{
		scoreboard.style.opacity = 0;
	}

	//adjusting variables for border size
	canvasH = canvasH-2;
	canvasW = canvasW-2;

	//AI emulated inputs
	if (config[3]){
		if (AIside !== 'L'){
			for (var i = pongballs.length - 1; i >= 0; i--)
			{
				if (pongballs[i].x > targetpongball.x)
				{
					targetpongball = pongballs[i];
				}
			}
			Rposition = (targetpongball.y+(pongballsize/2))-pongpadsize/2;
		}
		if (AIside !== 'R'){
			for (var i = pongballs.length - 1; i >= 0; i--)
			{
				if (pongballs[i].x < targetpongball.x)
				{
					targetpongball = pongballs[i];
				}
			}
			Lposition = (targetpongball.y+(pongballsize/2))-pongpadsize/2;
		}
	}

	//drawing the pongpads
	c.fillRect(15,Lposition,5,pongpadsize);
	c.fillRect(canvasW-20,Rposition,5,pongpadsize);

	//drawing the centerline
	c.fillRect((canvasW-pongballsize)/2, 0, pongballsize, canvasH);
	for (var i = 0; i <= ((canvasH/pongballsize)/2)+1; i++)
	{
		c.clearRect(((canvasW-pongballsize)/2)-2, ((i*pongballsize*2)-pongballsize)+((canvasH%pongballsize)/2), (pongballsize)+4, pongballsize);
	}

	//drawing and moveing barriers 
	if (config[8])
	{
		c.fillRect(bl.x, bl.y, 15, 80);
		c.fillRect(br.x, br.y, 15, 80);

		//moveing the barriers
		bl.y = bl.y+bl.speedy;
		br.y = br.y+br.speedy;

		bl.x = ((canvasW/8)*2)-(pongballsize/2);
		br.x = ((canvasW/8)*6)-(pongballsize/2);

		//collisions with borders
		if ((bl.y + 80) >= canvasH){
			bl.speedy = speed*-1;
		}
		if ((br.y + 80) >= canvasH){
			br.speedy = speed*-1;
		}

		if (bl.y <= 0){
			bl.speedy = speed;
		}
		if (br.y <= 0){
			br.speedy = speed;
		}
	}

	//drawing and moveing the pongballs on the canvas
	for (var i = pongballs.length - 1; i >= 0; i--)
	{
		c.fillRect(pongballs[i].x, pongballs[i].y, pongballsize, pongballsize);

		pongballs[i].x = pongballs[i].x + pongballs[i].speedx;
		pongballs[i].y = pongballs[i].y + pongballs[i].speedy;

		//collisions with borders
		if (pongballs[i].y+pongballsize >= canvasH)
		{
			if (config[7] == false){
				pongballs[i].speedy = speed*-1;
			}
			else{
				pongballs[i].speedy = pongballs[i].speedy*-1;
			}
		}
		if (pongballs[i].y <= 0)
		{
			if (config[7] == false){
				pongballs[i].speedy = speed;
			}
			else{
				pongballs[i].speedy = pongballs[i].speedy*-1;
			}
		}

		if (pongballs[i].x+pongballsize >= canvasW)
		{
			if ((menuO_F == false) && !config[9]){
				Rmiss = Rmiss+1;
			}

			if (config[9] && (pongballs[i].x >= canvasW))
			{
				pongballs[i].y = (Rposition-(pongpadsize/2))-(pongballsize/2);
				pongballs[i].x = (canvasW/2)-(pongballsize/2);
				Rmiss = Rmiss+1;
			}
			if (!config[9])
			{
				pongballs[i].speedx = speed*-1;
			}
		}
		if (pongballs[i].x <= 0)
		{
			if ((menuO_F == false) && !config[9]){
				Lmiss = Lmiss+1;
			}
			
			if (config[9] && (pongballs[i].x <= (pongballsize*-1)))
			{
				pongballs[i].y = (Lposition-(pongpadsize/2))-(pongballsize/2);
				pongballs[i].x = (canvasW/2)-(pongballsize/2);
				Lmiss = Lmiss+1;
			}
			if (!config[9])
			{
				pongballs[i].speedx = speed;
			}
		}

		//collisions with pongpads
		if (config[6] == false)
		{
			//standard collisions with pongpads
			if ((pongballs[i].x <= 20) && (((pongballs[i].y+pongballsize) >= Lposition) && (pongballs[i].y <= (Lposition+pongpadsize))))
			{
				pongballs[i].speedx = speed;
				if (menuO_F == false){
					Lscore = Lscore+1;
				}
			}
			if ((pongballs[i].x >= (canvasW-(pongballsize+20))) && (((pongballs[i].y+pongballsize) >= Rposition) && (pongballs[i].y <= (Rposition+pongpadsize))))
			{
				pongballs[i].speedx = speed*-1;
				if (menuO_F == false){
					Rscore = Rscore+1;
				}
			}
		}
		else
		{
			//classic collisions with pongpads
			if ((pongballs[i].x <= 20) && (((pongballs[i].y+pongballsize) >= Lposition) && (pongballs[i].y <= (Lposition+pongpadsize))))
			{
				pongballs[i].speedx = speed;
				if (((pongballs[i].y-(pongballsize/2))-Lposition) <= (pongpadsize/2))
				{
					//upper half hit
					pongballs[i].speedy = (((speed*8)/(((pongballs[i].y-(pongballsize/2))-(Lposition-(pongpadsize/2)))/(pongpadsize/20)))*NC(pongballs[i].speedy));
				}
				else
				{
					//lower half hit
					pongballs[i].speedy = (((speed*8)/(((pongballs[i].y-(pongballsize/2))-(Lposition+(pongpadsize/2)))/(pongpadsize/20)))*NC(pongballs[i].speedy));
				}

				if (menuO_F == false){
					Lscore = Lscore+1;
				}
			}
			if ((pongballs[i].x >= (canvasW-(pongballsize+20))) && (((pongballs[i].y+pongballsize) >= Rposition) && (pongballs[i].y <= (Rposition+pongpadsize))))
			{
				pongballs[i].speedx = speed*-1;
				if (((pongballs[i].y-(pongballsize/2))-Rposition) <= (pongpadsize/2))
				{
					//upper half hit
					pongballs[i].speedy = (((speed*8)/(((pongballs[i].y-(pongballsize/2))-(Rposition-(pongpadsize/2)))/(pongpadsize/20)))*NC(pongballs[i].speedy));
				}
				else
				{
					//lower half hit
					pongballs[i].speedy = (((speed*8)/(((pongballs[i].y-(pongballsize/2))-(Rposition+(pongpadsize/2)))/(pongpadsize/20)))*NC(pongballs[i].speedy));
				}

				if (menuO_F == false){
					Rscore = Rscore+1;
				}
			}
		}

		//collisons with pongballs
		for (var ii = pongballs.length - 1; ii >= 0; ii--)
		{
			if ((detectC(pongballs[i].x, pongballs[i].y, pongballs[ii].x, pongballs[ii].y, pongballsize, pongballsize)) && (pongballs[i] !== pongballs[ii]))
			{
				if (pongballs[i].speedx !== pongballs[ii].speedx)
				{
					pongballs[i].speedx = pongballs[i].speedx*-1;
					pongballs[ii].speedx = pongballs[ii].speedx*-1;
				}
				if (pongballs[i].speedy !== pongballs[ii].speedy)
				{
					pongballs[i].speedy = pongballs[i].speedy*-1;
					pongballs[ii].speedy = pongballs[ii].speedy*-1;
				}
			}
		}
	}

	//collisions with barriers
	if (config[8])
	{
		for (var i = pongballs.length - 1; i >= 0; i--)
		{
			if (detectC(pongballs[i].x, pongballs[i].y, bl.x, bl.y, 15, 80))
			{
				pongballs[i].speedx = pongballs[i].speedx*-1;
			}
			if (detectC(pongballs[i].x, pongballs[i].y, br.x, br.y, 15, 80))
			{
				pongballs[i].speedx = pongballs[i].speedx*-1;
			}
		}
	}
}

repeat();
start();