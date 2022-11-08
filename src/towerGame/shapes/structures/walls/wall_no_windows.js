import * as THREE from "three";
import {addMeshToScene} from "../../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../../myAmmoHelper.js";

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export function createWall_no_windows(name, width = 1, height = 1, depth = 1, position={x:0, y:0, z:0}, rotation={x:0, z:0, y:0}) {
	const mass = 0; //Merk!
	let color=0x00A6E5;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.BoxGeometry(width,height,depth, 1, 1),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'name';
	mesh.rotation.set(rotation.x, rotation.y, rotation.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	//AMMO
	width = mesh.geometry.parameters.width;
	height = mesh.geometry.parameters.height;
	depth = mesh.geometry.parameters.depth;


	let shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2) );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);
	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_MOVEABLE,
		COLLISION_GROUP_SPHERE |
		COLLISION_GROUP_PLANE |
		COLLISION_GROUP_BOX
	);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}
