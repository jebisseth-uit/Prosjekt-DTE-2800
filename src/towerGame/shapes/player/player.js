import * as THREE from "three";
import {addMeshToScene} from "../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../myAmmoHelper.js";
import {lastKey} from "../../myThreeHelper.js";
import {moveDirection} from "../../towerGame.js";

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export function createPlayer(color=0x00A6E5, position={x:-10, y:0, z:-30}) {
	const sideLength = 5;
	const mass = 45; //Merk!

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.BoxGeometry(sideLength,sideLength,sideLength, 1, 1),
		new THREE.MeshStandardMaterial({color: color}));
	//mesh.name = 'player';
	//mesh.playerSpeed = 10;
	//mesh.playerJumpForce = 120;
	position.y = position.y + mesh.scale.y*sideLength/2;
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	mesh.collisionResponse = (mesh1) => {
		lastKey.key = "jump"
		//mesh1.material.color.setHex(Math.random() * 0xffffff);
	};

	//AMMO
	let width = mesh.geometry.parameters.width;
	let height = mesh.geometry.parameters.height;
	let depth = mesh.geometry.parameters.depth;


	let shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2) );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);
	// Følgende er avgjørende for å kunne flytte på objektet:
	// 2 = BODYFLAG_KINEMATIC_OBJECT: Betyr kinematic object, masse=0 men kan flyttes!
	//rigidBody.setCollisionFlags(rigidBody.getCollisionFlags() | 2);
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




export function createBall(){

	let pos = {x: 0, y: 8, z: 0};
	let radius = 1;
	let quat = {x: 0, y: 0, z: 0, w: 1};
	let mass = 10;

	//threeJS Section
	let player = new THREE.Mesh(new THREE.SphereGeometry(radius), new THREE.MeshPhongMaterial({color: 0xff0505}));

	player.position.set(pos.x, pos.y, pos.z);

	player.castShadow = true;
	player.receiveShadow = true;
	player.name = "player";
	player.playerSpeed = 20;
	player.playerJumpForce = 60;

	player.collisionResponse = (mesh1) => {
		lastKey.key = "nojump";
		moveDirection.jump = 0;
	};

	//Ammojs Section
	let transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
	transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
	let motionState = new Ammo.btDefaultMotionState( transform );

	let colShape = new Ammo.btSphereShape( radius );
	colShape.setMargin( 0.05 );

	let localInertia = new Ammo.btVector3( 0, 0, 0 );
	//colShape.calculateLocalInertia( mass, localInertia );
	colShape.calculateLocalInertia( mass, 100 );

	let rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, colShape, localInertia );
	let body = new Ammo.btRigidBody( rbInfo );

	body.setFriction(4);
	body.setRollingFriction(10);
	body.setActivationState(4)

	player.userData.physicsBody = body;

	addMeshToScene(player)
	g_ammoPhysicsWorld.addRigidBody( body,
		COLLISION_GROUP_SPHERE,
		COLLISION_GROUP_SPHERE | COLLISION_GROUP_PLANE | COLLISION_GROUP_BOX);

	g_rigidBodies.push(player);
	body.threeMesh = player;
}
