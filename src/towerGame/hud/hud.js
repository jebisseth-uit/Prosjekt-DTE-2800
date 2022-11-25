import * as THREE from "three";
import {g_scene} from "../myThreeHelper";
import {level, score, time, health} from "../towerGame";

let heartValue = "full";

export async function updateHud(loader) {

	let hud = new THREE.Group;
	hud.name = "hud";
<<<<<<< HEAD

=======
	
>>>>>>> origin/main
	let heart = setHealthImage(health);

	// Update heart
	let heartString = "../../assets/sprites/health/heart_" + heart + ".png"
	document.getElementById("health").src=heartString;

	// Update health percent
	let healthPercentString = health + " %"
	document.getElementById("healthPercent").innerHTML=healthPercentString;

	// Update level
	let levelString = "Level: " + level;
	document.getElementById("level").innerHTML = levelString;

	// Update score
	let scoreString = "Score: " + score.total;
	document.getElementById("score").innerHTML = scoreString;

	//Update time
	let timeString = "Time: " + time;
	document.getElementById("time").innerHTML = timeString;

	/**
<<<<<<< HEAD
	 //console.log(health);
	 //console.log(heart);
	 // Health heart image
	 const healthSprite = await loader.loadAsync('../../../assets/sprites/health/heart_' + heart + '.png');
	 let healthSpriteMaterial = new THREE.SpriteMaterial( { map: healthSprite, color: 0xffffff } );
	 let healthBar = new THREE.Sprite( healthSpriteMaterial );
	 healthBar.name = "healthbar";
	 healthBar.scale.set(2,2,2);
	 hud.add( healthBar );
	 // Health percent
	 let healthPstSprite = makeTextSprite( health + "%",
	 { fontsize: 30, textColor: {r:0, g:0, b:0, a:1.0}} );
	 healthPstSprite.position.set(1.35,-0.92,0.1);
	 healthPstSprite.scale.set(3,3,3);
	 hud.add(healthPstSprite)
	 // Level text
	 let levelName = makeTextSprite( "Level: " + level,
	 { fontsize: 30, textColor: {r:0, g:0, b:0, a:1.0}} );
	 levelName.position.set(g_scene.position.x + 2.5,g_scene.position.y - 0.4,0);
	 levelName.scale.set(3,3,3);
	 hud.add(levelName)
	 // Score text
	 let scoreSprite = makeTextSprite( "Score: " + score ,
	 { fontsize: 30, textColor: {r:0, g:0, b:0, a:1.0}} );
	 scoreSprite.position.set(g_scene.position.x + 2.5,g_scene.position.y - 1.1,0);
	 scoreSprite.scale.set(3,3,3);
	 hud.add(scoreSprite)
	 // Time text
	 let timeSprite = makeTextSprite( "Time:  " + time,
	 { fontsize: 30, textColor: {r:0, g:0, b:0, a:1.0}} );
	 timeSprite.position.set(g_scene.position.x + 2.5,g_scene.position.y - 1.8,0);
	 timeSprite.scale.set(3,3,3);
	 hud.add(timeSprite)
	 g_scene.add( hud );**/
=======
	//console.log(health);
	//console.log(heart);
	// Health heart image
	const healthSprite = await loader.loadAsync('../../../assets/sprites/health/heart_' + heart + '.png');
	let healthSpriteMaterial = new THREE.SpriteMaterial( { map: healthSprite, color: 0xffffff } );
	let healthBar = new THREE.Sprite( healthSpriteMaterial );
	healthBar.name = "healthbar";
	healthBar.scale.set(2,2,2);
	hud.add( healthBar );

	// Health percent
	let healthPstSprite = makeTextSprite( health + "%",
		{ fontsize: 30, textColor: {r:0, g:0, b:0, a:1.0}} );
	healthPstSprite.position.set(1.35,-0.92,0.1);
	healthPstSprite.scale.set(3,3,3);
	hud.add(healthPstSprite)

	// Level text
	let levelName = makeTextSprite( "Level: " + level,
		{ fontsize: 30, textColor: {r:0, g:0, b:0, a:1.0}} );
	levelName.position.set(g_scene.position.x + 2.5,g_scene.position.y - 0.4,0);
	levelName.scale.set(3,3,3);
	hud.add(levelName)

	// Score text
	let scoreSprite = makeTextSprite( "Score: " + score ,
		{ fontsize: 30, textColor: {r:0, g:0, b:0, a:1.0}} );
	scoreSprite.position.set(g_scene.position.x + 2.5,g_scene.position.y - 1.1,0);
	scoreSprite.scale.set(3,3,3);
	hud.add(scoreSprite)

	// Time text
	let timeSprite = makeTextSprite( "Time:  " + time,
		{ fontsize: 30, textColor: {r:0, g:0, b:0, a:1.0}} );
	timeSprite.position.set(g_scene.position.x + 2.5,g_scene.position.y - 1.8,0);
	timeSprite.scale.set(3,3,3);
	hud.add(timeSprite)

	g_scene.add( hud );**/
>>>>>>> origin/main
}

function setHealthImage(health){
	switch (true){
		case (health > 89):
			heartValue = "full";
			break;
		case (health > 65):
			heartValue = "75";
			break;
		case (health > 40):
			heartValue = "50";
			break;
		case (health > 15):
			heartValue = "25";
			break;
		default:
			heartValue = "empty"
	}
	return heartValue;
}

// Tekst til sprite
// Kode lånt fra https://codepen.io/sureshwisdom/pen/gObavym

function makeTextSprite( message, parameters )
{
	if ( parameters === undefined ) parameters = {};
	let fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Courier New";
	let fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
	let borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
	let borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	let backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:0, g:0, b:255, a:1.0 };
	let textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

	let canvas = document.createElement('canvas');
	let context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
	let metrics = context.measureText( message );
	let textWidth = metrics.width;

	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
	context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
	context.fillText( message, borderThickness, fontsize + borderThickness);

	let texture = new THREE.Texture(canvas)
	texture.needsUpdate = true;
	let spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );

	let sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);

	return sprite;
}