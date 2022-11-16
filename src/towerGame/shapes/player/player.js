import * as THREE from "three";
import {addMeshToScene} from "../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../myAmmoHelper.js";

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export function createPlayer(color=0x00A6E5, position={x:-10, y:0, z:-30}) {
	const sideLength = 5;
	const mass = 0; //Merk!

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.BoxGeometry(sideLength,sideLength,sideLength, 1, 1),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'player';
	mesh.playerSpeed = 5;
	position.y = position.y + mesh.scale.y*sideLength/2;
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	//AMMO
	let width = mesh.geometry.parameters.width;
	let height = mesh.geometry.parameters.height;
	let depth = mesh.geometry.parameters.depth;


	let shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2) );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);
	// Følgende er avgjørende for å kunne flytte på objektet:
	// 2 = BODYFLAG_KINEMATIC_OBJECT: Betyr kinematic object, masse=0 men kan flyttes!
	rigidBody.setCollisionFlags(rigidBody.getCollisionFlags() | 2);
	// 4 = BODYSTATE_DISABLE_DEACTIVATION, dvs. "Never sleep".
	rigidBody.setActivationState(4);
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
