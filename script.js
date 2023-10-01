console.log('js works');

//			------------------------                      ------------------------
//			 ----------------------- declareing variables -----------------------
//			------------------------                      ------------------------
																					
var firstrun = true;
var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
var canvasW = null;
var canvasH = null;
var body = document.getElementsByTagName('body')[0];
var margin = 0;
var settingsicon = document.getElementById('settingsicon');
var settingsmenu = document.getElementById('settingsmenu');
var darkmode = false;
var cookieMenu = document.getElementById('cookieMenu');
var cookiebtns =[document.getElementById('HScookie'), document.getElementById('SPcookie'), document.getElementById('Confirm_cookies')];
var cookieprm = [true, true];
var Rposition;
var Lposition;
var speed = 1;
var pongballs;
var rp = document.getElementById('right');
var lp = document.getElementById('left');
var scoreboard = document.getElementById('scoreboard');
var highscoreboard = document.getElementById('highscores');
var highscoreactivate;
var HSoverlay = document.getElementById('highscoreoverlay');
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
var centerbuttonSY;
var menuR = document.getElementById('menuR');
var menuL = document.getElementById('menuL');
var Rscoredisplay = document.getElementById('Rscoredisplay');
var Lscoredisplay = document.getElementById('Lscoredisplay');
var scoreDD = document.getElementsByClassName('scoredifferencedisplay');
var menusideC1 = document.getElementsByClassName('sidepanelC1');
var menusideC2 = document.getElementsByClassName('sidepanelC2');
var menusideSX;
var optionpresets = document.getElementsByClassName('optionpreset');
var config = [false,false,false,false,false,false,false,false,false,false,false,false];
var AIside = 'N';
var targetpongball;
var Rendgamecounter = document.getElementsByClassName('endgamecounters')[0];
var Lendgamecounter = document.getElementsByClassName('endgamecounters')[1];
var Lhit = 0;
var Rhit = 0;
var Lmiss = 0;
var Rmiss = 0;
var Lmp = 0;	//mp stands for 'Movement Penalty'
var Rmp = 0;	//mp stands for 'Movement Penalty'

//loading cookie preferences
if (getCookie('cookieConfig0') !== undefined) {
	cookieprm[0] = JSON.parse(getCookie('cookieConfig0'));
	cookieprm[1] = JSON.parse(getCookie('cookieConfig1'));
}

//setting attributes (look, I know this dosen't make sense but I have to set these first before I can read them for some reason)
settingsmenu.style.display = 'none';

if (getCookie('cookieConfig0') == undefined) {
	cookieMenu.style.display = 'initial';
}
else {
	cookieMenu.style.display = 'none';
}

menu.style.height = '0px';
menuL.style.width = '0px';
menuR.style.width = '0px';

menuO.style.height = (window.innerWidth*0.025)+'px';

for (var i = menubuttonsCL.length - 1; i >= 0; i--) {
	menubuttonsCL[i].style.top = '0px';
	menubuttonsCR[i].style.top = '0px';
}

for (var i = highscoreboard.children[1].children.length - 1; i >= 0; i--) {
	highscoreboard.children[1].children[i].style.opacity = 1;
	highscoreboard.children[2].children[i].style.opacity = 1;
}
HSoverlay.style.opacity = '0';

//			------------------------                    ------------------------
//			 ----------------------- declareing objects -----------------------
//			------------------------                    ------------------------

//pongball class initializor
function pongball(speedx, speedy)
{ 
	this.speedx = speedx;
	this.speedy = speedy;

	this.x = null;
	this.y = null;

	this.givescore = null;
}

pongballs = [new pongball(speed, speed)];
targetpongball = pongballs[0];                           //pongball targeted by the AI

//barriers
var bl = new pongball(null, null);
var br = new pongball(null, null);

//			------------------------                      ------------------------
//			 ----------------------- declareing functions -----------------------
//			------------------------                      ------------------------

//updateing the board of highscores <------------------------------------------------------------------------------------------------------------ WORK IN PROGRESS
function updatehighscore (side, scoretype, value) {
	if (value > parseInt(highscoreboard.children[side].children[scoretype].innerHTML)) {
		highscoreboard.children[side].children[scoretype].innerHTML = value.toFixed(0);
		if (cookieprm[0]) {
			if (side == 1) {
				document.cookie	= `${scoretype+10} = ${value}; max-age = ${1000*60*60*24*365}; sameSite = strict`;
			}
			else {
				document.cookie	= `${scoretype} = ${value}; max-age = ${1000*60*60*24*365}; sameSite = strict`;
			}
		}	
	}
}

//function to check if number is negative or not (outputs 1 or -1)
function NC (int)
{
	if (int < 0) {
		return(-1);
	}
	else {
		return(1);
	}
}

//function for collision detection
function detectC (x, y, cx, cy, cw, ch)
{
	if (((x >= cx) && (x <= (cx+cw))) && ((y >= cy) && (y <= (cy+ch)))) {
		return(true);
	}
	else if ((((x+pongballsize) >= cx) && ((x+pongballsize) <= (cx+cw))) && ((y >= cy) && (y <= (cy+ch)))) {
		return(true);
	}
	else if (((x >= cx) && (x <= (cx+cw))) && (((y+pongballsize) >= cy) && ((y+pongballsize) <= (cy+ch)))) {
		return(true);
	}
	else if ((((x+pongballsize) >= cx) && ((x+pongballsize) <= (cx+cw))) && (((y+pongballsize) >= cy) && ((y+pongballsize) <= (cy+ch)))) {
		return(true);
	}
	else {
		return(false);
	}
}

//function for getting cookie values given a name, written by chatgpt bc I am tired
function getCookie (cookieName) {
	const name = cookieName + "=";
	const decodedCookie = decodeURIComponent(document.cookie);
	const cookieArray = decodedCookie.split(';');

	for (let i = 0; i < cookieArray.length; i++) {
		let cookie = cookieArray[i];
		while (cookie.charAt(0) === ' ') {
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(name) === 0) {
			return cookie.substring(name.length, cookie.length);
		}
	}
}

//functions for animating the highscore-board when it updates
function HSflash1 () { //increasing opacity
	HSoverlay.style.opacity = (parseFloat(HSoverlay.style.opacity)+0.05)+'';
}
function HSflash2 () { //decreasing opacity
	HSoverlay.style.opacity = (parseFloat(HSoverlay.style.opacity)-0.05)+'';
}

//functions for showing the endgame-counters
function showEC1 () {
	Lendgamecounter.children[0].style.opacity = (parseFloat(Lendgamecounter.children[0].style.opacity)+0.05)+'';
	Rendgamecounter.children[0].style.opacity = (parseFloat(Rendgamecounter.children[0].style.opacity)+0.05)+'';
}
function showEC2 () {
	Lendgamecounter.children[1].style.opacity = (parseFloat(Lendgamecounter.children[1].style.opacity)+0.05)+'';
	Rendgamecounter.children[1].style.opacity = (parseFloat(Rendgamecounter.children[1].style.opacity)+0.05)+'';
}
function showEC3 () {
	Lendgamecounter.children[2].style.opacity = (parseFloat(Lendgamecounter.children[2].style.opacity)+0.05)+'';
	Rendgamecounter.children[2].style.opacity = (parseFloat(Rendgamecounter.children[2].style.opacity)+0.05)+'';
}

//			------------------------                                     ------------------------
//			 ----------------------- declareing event listener functions -----------------------
//			------------------------                                     ------------------------

//checking for WS/UH key presses (event listener)
function keyhit ()
{
	if (config[4]){
		if (event.key == 'w') {
			Lposition = Lposition-30;

			if (config[0]) {
			Lmp = Lmp+(((Lposition - ((Lposition-30)-(margin+1))-(pongpadsize/2))*NC(Lposition - ((Lposition-30)-(margin+1))-(pongpadsize/2)))/500);
			}
		}
		if (event.key == 's') {
			Lposition = Lposition+30;

			if (config[0]) {
			Lmp = Lmp+(((Lposition - ((Lposition+30)-(margin+1))-(pongpadsize/2))*NC(Lposition - ((Lposition+30)-(margin+1))-(pongpadsize/2)))/500);
			}
		}
		if (event.key == 'u') {
			Rposition = Rposition-30;

			if (config[0]) {
			Rmp = Rmp+(((Rposition - ((Rposition-30)-(margin+1))-(pongpadsize/2))*NC(Rposition - ((Rposition-30)-(margin+1))-(pongpadsize/2)))/500);
			}
		}
		if (event.key == 'h') {
			Rposition = Rposition+30;

			if (config[0]) {
			Rmp = Rmp+(((Rposition - ((Rposition+30)-(margin+1))-(pongpadsize/2))*NC(Rposition - ((Rposition+30)-(margin+1))-(pongpadsize/2)))/500);
			}
		}
	}
}
window.addEventListener('keypress', keyhit);

//center menu button event listener/setttings changer (menuCBpress means 'menu-center-button-press')
function menuCBpress ()
{
	for (var i = menubuttonsCL.length - 1; i >= 0; i--)
	{
		if (event.target == menubuttonsCL[0].children[1]) {
			speed = 1;
		}
		if (event.target == menubuttonsCL[1].children[1]) {
			speed = 3;
		}
		if (event.target == menubuttonsCL[2].children[1]) {
			speed = 5;
		}
		if (event.target == menubuttonsCL[3].children[1]) {
			speed = 10;
		}
	}
	for (var i = menubuttonsCR.length - 1; i >= 0; i--)
	{
		if (event.target == menubuttonsCR[0].children[1]) {
			pongballs = [new pongball(speed, speed)];
		}
		if (event.target == menubuttonsCR[1].children[1]) {
			pongballs = [new pongball(speed, speed), new pongball(speed, speed)];
		}
		if (event.target == menubuttonsCR[2].children[1]) {
			pongballs = [new pongball(speed, speed), new pongball(speed, speed), new pongball(speed, speed)];
		}
		if (event.target == menubuttonsCR[3].children[1]) {
			pongballs = [new pongball(speed, speed), new pongball(speed, speed), new pongball(speed, speed), new pongball(speed, speed)];
		}
	}
}
menucontent[1].addEventListener('mousedown', menuCBpress);

//menu side panel event listener
function menuSBpress()
{
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

//option/setting preset buttons
optionpresets[2].addEventListener('mousedown', function () 
{
	config = [false,false,false,false,false,false,false,false,false,false,false,false];
	pongballs = [new pongball(speed, speed)];
	speed = 1;
});

optionpresets[3].addEventListener('mousedown', function () 
{
	config = [false,false,false,false,false,false,true,true,false,true,true,true];
	pongballs = [new pongball(speed, speed)]
	;speed = 3;
});

optionpresets[0].addEventListener('mousedown', function () 
{
	config = [true,false,false,false,false,true,true,true,true,false,false,true];
	pongballs = [new pongball(speed, speed), new pongball(speed, speed), new pongball(speed, speed)];
	speed = 5;
});

optionpresets[1].addEventListener('mousedown', function () 
{
	config = [false,true,true,false,false,true,true,true,true,true,false,true];
	pongballs = [new pongball(speed, speed), new pongball(speed, speed), new pongball(speed, speed), new pongball(speed, speed)];
	speed = 10;
});


//menu open/close (menuO_F means menuOn/Off)
function MenuOpenEvent() {
	menuO_F = true;
}
function MenuCloseEvent() {
	menuO_F = false;
}
menuO.addEventListener('mouseover', MenuOpenEvent);
menuO.addEventListener('mouseout', MenuCloseEvent);

//function for hovering over the scoreboard (sets AIside to N)
function AIsidereset() {
	highscoreM();

	Lhit = 0;
	Lmiss = 0;
	Lmp = 0;
	Rhit = 0;
	Rmiss = 0;
	Rmp = 0;
	AIside = 'N';
}
scoreboard.addEventListener('mousedown', AIsidereset);

//left and right pad movement
function Lmove() {
	if (config[4] == false)
	{
		if (config[0]) {
			Lmp = Lmp+(((Lposition - (event.y-(margin+1))-(pongpadsize/2))*NC(Lposition - (event.y-(margin+1))-(pongpadsize/2)))/10000);
		}
		Lposition = (event.y-(margin+1))-(pongpadsize/2);
	}
	
	if (config[3] && (AIside !== 'R'))
	{
		Lhit = 0;
		Lmiss = 0;
		Lmp = 0;
		Rhit = 0;
		Rmiss = 0;
		Rmp = 0;
		AIside = 'R';
	}
}
function Rmove() {
	if (config[4] == false)
	{
		if (config[0]) {
			Rmp = Rmp+(((Rposition - (event.y-(margin+1))-(pongpadsize/2))*NC(Rposition - (event.y-(margin+1))-(pongpadsize/2)))/10000);
		}
		Rposition = (event.y-(margin+1))-(pongpadsize/2);
	}

	if (config[3] && (AIside !== 'L'))
	{
		Rhit = 0;
		Rmiss = 0;
		Rmp = 0;
		Lhit = 0;
		Lmiss = 0;
		Lmp = 0;
		AIside = 'L';
	}
}
lp.addEventListener('mousemove', Lmove);
rp.addEventListener('mousemove', Rmove);

//switching between light and dark mode
function modeToggle () {
	if (darkmode) {
		settingsmenu.children[0].innerHTML = 'Background colour: Light mode';
		darkmode = false;
		if (cookieprm[1]) {
			document.cookie = `darkmode = false; sameSite = strict; max-age = ${1000*60*60*24*365}`;
		}
	}
	else {
		settingsmenu.children[0].innerHTML = 'Background colour: Dark mode';
		darkmode = true;
		if (cookieprm[1]) {
			document.cookie = `darkmode = true; sameSite = strict; max-age = ${1000*60*60*24*365}`;
		}
	}
}
settingsmenu.children[0].addEventListener('click', modeToggle);

//opening cookie menu
function cookieMenuToggle () {
	if (cookieMenu.style.display == 'none') {
		cookieMenu.style.display = 'initial';
	}
	else {
		cookieMenu.style.display = 'none';
		document.cookie = `cookieConfig0 = ${cookieprm[0]}; max-age = ${1000*60*60*24*365}; sameSite = strict`;
		document.cookie = `cookieConfig1 = ${cookieprm[1]}; max-age = ${1000*60*60*24*365}; sameSite = strict`;
	}
}
settingsmenu.children[1].addEventListener('click', cookieMenuToggle);
cookiebtns[2].addEventListener('click', cookieMenuToggle);

//changing cookie permissions
cookiebtns[0].addEventListener('click', function () {cookieprm[0] = !cookieprm[0];});
cookiebtns[1].addEventListener('click', function () {cookieprm[1] = !cookieprm[1];});

//opening and closing menu
function settingsToggle () {
	if (settingsmenu.style.display == 'none') {
		settingsmenu.style.display = 'initial';
	}
	else {
		settingsmenu.style.display = 'none';
	}
}
settingsicon.addEventListener('click', settingsToggle);
settingsmenu.children[1].addEventListener('click', settingsToggle);

//			------------------------                                ------------------------
//			 ----------------------- declareing important functions -----------------------
//			------------------------                                ------------------------


//starting function (sets all the important values) (the name of the function is reset but it also starts the game)
function reset()
{
	//debug announcement
	if (firstrun === true) {
		console.log('start called');
	}

	//adjusting for settings
	if (config[2]) {
		pongpadsize = 120;
	}
	else {
		pongpadsize = 60;
	}
	if (config[1]) {
		pongballsize = 40;
	}
	else {
		pongballsize = 20;
	}

	//resetting score
	Lhit = 0;
	Rhit = 0;
	Lmiss = 0;
	Rmiss = 0;
	Lmp = 0;
	Rmp = 0;

	//resetting AIside
	AIside = 'N';

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

	bl.x = (canvasW/3)-8;
	br.x = ((canvasW/3)*2)-8;

	//positioning pongballs
	if (pongballs.length == 1)
	{
		pongballs[0].x = (canvasW/2)-(pongballsize/2);
		pongballs[0].y = (canvasH/2)-(pongballsize/2);
	}
	if (pongballs.length == 2) {
		pongballs[0].x = (canvasW/3)-(pongballsize/2);
		pongballs[0].y = (canvasH/2)-(pongballsize/2);

		pongballs[1].x = ((canvasW/3)*2)-(pongballsize/2);
		pongballs[1].y = (canvasH/2)-(pongballsize/2);
	}
	if (pongballs.length == 3)
	{
		pongballs[0].x = (canvasW/4)-(pongballsize/2);
		pongballs[0].y = (canvasH/2)-(pongballsize/2);

		pongballs[1].x = ((canvasW/4)*2)-(pongballsize/2);
		pongballs[1].y = (canvasH/2)-(pongballsize/2);

		pongballs[2].x = ((canvasW/4)*3)-(pongballsize/2);
		pongballs[2].y = (canvasH/2)-(pongballsize/2);

	}
	if (pongballs.length > 3)
	{
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

//menu operating function
function Menu_Update ()
{
	//opening and closing the menu
	for (var i = 0; i < 5; i++)
	{
		//opening and closing the center menu panel
		if ((menuO_F === true) && (parseInt(menu.style.height) <= (canvasH+20).toFixed(0)))	//if menuO_F is true, and the menu isn't open
		{
			menu.style.height = (parseInt(menu.style.height)+1)+'px';
	
			if (parseInt(menu.style.height) >= (canvasH+20-98))
			{
				menuopacity = menuopacity+1;
			}
		}
		else if	((menuO_F === false) && (parseInt(menu.style.height) > 0))					//if menuO_F is false, and the menu is open
		{
			menu.style.height = (parseInt(menu.style.height)-1)+'px';
	
			if (parseInt(menu.style.height) >= (canvasH+20-99))
			{
				menuopacity = menuopacity-1;
			}

			//resetting the canvas
			if (parseInt(menu.style.height) > canvasH/3) {
				reset();
			}
		}
	
		//openining and closeing the side menu panels
		if ((parseInt(menu.style.height)-20) >= 0)                            //the if statement is to stop a bunch of annoying warnings
		{
			menuR.style.height = (parseInt(menu.style.height)-20)+'px';
			menuL.style.height = (parseInt(menu.style.height)-20)+'px';
		}
	
		if ((menuO_F === true) && (parseInt(menuR.style.width) <= ((canvasW-(window.innerWidth/10)+40)/2).toFixed(0)))//if menuO_F is true, and the side menu isn't open
		{
			menuR.style.width = (parseInt(menuR.style.width)+1)+'px';
			menuL.style.width = (parseInt(menuR.style.width)+1)+'px';
		}
		else if ((menuO_F === false) && (parseInt(menuR.style.height) > 0))											  //if menuO_F is false, and the side menu is open
		{
			menuR.style.width = (parseInt(menuR.style.width)-1)+'px';
			menuL.style.width = (parseInt(menuR.style.width)-1)+'px';
		}
	
		//hideing and showing menu content
		if (parseInt(menu.style.height) >= (canvasH+20).toFixed(0)) { //ensuring that if the menu is open, the opacity is 100%
			menuopacity = 100;
		}
		if (parseInt(menu.style.height) == 0) {                       //ensuring that if the menu is closed, the opacity is 0%
			menuopacity = 0;
		}

		//updateing menu opacity
		for (var ii = menucontent.length - 1; ii >= 0; ii--) {
			menucontent[ii].style.opacity = menuopacity/100;
		}

		//setting the height of menucontent[1]
		if (parseInt(menu.style.height) > canvasH) {
			menucontent[1].style.height = canvasH+'px';
		}
		else {
			menucontent[1].style.height = menu.style.height;
		}

		//setting the height of the side menu buttons
		for (var ii = 0; ii < 6; ii++)
		{
			menusideC1[ii].style.height = (parseInt(menucontent[1].style.height)*0.2)+'px';
			menusideC2[ii].style.height = (parseInt(menucontent[1].style.height)*0.2)+'px';
		}

		//positioning center menu buttons
		centerbuttonSY = (parseInt(menucontent[1].style.height)*0.2)/4;

		for (var ii = 0; ii < 4; ii++)
		{
			menubuttonsCL[ii].style.top = ((((parseInt(menucontent[1].style.height)*0.2)+(centerbuttonSY))*ii)+(centerbuttonSY)/2)+'px';
			menubuttonsCR[ii].style.top = ((((parseInt(menucontent[1].style.height)*0.2)+(centerbuttonSY))*ii)+(centerbuttonSY)/2)+'px';
		}

		//positioning the side menu buttons
		menusideSX = parseInt(menuL.style.width)/40;

		for (var ii = 0; ii < 3; ii++)
		{
			//arrangeing buttons in menuR
			menusideC1[ii].style.left = ((((parseInt(menuL.style.width)*0.3)+menusideSX)*ii)+menusideSX)+'px';
			menusideC2[ii].style.left = ((((parseInt(menuL.style.width)*0.3)+menusideSX)*ii)+menusideSX)+'px';

			//arrangeing buttons in menuL
			menusideC1[ii+3].style.left = ((((parseInt(menuL.style.width)*0.3)+menusideSX)*ii)+menusideSX)+'px';
			menusideC2[ii+3].style.left = ((((parseInt(menuL.style.width)*0.3)+menusideSX)*ii)+menusideSX)+'px';
		}

		//positioning side menu buttons vertically
		for (var ii = 0; ii < 6; ii++)
		{
			menusideC1[ii].style.bottom = centerbuttonSY/2 + 'px';
			menusideC2[ii].style.bottom = (parseInt(menucontent[1].style.height)*0.2+centerbuttonSY) + 'px';
		}

		//positioning the icons on the menu side buttons
		for (var ii = 0; ii < 6; ii++)
		{
			menusideC1[ii].children[0].style.left = (((parseInt(menuL.style.width)*0.3)-parseInt(menusideC1[ii].style.height))/2)+'px';
			menusideC2[ii].children[0].style.left = (((parseInt(menuL.style.width)*0.3)-parseInt(menusideC2[ii].style.height))/2)+'px';
		}

		//positioning option preset buttons vertically
		for (var ii = optionpresets.length - 1; ii >= 0; ii--) {
			optionpresets[ii].style.bottom = (parseInt(menucontent[1].style.height)*0.4+(centerbuttonSY*1.5))+'px';
		}

		//positioning option preset buttons horizontally
		optionpresets[0].style.left = menusideSX+'px';
		optionpresets[2].style.left = menusideSX+'px';

		//positioning option preset buttons horizontally
		optionpresets[1].style.right = menusideSX+'px';
		optionpresets[3].style.right = menusideSX+'px';

		//setting the height and border-radius of the option preset buttons
		for (var ii = optionpresets.length - 1; ii >= 0; ii--) {
			optionpresets[ii].style.height = centerbuttonSY+'px';
			optionpresets[ii].style.borderRadius = (centerbuttonSY/2)+'px';

			//setting the border-radius of the overlay
			optionpresets[ii].children[0].style.borderRadius = (centerbuttonSY/2)+'px';
		}

		//positioning the setting preset icons
		for (var ii = optionpresets.length - 1; ii >= 0; ii--) {
			optionpresets[ii].children[1].style.height = centerbuttonSY+'px';
		}
	}

	//sidepanel buttons On/Off
	for (var i = config.length - 1; i >= 0; i--)
	{
		if (config[i] == true)
		{
			if (i < 6) {
				menusideC1[i].style.borderRadius = '12px';
			}
			else {
				menusideC2[i-6].style.borderRadius = '12px';
			}
		}
		if (config[i] == false)
		{
			if (i < 6) {
				menusideC1[i].style.borderRadius = '0px';
			}
			else {
				menusideC2[i-6].style.borderRadius = '0px';
			}
		}
	}

	//resizing endgame-counters
	for (var i = Rendgamecounter.children.length - 1; i >= 0; i--) {
		Rendgamecounter.children[i].style.width = '33%';
		Lendgamecounter.children[i].style.width = '33%';
	}

	//positioning endgame-counters
	Rendgamecounter.children[0].style.left = '0.5%';
	Rendgamecounter.children[2].style.left = '33.5%';
	Rendgamecounter.children[1].style.left = '66.5%';

	Lendgamecounter.children[0].style.left = '0.5%';
	Lendgamecounter.children[2].style.left = '33.5%';
	Lendgamecounter.children[1].style.left = '66.5%';

	//hiding movement-cost endgame-counters
	if (!config[0]) {
		Rendgamecounter.children[2].style.opacity = 0;
		Lendgamecounter.children[2].style.opacity = 0;
	}

	//updateing endgame-counters
	Rendgamecounter.children[0].innerHTML = 'Hits: '+Rhit;
	Rendgamecounter.children[1].innerHTML = 'Misses: '+Rmiss;
	Rendgamecounter.children[2].innerHTML = 'Movement Cost: '+Rmp.toFixed(1);

	Lendgamecounter.children[0].innerHTML = 'Hits: '+Lhit;
	Lendgamecounter.children[1].innerHTML = 'Misses: '+Lmiss;
	Lendgamecounter.children[2].innerHTML = 'Movement Cost: '+Lmp.toFixed(1);

	//updateing menu settings display
	menudisplay.children[1].innerHTML = 'Pongballs: '+pongballs.length;

	if (speed == 1) {
		menudisplay.children[0].innerHTML = 'Speed: Slow';
	}
	if (speed == 3) {
		menudisplay.children[0].innerHTML = 'Speed: Normal';
	}
	if (speed == 5) {
		menudisplay.children[0].innerHTML = 'Speed: Fast';
	}
	if (speed == 10) {
		menudisplay.children[0].innerHTML = 'Speed: Expert';
	}

	//updateing playertags for win/lose
	if (((Lhit*!config[10])+Rmiss+Rmp) > ((Rhit*!config[10])+Lmiss+Lmp))
	{
		playertags[1].style.background = 'linear-gradient(to left top, #b37f23, #c89c3d, #d8af75)';
		playertags[0].style.background = 'linear-gradient(to right top, #6c798a, #9fa7b4, #e2e4e7)';
	}
	else if (((Lhit*!config[10])+Rmiss+Rmp) < ((Rhit*!config[10])+Lmiss+Lmp))
	{
		playertags[1].style.background = 'linear-gradient(to left top, #6c798a, #9fa7b4, #e2e4e7)';
		playertags[0].style.background = 'linear-gradient(to right top, #b37f23, #c89c3d, #d8af75)';
	}
	else
	{
		playertags[1].style.background = 'linear-gradient(to left top, #b37f23, #c89c3d, #d8af75)';
		playertags[0].style.background = 'linear-gradient(to right top, #b37f23, #c89c3d, #d8af75)';
	}

	//updateing score difference displays
	if (((Rmp+Rmiss+(Lhit*!config[10]))-(Lmp+Lmiss+(Rhit*!config[10]))) >= 0) {
		scoreDD[1].innerHTML = '+'+((Rmp+Rmiss+(Lhit*!config[10]))-(Lmp+Lmiss+(Rhit*!config[10]))).toFixed(1*config[0]);
		scoreDD[1].style.color = '#c89c3d';
	}
	else {
		scoreDD[1].innerHTML = ((Rmp+Rmiss+(Lhit*!config[10]))-(Lmp+Lmiss+(Rhit*!config[10]))).toFixed(1*config[0]);
		scoreDD[1].style.color = '#9fa7b4';
	}

	if ((Lmp+Lmiss+(Rhit*!config[10]))-(Rmp+Rmiss+(Lhit*!config[10])) >= 0) {
		scoreDD[0].innerHTML = '+'+((Lmp+Lmiss+(Rhit*!config[10]))-(Rmp+Rmiss+(Lhit*!config[10]))).toFixed(1*config[0]);
		scoreDD[0].style.color = '#c89c3d';
	}
	else {
		scoreDD[0].innerHTML = ((Lmp+Lmiss+(Rhit*!config[10]))-(Rmp+Rmiss+(Lhit*!config[10]))).toFixed(1*config[0]);
		scoreDD[0].style.color = '#9fa7b4';
	}

	//updateing player score displays
	Lscoredisplay.innerHTML = (Rmp+Rmiss+(Lhit*!config[10])).toFixed(1*config[0]);
	Rscoredisplay.innerHTML = (Lmp+Lmiss+(Rhit*!config[10])).toFixed(1*config[0]);

	//positioning the player score displays
	if (window.innerWidth < 650) {
		Lscoredisplay.style.top = ((parseInt(menuL.style.height)/100)*8)+'px';
		Rscoredisplay.style.top = ((parseInt(menuL.style.height)/100)*8)+'px';
	}
	else {
		Lscoredisplay.style.top = (((parseInt(menuL.style.height)/100)*8)+parseInt(playertags[0].style.height))+'px';
		Rscoredisplay.style.top = (((parseInt(menuL.style.height)/100)*8)+parseInt(playertags[0].style.height))+'px';
	}

	//showing and hiding the endgame-counters counters
	if (menuO_F == false)
	{
		for (var i = Rendgamecounter.children.length - 1; i >= 0; i--) {
			Rendgamecounter.children[i].style.opacity = '0';
			Lendgamecounter.children[i].style.opacity = '0';
		}
	}
	else if ((parseInt(menu.style.height) >= canvasH) && highscoreactivate) //yes i am using the variable for the highscore animation, and you can't do anything about it
	{
		let id;

		id = setInterval(showEC1, 10);
		setTimeout(function () {clearInterval(id);id = setInterval(showEC2, 10);}, 320);
		setTimeout(function () {clearInterval(id);id = setInterval(showEC3, 10);}, 640);
		setTimeout(function () {clearInterval(id);}, 960);
	}

	//updateing highscores
	if ((parseInt(menu.style.height) >= canvasH) && highscoreactivate) {
		highscoreM();
	}
	if (parseInt(menu.style.height) < canvasH) {
		highscoreactivate = true;
	}
}

//managing highscores
function highscoreM ()
{
	//highscoreboard flashes
	let id;

	id = setInterval(HSflash1, 25);
	setTimeout(function () {clearInterval(id);id = setInterval(HSflash2, 50);setTimeout(function () {clearInterval(id);}, 800);}, 400);

	if (!config[3] || (AIside == 'R'))
	{
		updatehighscore(1, 2, Lhit);
		if (!config[10]) {
			updatehighscore(1, 1, (Lhit+Rmiss+Rmp)-(Rhit+Lmiss+Lmp));
			updatehighscore(1, 0, (Lhit+Rmp+Rmiss));
		}
		else {
			updatehighscore(1, 1, ((Rmiss+Rmp) - (Lmiss+Lmp)));
			updatehighscore(1, 0, Rmiss+Rmp);
		}
	}
	if (!config[3] || (AIside == 'L'))
	{
		updatehighscore(2, 2, Rhit);
		if (!config[10]) {
			updatehighscore(2, 1, (Rhit+Lmiss+Lmp)-(Lhit+Rmiss+Rmp));
			updatehighscore(2, 0, (Rhit+Lmp+Lmiss));
		}
		else {
			updatehighscore(2, 1, (Lmiss+Lmp) - (Rmiss+Rmp));
			updatehighscore(2, 0, Lmiss+Lmp);
		}
	}

	highscoreactivate = false;
}

//resizeing text
function ResizeText ()
{
	if (window.innerWidth > 1400)
	{
		//resizeing counters
		rp.children[0].style.fontSize = '11px';
		rp.children[1].style.fontSize = '11px';

		lp.children[0].style.fontSize = '11px';
		lp.children[1].style.fontSize = '11px';

		//resizing menu display
		menudisplay.children[0].style.fontSize = '9px';
		menudisplay.children[1].style.fontSize = '9px';

		//resizing menu score difference display
		scoreDD[0].style.fontSize = '9px';
		scoreDD[1].style.fontSize = '9px';

		//resizing endgame-counters
		for (var i = Rendgamecounter.children.length - 1; i >= 0; i--) {
			Rendgamecounter.children[i].style.fontSize = '8px';
			Lendgamecounter.children[i].style.fontSize = '8px';
		}
	}
	else if (window.innerWidth > 1300)
	{
		//resizeing counters
		rp.children[0].style.fontSize = '11px';
		rp.children[1].style.fontSize = '11px';

		lp.children[0].style.fontSize = '11px';
		lp.children[1].style.fontSize = '11px';

		//resizing menu display
		menudisplay.children[0].style.fontSize = '8px';
		menudisplay.children[1].style.fontSize = '8px';

		//resizing menu score difference display
		scoreDD[0].style.fontSize = '8px';
		scoreDD[1].style.fontSize = '8px';

		//resizing endgame-counters
		for (var i = Rendgamecounter.children.length - 1; i >= 0; i--) {
			Rendgamecounter.children[i].style.fontSize = '8px';
			Lendgamecounter.children[i].style.fontSize = '8px';
		}
	}
	else if (window.innerWidth > 1200)
	{
		//resizeing counters
		rp.children[0].style.fontSize = '10px';
		rp.children[1].style.fontSize = '10px';

		lp.children[0].style.fontSize = '10px';
		lp.children[1].style.fontSize = '10px';

		//resizing menu display
		menudisplay.children[0].style.fontSize = '8px';
		menudisplay.children[1].style.fontSize = '8px';

		//resizing menu score difference display
		scoreDD[0].style.fontSize = '8px';
		scoreDD[1].style.fontSize = '8px';

		//resizing endgame-counters
		for (var i = Rendgamecounter.children.length - 1; i >= 0; i--) {
			Rendgamecounter.children[i].style.fontSize = '6px';
			Lendgamecounter.children[i].style.fontSize = '6px';
		}
	}
	else if (window.innerWidth > 1100)
	{
		//resizeing counters
		rp.children[0].style.fontSize = '9px';
		rp.children[1].style.fontSize = '9px';

		lp.children[0].style.fontSize = '9px';
		lp.children[1].style.fontSize = '9px';

		//resizing menu display
		menudisplay.children[0].style.fontSize = '8px';
		menudisplay.children[1].style.fontSize = '8px';

		//resizing menu score difference display
		scoreDD[0].style.fontSize = '8px';
		scoreDD[1].style.fontSize = '8px';

		//resizing endgame-counters
		for (var i = Rendgamecounter.children.length - 1; i >= 0; i--) {
			Rendgamecounter.children[i].style.fontSize = '6px';
			Lendgamecounter.children[i].style.fontSize = '6px';
		}
	}
	else if (window.innerWidth > 1000)
	{
		//resizing counters
		rp.children[0].style.fontSize = '8px';
		rp.children[1].style.fontSize = '8px';

		lp.children[0].style.fontSize = '8px';
		lp.children[1].style.fontSize = '8px';

		//resizing menu display
		menudisplay.children[0].style.fontSize = '0px';
		menudisplay.children[1].style.fontSize = '0px';

		//resizing menu score difference display
		scoreDD[0].style.fontSize = '0px';
		scoreDD[1].style.fontSize = '0px';

		//resizing endgame-counters
		for (var i = Rendgamecounter.children.length - 1; i >= 0; i--) {
			Rendgamecounter.children[i].style.fontSize = '6px';
			Lendgamecounter.children[i].style.fontSize = '6px';
		}
	}
	else
	{
		//resizing counters
		rp.children[0].style.fontSize = '0px';
		rp.children[1].style.fontSize = '0px';

		lp.children[0].style.fontSize = '0px';
		lp.children[1].style.fontSize = '0px';

		//resizing menu display
		menudisplay.children[0].style.fontSize = '0px';
		menudisplay.children[1].style.fontSize = '0px';

		//resizing menu score difference display
		scoreDD[0].style.fontSize = '0px';
		scoreDD[1].style.fontSize = '0px';

		//resizing endgame-counters
		for (var i = Rendgamecounter.children.length - 1; i >= 0; i--) {
			Rendgamecounter.children[i].style.fontSize = '0px';
			Lendgamecounter.children[i].style.fontSize = '0px';
		}
	}

	//hiding/showing playertags
	if (window.innerWidth < 650)
	{
		playertags[0].style.opacity = 0;
		playertags[1].style.opacity = 0;
	}
	else
	{
		playertags[0].style.opacity = 1;
		playertags[1].style.opacity = 1;
	}

	//in case of especially large screen
	if (window.innerWidth > 1800)
	{
		//resizeing counters
		rp.children[0].style.fontSize = '12px';
		rp.children[1].style.fontSize = '12px';

		lp.children[0].style.fontSize = '12px';
		lp.children[1].style.fontSize = '12px';

		//resizing menu display
		menudisplay.children[0].style.fontSize = '11px';
		menudisplay.children[1].style.fontSize = '11px';

		//resizing menu score difference display
		scoreDD[0].style.fontSize = '12px';
		scoreDD[1].style.fontSize = '12px';

		//resizing endgame-counters
		for (var i = Rendgamecounter.children.length - 1; i >= 0; i--) {
			Rendgamecounter.children[i].style.fontSize = '10px';
			Lendgamecounter.children[i].style.fontSize = '10px';
		}
	}

	//hiding/showing highscores and resizing side menu icons
	if (window.innerWidth < 800)
	{
		highscoreboard.style.opacity = 0;

		for (var i = menusideC1.length - 1; i >= 0; i--) {
			menusideC1[i].children[0].style.height = (parseInt(menusideC1[i].style.height)*0.9)+'px';
			menusideC2[i].children[0].style.height = (parseInt(menusideC2[i].style.height)*0.9)+'px';

			menusideC1[i].children[0].style.top = (parseInt(menusideC1[i].style.height)*0.05)+'px';
			menusideC2[i].children[0].style.top = (parseInt(menusideC1[i].style.height)*0.05)+'px';
		}
	}
	else
	{
		highscoreboard.style.opacity = 1;

		for (var i = menusideC1.length - 1; i >= 0; i--) {
			menusideC1[i].children[0].style.height = parseInt(menusideC1[i].style.height)+'px';
			menusideC2[i].children[0].style.height = parseInt(menusideC2[i].style.height)+'px';

			menusideC1[i].children[0].style.top = '0px';
			menusideC2[i].children[0].style.top = '0px';
		}
	}

	//resizing playertags
	if (window.innerWidth < 1365) {
		playertags[0].style.height = '36px';
		playertags[1].style.height = '36px';
	}
	else {
		playertags[0].style.height = '18px';
		playertags[1].style.height = '18px';
	}
}

//drawing on the canvas
function DrawFrame ()
{
	//barrier related code
	if (config[8])
	{
		//positioning barriers
		bl.x = (canvasW/3)-8;
		br.x = ((canvasW/3)*2)-8;

		//drawing barriers
		c.fillRect(bl.x, bl.y, 16, 80);
		c.fillRect(br.x, br.y, 16, 80);
	
		//moving barriers
		bl.y = bl.y + bl.speedy;
		br.y = br.y + br.speedy;
	
		//barrier collisions with borders
		if ((bl.y+80) >= canvasH) {
			bl.speedy = speed*-1;
		}
		if (bl.y <= 0) {
			bl.speedy = speed;
		}
	
		if ((br.y+80) >= canvasH) {
			br.speedy = speed*-1;
		}
		if (br.y <= 0) {
			br.speedy = speed;
		}
	}

	//drawing the centerline
	for (var i = 0; i < (canvasH-(canvasH%20))/20; i++) {
		c.fillRect((canvasW/2)-5, (20*i)+((10+(canvasH%20))/2), 10, 10);
	}

	//pongball related code
	for (var i = pongballs.length - 1; i >= 0; i--)
	{
		//drawing pongpads
		c.fillRect(15, Lposition, 5, pongpadsize);
		c.fillRect(canvasW-20, Rposition, 5, pongpadsize);

		//drawing pongballs (for some reason beyond my understanding, the canvas clears itself)
		c.fillRect(pongballs[i].x, pongballs[i].y, pongballsize, pongballsize);

		//moveing pongballs
		pongballs[i].x = pongballs[i].x + pongballs[i].speedx;
		pongballs[i].y = pongballs[i].y + pongballs[i].speedy;

		//collisions with on the Y axis
		if (pongballs[i].y <= 0)
		{
			if (config[7] == false) {
				pongballs[i].speedy = speed

			}
			else {
				pongballs[i].speedy = pongballs[i].speedy*-1;
			}
		}
		if ((pongballs[i].y + pongballsize) >= canvasH)
		{
			if (config[7] == false) {
				pongballs[i].speedy = speed*-1;
			}
			else {
				pongballs[i].speedy = pongballs[i].speedy*-1;
			}
		}

		//collisions with on the X axis
		if (!config[9])
		{
			if (pongballs[i].x <= 0)
			{
				pongballs[i].speedx = speed;
	
				if (menuO_F == false) {
					Lmiss = Lmiss+1;
				}
			}
			if ((pongballs[i].x + pongballsize) >= canvasW)
			{
				pongballs[i].speedx = speed*-1;
	
				if (menuO_F == false) {
					Rmiss = Rmiss+1;
				}
			}
		}
		else
		{
			if (pongballs[i].x+pongballsize <= 0)
			{
				pongballs[i].x = (canvasW+pongpadsize)/2;
				pongballs[i].y = Lposition+(pongpadsize/2)-(pongballsize/2);
	
				if (menuO_F == false) {
					Lmiss = Lmiss+1;
				}
			}
			if (pongballs[i].x >= canvasW)
			{
				pongballs[i].x = (canvasW+pongpadsize)/2;
				pongballs[i].y = Rposition+(pongpadsize/2)-(pongballsize/2);
	
				if (menuO_F == false) {
					Rmiss = Rmiss+1;
				}
			}
		}

		//setting the givescore proprety
		if ((pongballs[i].x+pongballsize < canvasW-20) && (pongballs[i].x > 20)) {
			pongballs[i].givescore = true;
		}

		//collisions with pongpads
		if (config[6] == false)
		{
			//standard collisions
			if ((pongballs[i].x <= 20) && (((pongballs[i].y+pongballsize) >= Lposition) && (pongballs[i].y <= (Lposition+pongpadsize))))
			{
				pongballs[i].speedx = speed;

				if ((menuO_F == false) && (pongballs[i].givescore == true)) {
					Lhit = Lhit+1;
					pongballs[i].givescore = false;
				}
			}
			if (((pongballs[i].x+pongballsize) >= (canvasW-20)) && (((pongballs[i].y+pongballsize) >= Rposition) && (pongballs[i].y <= (Rposition+pongpadsize))))
			{
				pongballs[i].speedx = speed*-1;

				if ((menuO_F == false) && (pongballs[i].givescore == true)) {
					Rhit = Rhit+1;
					pongballs[i].givescore = false;
				}
			}
		}
		else
		{
			//classic collisions
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

				if ((menuO_F == false) && (pongballs[i].givescore == true)) {
					Lhit = Lhit+1;
					pongballs[i].givescore = false;
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

				if ((menuO_F == false) && (pongballs[i].givescore == true)) {
					Rhit = Rhit+1;
					pongballs[i].givescore = false;
				}
			}
		}

		//collisions with barriers
		if (detectC(pongballs[i].x, pongballs[i].y, bl.x, bl.y, 16, 80) && config[8])
		{
			//changing pongball speedx
			pongballs[i].speedx = pongballs[i].speedx*-1;

			//changing pongball speedy
			if (((pongballs[i].y+pongballsize) > bl.y) || (pongballs[i].y < (bl.y+80)))
			{
				pongballs[i].speedy = (pongballs[i].speedy+NC(pongballs[i].speedy))*-1;
			}
		}
		if (detectC(pongballs[i].x, pongballs[i].y, br.x, br.y, 16, 80) && config[8])
		{
			//changing pongball speedx
			pongballs[i].speedx = pongballs[i].speedx*-1;

			//changing pongball speedy
			if (((pongballs[i].y+pongballsize) > br.y) || (pongballs[i].y < (br.y+80)))
			{
				pongballs[i].speedy = (pongballs[i].speedy+NC(pongballs[i].speedy))*-1;
			}
		}

		//collisions with pongballs
		for (var ii = pongballs.length - 1; ii >= 0; ii--)
		{
			if (detectC(pongballs[i].x, pongballs[i].y, pongballs[ii].x, pongballs[ii].y, pongballsize, pongballsize) && (pongballs[ii] !== pongballs[i]))
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
}

//			------------------------                ------------------------
//			 ----------------------- Main Function  -----------------------
//			------------------------                ------------------------

function Main ()
{
	if (firstrun === true) {
		//debug announcement
		console.log('Main called');

		//setting darkmode by cookies
		if (cookieprm[1]) {
			darkmode = getCookie('darkmode');
		}

		//loading highscores
		updatehighscore (1, 0, parseInt(getCookie('10')));
		updatehighscore (1, 1, parseInt(getCookie('11')));
		updatehighscore (1, 2, parseInt(getCookie('12')));
		updatehighscore (2, 0, parseInt(getCookie('0')));
		updatehighscore (2, 1, parseInt(getCookie('1')));
		updatehighscore (2, 2, parseInt(getCookie('2')));
	}

	requestAnimationFrame(Main);

	//cookie consent
	if (!cookieprm[1]) {
		document.cookie = 'darkmode = false; max-age = 0; sameSite = strict';
	}
	if (!cookieprm[0]) {
		document.cookie = '12 = false; max-age = 0; sameSite = strict';
		document.cookie = '11 = false; max-age = 0; sameSite = strict';
		document.cookie = '10 = false; max-age = 0; sameSite = strict';
		document.cookie = '2 = false; max-age = 0; sameSite = strict';
		document.cookie = '1 = false; max-age = 0; sameSite = strict';
		document.cookie = '0 = false; max-age = 0; sameSite = strict';
	}

	//resizeing canvas to ajust to window
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

	//positioning and resizeing menu
	menuO.style.top = `${margin+canvasH}px`;              //wow look at me im useing template literals im so cool
	menuO.style.height = (window.innerWidth*0.025)+'px';

	menu.style.bottom = (window.innerWidth*0.025)+'px';

	//relocateing highscores
	highscoreboard.style.top = (margin+canvasH+(window.innerWidth*0.025)+20)+'px';

	//updateing scoreboard
	if ((((Lmiss+Lmp+(Rhit*!config[10]))+(Rmiss+Rmp+(Lhit*!config[10])))%1) == 0)
	{
		scoreboard.children[0].innerHTML = Lmiss+Lmp+(Rhit*!config[10]);
		scoreboard.children[1].innerHTML = Rmiss+Rmp+(Lhit*!config[10]);
	}
	else
	{
		scoreboard.children[0].innerHTML = (Lmiss+Lmp+(Rhit*!config[10])).toFixed(1);
		scoreboard.children[1].innerHTML = (Rmiss+Rmp+(Lhit*!config[10])).toFixed(1);
	}

	//showing and hiding scoreboard and counters
	if (config[11]) {
		scoreboard.style.opacity = 1;
	}
	else {
		scoreboard.style.opacity = 0;
	}

	if (config[5]) {
		rp.style.opacity = 1;
		lp.style.opacity = 1;
	}
	else {
		rp.style.opacity = 0;
		lp.style.opacity = 0;
	}

	//updateing counters
	lp.children[0].innerHTML = 'Hits: ' + Lhit.toFixed(1);
	lp.children[1].innerHTML = 'Misses: ' + (Lmiss+Lmp).toFixed(1);

	rp.children[1].innerHTML = 'Hits: ' + Rhit.toFixed(1);
	rp.children[0].innerHTML = 'Misses: ' + (Rmiss+Rmp).toFixed(1);

	//ensuring that the highscore overlay's opaacity is between 0 and 0.6
	if (parseFloat(HSoverlay.style.opacity) > 0.6) {
		HSoverlay.style.opacity = 0.6;
	}
	if (parseFloat(HSoverlay.style.opacity) < 0) {
		HSoverlay.style.opacity = 0;
	}

	//AI emulated inputs
	if (config[3])
	{
		if (AIside !== 'L')
		{
			//AI plays as right
			for (var i = pongballs.length - 1; i >= 0; i--) {
				if (pongballs[i].x > targetpongball.x) {
					targetpongball = pongballs[i];
				}
			}

			Rposition = Rposition+((((Rposition+(pongpadsize/2))-(targetpongball.y+(pongballsize/2)))*-1)/10);

			//movement penalty for AI (this is a mess)
			if (config[0] && !menuO_F) {
				Rmp =
				Rmp+((((((Rposition+(pongpadsize/2))-(targetpongball.y+(pongballsize/2)))*-1)/10)
				*NC(((((Rposition+(pongpadsize/2))-(targetpongball.y+(pongballsize/2)))*-1)/10)))/1000);
			}
		}
		if (AIside !== 'R')
		{
			//AI plays as left
			for (var i = pongballs.length - 1; i >= 0; i--) {
				if (pongballs[i].x < targetpongball.x) {
					targetpongball = pongballs[i];
				}
			}

			Lposition = Lposition+((((Lposition+(pongpadsize/2))-(targetpongball.y+(pongballsize/2)))*-1)/10);

			//movement penalty for AI (this is a mess)
			if (config[0] && !menuO_F) {
				Lmp =
				Lmp+((((((Lposition+(pongpadsize/2))-(targetpongball.y+(pongballsize/2)))*-1)/10)
				*NC(((((Lposition+(pongpadsize/2))-(targetpongball.y+(pongballsize/2)))*-1)/10)))/1000);
			}
		}
	}

	//dark mode
	if (darkmode) {
		body.style.backgroundColor = '#302c24';
		canvas.style.borderColor = '#EEE';
		canvas.style.backgroundColor = '#302c24';
	}
	else {
		body.style.backgroundColor = 'white';
		canvas.style.borderColor = 'black';
		canvas.style.backgroundColor = 'white';
	}

	//Updating cookie status displays
	for (var i =  0; i < 2; i++) {
		if (cookieprm[i]) {
			cookiebtns[i].innerHTML = 'Yes';
		}
		else {
			cookiebtns[i].innerHTML = 'No';
		}
	}

	//calling important functions
	DrawFrame();
	Menu_Update();
	ResizeText();
}

//calling functions
Main();
reset();

//setting firstrun to false
firstrun = false;
