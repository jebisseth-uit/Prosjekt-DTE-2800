import * as THREE from "three";
import {g_scene} from "../myThreeHelper";

let spriteBL;

export async function addSprites(loader) {

	//Testsprite
	const spriteMap1 = await loader.loadAsync('../../../assets/textures/bird1.png');
	let spriteMaterial1 = new THREE.SpriteMaterial( { map: spriteMap1, color: 0xffffff } );
	let sprite1 = new THREE.Sprite( spriteMaterial1 );
	sprite1.name = "sprite";
	//sprite1.center.set(10,10)
	sprite1.scale.set(2,2,2);
	g_scene.add( sprite1 );
}