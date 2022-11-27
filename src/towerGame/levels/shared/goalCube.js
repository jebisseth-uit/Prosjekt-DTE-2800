import * as THREE from "three";
import {addMeshToScene, g_scene, impactSound} from "../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../myAmmoHelper.js";
import {TWEEN} from "three/addons/libs/tween.module.min";
import {score} from "../../towerGame";

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export function goalCube(mass = 17, color=0xF00FE0, position={x:20, y:50, z:30}) {
	const sideLength = 0.2*mass;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.BoxGeometry(sideLength,sideLength,sideLength, 1, 1),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'cube';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1, mesh2) => {
		// mesh1 = this object, mesh2 = colliding object
		if (mesh2.name === "player"){
			levelFinished();
		}
	};

	//AMMO
	let width = mesh.geometry.parameters.width;
	let height = mesh.geometry.parameters.height;
	let depth = mesh.geometry.parameters.depth;

	let shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2) );
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_BOX,
		COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE
	);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

function levelFinished(){
	let levelFinishedString =
		'<div class="position-relative">' +
		'<div class="position-absolute top-50 start-50">' +
		'<div class="d-flex flex-row" style = "background-color: rgba(153,204,255,0.4)">' +
		'<div class="p-2 ti-layout-align-middle">' +
		'<div class="container">' +
		'<h1>Finished!</h1>' +
		'<h3><a href="../home/home.html">Go to level selection</a></h3>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>'

	document.getElementById("levelFinished").innerHTML=levelFinishedString;
}
