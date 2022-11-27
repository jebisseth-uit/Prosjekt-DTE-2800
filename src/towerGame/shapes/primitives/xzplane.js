//Denne filen er i stor grad basert på eksempel gitt av lærer, så redigert for våre formål
import * as THREE from "three";
import {addMeshToScene} from "../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../myAmmoHelper.js";

let g_xzPlaneSideLength=100;

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export async function createXZPlane(xzPlaneSideLength, floorMaterialFilename = "bricks2.jpg", repeat = 5 ) {
	const mass=0;
	const position = {x: 0, y: 0, z: 0};
	let floorMaterial = floorMaterialFilename;
	g_xzPlaneSideLength = xzPlaneSideLength;

	//Texture
	const loader = new THREE.TextureLoader();
	const texture = await loader.loadAsync('../../assets/textures/' + floorMaterial);

	// THREE:
	let geometry = new THREE.PlaneGeometry( g_xzPlaneSideLength, g_xzPlaneSideLength, 1, 1);
	let mPlane = new THREE.MeshPhongMaterial({map: texture});
	let mesh = new THREE.Mesh(geometry, mPlane);
	mesh.receiveShadow = true;
	mesh.name = 'xzplane';

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(repeat,repeat)

	geometry.rotateX( -Math.PI / 2 );

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(g_xzPlaneSideLength/2, 0, g_xzPlaneSideLength/2));
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_PLANE,
		COLLISION_GROUP_SPHERE | COLLISION_GROUP_BOX | COLLISION_GROUP_MOVABLE);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh; //Brukes til collision events:
}