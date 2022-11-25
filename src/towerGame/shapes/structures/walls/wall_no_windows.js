import * as THREE from "three";
import {addMeshToScene} from "../../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../../myAmmoHelper.js";

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

import {levelNo} from "../../../towerGame";

let isOnce=false;
export async function createWall_no_windows(name, width = 1, height = 1, depth = 1, position={x:0, y:0, z:0}, rotation={x:0, z:0, y:0}, opacity = 1) {
	const mass = 0; //Merk!
	let color=0x00A6E5;

	//*****
	//* BasicMaterial med alphaMap (som kontrollerer gjennomsiktighet vha. en tekstur)
	//*****
	const loader = new THREE.TextureLoader();
	let bricksTexture,alphamapTexture,materialBasicAlpahamap;
	switch (levelNo){
		case 0:
			 bricksTexture = await loader.loadAsync('../../../assets/textures/bricks2.jpg');
			 alphamapTexture = await loader.loadAsync('../../../assets/textures/bricks2_alphamap.jpg');
			 materialBasicAlpahamap = new THREE.MeshBasicMaterial({ map:bricksTexture, color: 0xffffff, wireframe:false, side: THREE.DoubleSide });
			break;
		case 1:
			 bricksTexture = await loader.loadAsync('../../../assets/textures/chocchip.png');
			 alphamapTexture = await loader.loadAsync('../../../assets/textures/bricks2_alphamap.jpg');
			 materialBasicAlpahamap = new THREE.MeshBasicMaterial({ map:bricksTexture, color: 0xffffff, wireframe:false, side: THREE.DoubleSide });
			break;
		case 2:
			bricksTexture = await loader.loadAsync('../../../assets/textures/water.jpg');
			alphamapTexture = await loader.loadAsync('../../../assets/textures/bricks2_alphamap.jpg');
			materialBasicAlpahamap = new THREE.MeshBasicMaterial({ map:bricksTexture, color: 0xffffff, wireframe:false, side: THREE.DoubleSide });
			break;
	}
//	const bricksTexture = await loader.loadAsync('../../../assets/textures/bricks2.jpg');
//	const alphamapTexture = await loader.loadAsync('../../../assets/textures/bricks2_alphamap.jpg');
	//const materialBasicAlpahamap = new THREE.MeshBasicMaterial({ map:bricksTexture, color: 0xffffff, wireframe:false, side: THREE.DoubleSide });
	materialBasicAlpahamap.alphaMap = alphamapTexture;
	materialBasicAlpahamap.transparent = true;
	bricksTexture.wrapS = THREE.RepeatWrapping;
	bricksTexture.wrapT = THREE.RepeatWrapping;
	bricksTexture.repeat.set(5,5);
	materialBasicAlpahamap.needsUpdate = true;

	//THREE
   //if(!isOnce)
   {
	   isOnce = true;
	   let mesh = new THREE.Mesh(
		   new THREE.BoxGeometry(width, height, depth, 1, 1),
		   materialBasicAlpahamap);
	   materialBasicAlpahamap.opacity = opacity;
	   mesh.name = 'wall';
	   mesh.rotation.set(rotation.x, rotation.y, rotation.z);
	   mesh.castShadow = true;
	   mesh.receiveShadow = true;

	   //AMMO
	   width = mesh.geometry.parameters.width;
	   height = mesh.geometry.parameters.height;
	   depth = mesh.geometry.parameters.depth;


	   let shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));
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
}
