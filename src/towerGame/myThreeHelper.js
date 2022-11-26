import * as THREE from "three";
import GUI from "lil-gui";
import {applyImpulse, moveRigidBody} from "./myAmmoHelper";
import {createRandomSpheres} from "./shapes/primitives/sphere.js";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {moveDirection} from "./towerGame.js";
import {createProjectile} from "./shapes/player/projectile.js";
import {jumpCount} from "./towerGame.js";

export let lastKey = {key: "Space"};

export let g_scene, g_renderer, g_camera, g_controls, g_lilGui;

export const listener = new THREE.AudioListener();
export const impactSound = new THREE.PositionalAudio (listener);

export function createThreeScene() {
	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	// Renderer:
	g_renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
	g_renderer.setSize(window.innerWidth, window.innerHeight);
	g_renderer.setClearColor(0xBFD104, 0xff);  //farge, alphaverdi.
	g_renderer.shadowMap.enabled = true; //NB!
	g_renderer.shadowMapSoft = true;
	g_renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

	// Scene
	g_scene = new THREE.Scene();
	g_scene.background = new THREE.Color( 0xdddddd );

	// lil-gui kontroller:
	g_lilGui = new GUI();

	// Sceneobjekter
	//await addSceneObjects();
	addLights();

	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	g_camera.position.x = 20;
	g_camera.position.y = 60;
	g_camera.position.z = 90;

	// TrackballControls:
	g_controls = new TrackballControls(g_camera, g_renderer.domElement);
	g_controls.addEventListener( 'change', renderScene);


	// Henter lydfiler fra :
	// https://opengameart.org/content/4-chiptunes-adventure
	// https://opengameart.org/content/heroic-demise-updated-version
	// https://opengameart.org/content/zombies-sound-pack

// create an AudioListener and add it to the camera
	g_camera.add( listener );

// create a global audio source
	const backgroundSound = new THREE.Audio( listener );

// Local audio sources:
	const localSound2 = new THREE.PositionalAudio (listener);


// load a sound and set it as the Audio object's buffer
	const audioLoader = new THREE.AudioLoader();
	audioLoader.load( "../../assets/Sound/Music/Juhani Junkala [Chiptune Adventures] 1. Stage 1.ogg", function( buffer ) {
		backgroundSound.setBuffer( buffer );
		backgroundSound.setLoop( true );
		backgroundSound.setVolume( 0.05 );
		//backgroundSound.play();
	});

// load a sound and set it as the local Audio object's buffer
	const audioLoader1 = new THREE.AudioLoader();
	audioLoader1.load( "../../assets/Sound/SoundEffects/zombie-16.wav", function( buffer ) {
		localSound2.setBuffer( buffer );
		localSound2.setLoop( true );
		localSound2.setVolume( 1 );
		//localSound2.play();
		g_scene.getObjectByName('cube').add(localSound2)
	});

}

export function addLights() {
	// Ambient:
	let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.7);
	ambientLight1.visible = true;
	g_scene.add(ambientLight1);
	const ambientFolder = g_lilGui.addFolder( 'Ambient Light' );
	ambientFolder.add(ambientLight1, 'visible').name("On/Off");
	ambientFolder.add(ambientLight1, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	ambientFolder.addColor(ambientLight1, 'color').name("Color");

	//** RETNINGSORIENTERT LYS (som gir skygge):
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.visible = true;
	directionalLight.position.set(0, 105, 0);
	// Viser lyskilden:
	const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 10, 0xff0000);
	directionalLightHelper.visible = true;
	g_scene.add(directionalLightHelper);
	directionalLight.castShadow = true;     //Merk!
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.camera.near = 5;
	directionalLight.shadow.camera.far = 110;
	directionalLight.shadow.camera.left = -50;
	directionalLight.shadow.camera.right = 50;
	directionalLight.shadow.camera.top = 50;
	directionalLight.shadow.camera.bottom = -50;
	g_scene.add(directionalLight);
	// Viser lyskildekamera (hva lyskilden "ser")
	const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
	directionalLightCameraHelper.visible = true;

	g_scene.add(directionalLightCameraHelper);

	//lil-gui:
	const directionalFolder = g_lilGui.addFolder( 'Directional Light' );
	directionalFolder.add(directionalLight, 'visible').name("On/Off");
	directionalFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	directionalFolder.addColor(directionalLight, 'color').name("Color");
}

//Sjekker tastaturet:
export function handleKeys(delta, g_currentlyPressedKeys) {

	let maxJump = 100;

	if (g_currentlyPressedKeys['KeyH']) {	//H
		createRandomSpheres(200);
	}

	const player = g_scene.getObjectByName("player");
	const playerSpeed = player.playerSpeed;
	const playerWorldPos = new THREE.Vector3();
	const playerWorldDir = new THREE.Vector3();

	if (lastKey.key !== "jump"){
		if (g_currentlyPressedKeys['KeyA']) {	//A
			moveDirection.left = 1;
		}
		if (g_currentlyPressedKeys['KeyD']) {	//D
			moveDirection.right = 1;
		}
		if (g_currentlyPressedKeys['KeyW']) {	//W
			moveDirection.forward = 1;
		}
		if (g_currentlyPressedKeys['KeyS']) {	//S
			moveDirection.back = 1;
		}
		if (g_currentlyPressedKeys['Space']) {	//Space
			moveDirection.jump = 1;
			lastKey.key = "jump";
		}
	}

	if (g_currentlyPressedKeys['KeyQ']) {
		g_controls.reset();
	}

	let moveX =  moveDirection.right - moveDirection.left;
	let moveZ =  moveDirection.back - moveDirection.forward;
	let moveY =  moveDirection.jump;

	if (g_currentlyPressedKeys['KeyN']) {	//Space
		let projectile;
		if (!g_scene.getObjectByName("projectile")){
			// Get world posistion of player for spawning projectile
			player.getWorldPosition(playerWorldPos)
			player.getWorldDirection(playerWorldDir)
			createProjectile(1, {x:playerWorldPos.x + moveX*2, y:playerWorldPos.y, z:playerWorldPos.z + moveZ*2} )
			projectile = g_scene.getObjectByName("projectile");
			applyImpulse(projectile.userData.physicsBody, 60, {x:moveX, y:0.1, z:moveZ});
			projectile.inWorld = true;
		}
	}

	if( moveX == 0 && moveY == 0 && moveZ == 0) return;

	let resultantImpulse = new Ammo.btVector3( moveX, moveY, moveZ )
	resultantImpulse.op_mul(playerSpeed);

	let physicsBody = player.userData.physicsBody;
	physicsBody.setLinearVelocity(resultantImpulse)

}

export function onWindowResize() {
	g_camera.aspect = window.innerWidth / window.innerHeight;
	g_camera.updateProjectionMatrix();
	g_renderer.setSize(window.innerWidth, window.innerHeight);
	g_controls.handleResize();
	renderScene();
}

export function updateThree(deltaTime) {
	//Oppdater trackball-kontrollen:
	g_controls.update();
}

export function addMeshToScene(mesh) {
	g_scene.add(mesh);
}

export function renderScene()
{
	g_renderer.render(g_scene, g_camera);
}

export function getRigidBodyFromMesh(meshName) {
	const mesh = g_scene.getObjectByName(meshName);
	if (mesh)
		return mesh.userData.physicsBody;
	else
		return null;
}
