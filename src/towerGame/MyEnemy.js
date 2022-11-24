import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const manager    = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(manager); 
let enemyMesh=new THREE.Object3D();
const loadEnemy = ()=>{
    gltfLoader.load('../../../model/face.glb',(gltf )=>{
           const mesh = gltf;
            mesh.scene.position.set(0,0,0);
            mesh.scene.scale.set(.2,.2,.2);
            enemyMesh.add(mesh.scene);
         }, undefined, function ( error ) {
             console.error( error );
         } 
     );
 }
export {loadEnemy,enemyMesh};


 


