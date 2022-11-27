import * as THREE from "three";
import {addMeshToScene} from "../../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../../myAmmoHelper.js";

import {levelNo} from "../../../towerGame";

let isOnce=false;
const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export async function createWall_no_windows(name, width = 1, height = 1, depth = 1, position={x:0, y:0, z:0}, rotation={x:0, z:0, y:0}, opacity = 1, wallMaterialFileName = "bricks2.jpg", wallMaterialAlphaFilename = "bricks2_alphamap.jpg") {
	const mass = 0; //Merk!
	let color=0x00A6E5;
	let wallMaterial = wallMaterialFileName;

	//*****
	//* BasicMaterial med alphaMap (som kontrollerer gjennomsiktighet vha. en tekstur)
	//*****
	const loader = new THREE.TextureLoader();
	let bricksTexture, alphamapTexture, materialBasicAlpahamap;
	bricksTexture = await loader.loadAsync('../../../assets/textures/' + wallMaterial);
	alphamapTexture = await loader.loadAsync('../../../assets/textures/' + wallMaterialAlphaFilename);
	materialBasicAlpahamap = new THREE.MeshBasicMaterial({ map:bricksTexture, color: 0xffffff, wireframe:false, side: THREE.DoubleSide });

	materialBasicAlpahamap.alphaMap = alphamapTexture;
	materialBasicAlpahamap.transparent = true;
	bricksTexture.wrapS = THREE.RepeatWrapping;
	bricksTexture.wrapT = THREE.RepeatWrapping;
	bricksTexture.repeat.set(5,5)

	//THREE
	let material = new THREE.BoxGeometry(width,height,depth, 1, 1)
	let mesh = new THREE.Mesh(material, materialBasicAlpahamap);
	materialBasicAlpahamap.opacity = opacity;
	mesh.name = 'wall';
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
		COLLISION_GROUP_BOX,
		COLLISION_GROUP_SPHERE |
		COLLISION_GROUP_PLANE |
		COLLISION_GROUP_MOVEABLE
	);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}
