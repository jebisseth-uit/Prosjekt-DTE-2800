import * as THREE from "three";
import {addMeshToScene} from "../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../myAmmoHelper.js";

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.

export async function goalCube(name, width = 1, height = 1, depth = 1, position={x:0, y:0, z:0}, rotation={x:0, z:0, y:0}, opacity = 1, wallMaterialFileName = "bricks2.jpg", wallMaterialAlphaFilename = "bricks2_alphamap.jpg", repeat = 5) {
	const mass = 0; //Merk!
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
	materialBasicAlpahamap.transparent = false;
	bricksTexture.wrapS = THREE.RepeatWrapping;
	bricksTexture.wrapT = THREE.RepeatWrapping;
	bricksTexture.repeat.set(width,height)

	//THREE
	let material = new THREE.BoxGeometry(width,height,depth, 1, 1)
	let mesh = new THREE.Mesh(material, materialBasicAlpahamap);
	materialBasicAlpahamap.opacity = opacity;
	mesh.name = 'wall';
	mesh.rotation.set(rotation.x, rotation.y, rotation.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1, mesh2) => {
		// mesh1 = this object, mesh2 = colliding object
		if (mesh2.name === "player"){
			levelFinished();
		}
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
