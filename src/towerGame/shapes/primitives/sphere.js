import * as THREE from "three";
import {addMeshToScene, g_scene} from "../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../myAmmoHelper.js";
import {impactSound} from "../../myThreeHelper.js";
import {TWEEN} from "three/addons/libs/tween.module.min.js";
import {score} from "../../towerGame";


const audioLoader2 = new THREE.AudioLoader();
audioLoader2.load( "../../../../assets/Sound/SoundEffects/zombie-15.wav", function( buffer ) {
	impactSound.setBuffer( buffer );
	impactSound.setLoop( false );
	impactSound.setVolume( 1 );
	impactSound.play();
});

let g_xzPlaneSideLength=100;

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export function createSphere(mass = 10, color=0x00FF00, position={x:0, y:50, z:0}, name= "sphere") {
	const radius = 0.2*mass;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.hit = false;
	mesh.material.transparent = true;
	mesh.name = 'sphere';
	mesh.points = 10;
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1, mesh2) => {
		// mesh1 = this object, mesh2 = colliding object
		if (mesh2.name === "player"){
			//mesh1.material.color.setHex(Math.random() * 0xffffff);
			impactSound.play();
			new TWEEN.Tween( mesh1.material ).to( { opacity: 0 }, 1000 ).start();
			setTimeout(function(){
				g_scene.remove(mesh1);
			},1000);
			//Sjekk om mesh allerede er truffet
			if (!mesh.hit){
				score.total += mesh.points;
				mesh.hit = true;
			}
		}

	};
	//AMMO
	let shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_SPHERE,
		COLLISION_GROUP_SPHERE | COLLISION_GROUP_BOX | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE );

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

export function createSpheres(noSpheres) {
	for (let i=0; i<noSpheres; i++) {
		let height = 40 + Math.random() * 30;
		createRandomSpheres(height);
	}
}

export function createRandomSpheres(height=50) {
	const xPos = -(g_xzPlaneSideLength/2) + Math.random() * g_xzPlaneSideLength;
	const zPos = -(g_xzPlaneSideLength/2) + Math.random() * g_xzPlaneSideLength;
	const pos = {x: xPos, y: height, z: zPos};
	const mass = 5 + Math.random() * 20;

	createSphere(mass, 0x00FF00, {x:xPos, y:50, z:zPos});
}
