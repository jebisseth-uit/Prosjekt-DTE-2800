import * as THREE from "three";
import {addMeshToScene} from "../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../myAmmoHelper.js";

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export async function cubeTextured(name, width = 1, height = 1, depth = 1, position={x:0, y:0, z:0}, rotation={x:0, z:0, y:0}, textureFilename = "bricks2.jpg", repeat = 5) {
	let cubeTextureFilename = textureFilename;

	let cubeTexture, cubeMaterial;
	const loader = new THREE.TextureLoader();
	cubeTexture = await loader.loadAsync('../../../assets/textures/' + cubeTextureFilename);
	cubeMaterial = new THREE.MeshStandardMaterial({map: cubeTexture, side: THREE.DoubleSide});

	cubeTexture.wrapS = THREE.RepeatWrapping;
	cubeTexture.wrapT = THREE.RepeatWrapping;
	cubeTexture.repeat.set(repeat,repeat)

	//THREE
	let material = new THREE.BoxGeometry(width,height,depth, 1, 1)
	let mesh = new THREE.Mesh(material, cubeMaterial);
	mesh.name = name;
	mesh.rotation.set(rotation.x, rotation.y, rotation.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1, mesh2) => {
		// mesh1 = this object, mesh2 = colliding object
	};

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

