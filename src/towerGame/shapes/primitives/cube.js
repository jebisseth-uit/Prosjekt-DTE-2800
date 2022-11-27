//Denne filen er i stor grad basert på eksempel gitt av lærer, så redigert for våre formål
import * as THREE from "three";
import {addMeshToScene} from "../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../myAmmoHelper.js";

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export function createCube(mass = 17, color=0xF00FE0, position={x:20, y:50, z:30}) {
	const sideLength = 0.2*mass;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.BoxGeometry(sideLength,sideLength,sideLength, 1, 1),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'cube';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

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
