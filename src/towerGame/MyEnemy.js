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
             const geometry = new THREE.BoxGeometry( 2, 1, 2 );
             const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
             const cube = new THREE.Mesh( geometry, material );
            cube.visible=false
             obj.add( cube );
             obj.add(mesh.scene);
             return obj;
         }, undefined, function ( error ) {
             console.error( error );
         } 
     );
    return obj;
 }
export {loadEnemy,enemyMesh};




