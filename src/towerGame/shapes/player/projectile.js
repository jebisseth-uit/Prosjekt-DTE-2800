//Denne filen er i stor grad basert på eksempel gitt av lærer, så redigert for våre formål
import * as THREE from "three";
import {addMeshToScene, g_scene} from "../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../myAmmoHelper.js";

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export function createProjectile(mass = 1, position={x:0, y:0, z:0}, radius = 0.3, firePower = 10, color = 0x000000) {

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = "projectile";
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1, mesh2) => {
		g_scene.remove(mesh1)

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
		COLLISION_GROUP_SPHERE | COLLISION_GROUP_BOX | COLLISION_GROUP_PLANE );

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}