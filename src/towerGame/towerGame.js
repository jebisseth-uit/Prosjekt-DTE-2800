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

//levels
import {level_demo} from "./levels/demo/level_demo.js";

//hud
import {addSprites} from "./hud/hud.js";

//Globale variabler:
export let level = "Demo";
export let score = 1234;
export let time = "1:34";
export let health = 45;

let g_clock;
const g_currentlyPressedKeys = []
const XZPLANE_SIDELENGTH = 100;
const stats = new Stats();

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

	const loader = new THREE.TextureLoader();
	addSprites(loader);

	// three:
	createThreeScene();

	// ammo
	createAmmoWorld(true);  //<<=== MERK!

	// three/ammo-objekter:
	addAmmoSceneObjects();

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
}

function handleKeyDown(event) {
	g_currentlyPressedKeys[event.code] = true;
}

function addAmmoSceneObjects() {
	createXZPlane(XZPLANE_SIDELENGTH);
	createSpheres(20);
	createCube();
	createPlayer();
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

	//Oppdaterer HUD
	let sprite = g_scene.getObjectByName("hud")
	sprite.position.copy(g_camera.position)
	sprite.rotation.copy(g_camera.rotation)
	sprite.updateMatrix();
	sprite.translateY(-6)
	sprite.translateX(-10)
	sprite.translateZ(-10)
	//sprite.translateX(-10);

	//Tegner scenen med gitt kamera:
	renderScene();

	stats.end();
}
