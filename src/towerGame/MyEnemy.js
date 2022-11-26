import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const manager    = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(manager); 
let enemyMesh=new THREE.Object3D();
const loadEnemy = (path,scal)=>{
    const obj = new THREE.Object3D();
     gltfLoader.load(path,(gltf )=>{
           const mesh = gltf;
            mesh.scene.position.set(0,0,0);
            mesh.scene.scale.set(scal.x,scal.y,scal.z);
            //enemyMesh.add(mesh.scene);
             obj.add(mesh.scene);
             return obj;
         }, undefined, function ( error ) {
             console.error( error );
         } 
     );
    return obj;
 }
export {loadEnemy,enemyMesh};




