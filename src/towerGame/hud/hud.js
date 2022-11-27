import * as THREE from "three";
import {level, score, time, health} from "../towerGame";

let heartValue = "full";

export async function updateHud(loader) {

	let hud = new THREE.Group;
	hud.name = "hud";

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