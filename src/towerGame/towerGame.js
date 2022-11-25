import '../../style.css';
import * as THREE from "three";
import Stats from 'stats.js';

import {
	createThreeScene, g_camera, g_scene,
	handleKeys,
	onWindowResize,
	renderScene,
	updateThree
} from "./myThreeHelper.js";

import {
	createAmmoWorld,
	updatePhysics
} from "./myAmmoHelper.js";

import {createXZPlane} from "./shapes/primitives/xzplane.js";
import {createSpheres} from "./shapes/primitives/sphere.js";
import {createCube} from "./shapes/primitives/cube.js";
import {createPlayer} from "./shapes/player/player.js";
import {createBall} from "./shapes/player/player.js";

//levels
import {level_demo} from "./levels/demo/level_demo.js";

//hud
import {updateHud} from "./hud/hud.js";
import {Tween} from "@tweenjs/tween.js";
import {TWEEN} from "three/addons/libs/tween.module.min";

import {loadEnemy} from './MyEnemy';
import Enemy from './createEnemy';

//Globale variabler:
export let level = "Demo";
export let score = {total: 0};
export let time = "1:34";
export let health = 45;

let g_clock;
export let lastKey;
const g_currentlyPressedKeys = []
const XZPLANE_SIDELENGTH = 100;
const stats = new Stats();

export let moveDirection;
moveDirection = { left: 0, right: 0, forward: 0, back: 0, up: 0 }
let objEnemy,objEnemy2,objEnemy3;
export let levelNo=2;
//STARTER!
//Ammojs Initialization
Ammo().then( async function( AmmoLib ) {
	Ammo = AmmoLib;
	await main();
} );

export async function main() {

	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );

	//Input - standard Javascript / WebGL:
	document.addEventListener('keyup', handleKeyUp, false);
	document.addEventListener('keydown', handleKeyDown, false);

	// three:
	createThreeScene();

	// ammo
	createAmmoWorld(true);  //<<=== MERK!

	// three/ammo-objekter:
	addAmmoSceneObjects();
	objEnemy  = loadEnemy('../../../model/dinusaur.glb',{x:0.2,y:0.2,z:0.2});
	objEnemy2 = loadEnemy('../../../model/face.glb',{x:.1,y:.1,z:.1});
	objEnemy3 = loadEnemy('../../../model/horse.glb',{x:.2,y:.2,z:.2});


	// draw level
	level_demo(XZPLANE_SIDELENGTH, XZPLANE_SIDELENGTH);
	// Klokke for animasjon
	g_clock = new THREE.Clock();

	//Håndterer endring av vindusstørrelse:
	window.addEventListener('resize', onWindowResize, false);
	//Input - standard Javascript / WebGL:
	document.addEventListener('keyup', handleKeyUp, false);
	document.addEventListener('keydown', handleKeyDown, false);

	// Start animasjonsløkka:
	animate(0);
}

function handleKeyUp(event) {
	g_currentlyPressedKeys[event.code] = false;
	lastKey = "";
	//console.log(lastKey);

	let keyCode = event.keyCode;

	switch(keyCode){
		case 87: //FORWARD
			moveDirection.forward = 0
			break;

		case 83: //BACK
			moveDirection.back = 0
			break;

		case 65: //LEFT
			moveDirection.left = 0
			break;

		case 68: //RIGHT
			moveDirection.right = 0
			break;

		case 32: //Space: JUMP
			break;
	}
}

function handleKeyDown(event) {
	g_currentlyPressedKeys[event.code] = true
}
function addAmmoSceneObjects() {
	createXZPlane(XZPLANE_SIDELENGTH);
	// createSpheres(20);
	createCube();
	//createPlayer();
	createBall();
	setTimeout(() => {
		console.log("objEnemy!!!!!",objEnemy);
		
		const faceEnemy  = new Enemy(objEnemy2,4,"face_enemy",5);
		const dinusaur = new Enemy(objEnemy,4,"dinusaur",10);
		const horseEnemy = new Enemy(objEnemy3,4,"horse",7);
		// createEnemy(objEnemy,2);
		// createEnemy(objEnemy2,4);

	}, 5000);
}

function animate(currentTime, myThreeScene, myAmmoPhysicsWorld, loader) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime, myThreeScene, myAmmoPhysicsWorld);
	});
	let deltaTime = g_clock.getDelta();

	stats.begin();

	//Oppdaterer grafikken:
	updateThree(deltaTime);

	//Oppdaterer fysikken:
	updatePhysics(deltaTime);

	//Sjekker input:
	handleKeys(deltaTime, g_currentlyPressedKeys);

	//Oppdater HUD
	///updateHud();

	// Oppdaterer kamera til å se mot spiller
	//const player = g_scene.getObjectByName("player");
	//g_camera.lookAt(player.position.x, player.position.y, player.position.z)

	TWEEN.update();

	//Tegner scenen med gitt kamera:
	renderScene();


	stats.end();
}
