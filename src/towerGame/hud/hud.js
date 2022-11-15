import * as THREE from "three";
import {g_scene} from "../myThreeHelper";

let spriteBL;

export async function addSprites(loader) {

	let hud = new THREE.Group;
	hud.name = "hud";

	//Testsprite
	const spriteMap1 = await loader.loadAsync('../../../assets/textures/bird1.png');
	let spriteMaterial1 = new THREE.SpriteMaterial( { map: spriteMap1, color: 0xffffff } );
	let sprite1 = new THREE.Sprite( spriteMaterial1 );
	sprite1.name = "sprite";
	//sprite1.center.set(10,10)
	sprite1.scale.set(2,2,2);
	hud.add( sprite1 );

	let spritey = makeTextSprite( " Test ",
		{ fontsize: 44, textColor: {r:0, g:0, b:0, a:1.0}} );
	spritey.position.set(3.5,-1,0);
	spritey.scale.set(5,5,5);
	hud.add(spritey)

	g_scene.add( hud );
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