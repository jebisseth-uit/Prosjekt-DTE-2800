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
	applyRotation,
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
export let jumpCount = {count:0}

let g_clock;
export let lastKey;
const g_currentlyPressedKeys = []
const XZPLANE_SIDELENGTH = 100;
const stats = new Stats();

export let moveDirection;
moveDirection = { left: 0, right: 0, forward: 0, back: 0, up: 0 }
// let objEnemy,objEnemy2;
import {FACE_ENEMY,HORSE_ENEMY,DIANAUSER_ENEMY} from "./createEnemy";
let objEnemy,objEnemy2,objEnemy3;
export let levelNo=0;
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
	objEnemy  = loadEnemy('../../../model/horse.glb',{x:.5,y:.5,z:.5});
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
			moveDirection.jump = -1;
			break;

		case 83: //BACK
			moveDirection.back = 0
			moveDirection.jump = -1;
			break;

		case 65: //LEFT
			moveDirection.left = 0
			moveDirection.jump = -1;
			break;

		case 68: //RIGHT
			moveDirection.right = 0
			moveDirection.jump = -1;
			break;

		case 32: //Space: JUMP
			moveDirection.jump = -1;
			jumpCount.count = 0;
			break;
	}
	if(g_scene){
		const player = g_scene.getObjectByName("player");
		if(player){
			let velocity = new Ammo.btVector3(0,0,0)
			player.userData.physicsBody.setAngularVelocity(velocity);
		}
	}

}

function handleKeyDown(event) {
	g_currentlyPressedKeys[event.code] = true
}
function addAmmoSceneObjects() {
	createXZPlane(XZPLANE_SIDELENGTH);
	createCube();
	createBall();
	setTimeout(() => {
		new Enemy(objEnemy2,2,FACE_ENEMY,5);
		new Enemy(objEnemy,2,DIANAUSER_ENEMY,10);
		new Enemy(objEnemy3,2,HORSE_ENEMY,7);
	}, 2000);
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
	updateHud();

	// Oppdaterer kamera til å se mot spiller
	//const player = g_scene.getObjectByName("player");
	//g_camera.lookAt(player.position.x, player.position.y, player.position.z)

	TWEEN.update();

	//Tegner scenen med gitt kamera:
	renderScene();


	stats.end();
}