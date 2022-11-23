import * as THREE from "three";
import {addMeshToScene} from "./myThreeHelper.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "./myAmmoHelper.js";
import { moveRigidBody,applyImpulse} from "./myAmmoHelper.js";
import { g_scene } from "./myThreeHelper.js";
const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;     
const manager    = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(manager); 
let object3d=new THREE.Object3D(),enemyObj=[];
const pos = [{x:-45,y:5,z:-45}, {x:-1,y:5,z:-45},{x:45,y:5,z:-45},
            //  {x:-45,y:5,z:0},{x:-0,y:5,z:0},{x:45,y:5,z:0},
            // {x:-45,y:5,z:45},{x:-0,y:5,z:45},{x:45,y:5,z:45},
]
let isDie=[];
let points=0;
export default class MyEnemy{
    constructor(){

    }
    loadEnemy = ()=>{
        gltfLoader.load('../../../model/face.glb',(gltf )=>{
               const mesh = gltf;
                mesh.scene.position.set(0,0,0);
                mesh.scene.scale.set(.2,.2,.2);
                object3d.add(mesh.scene);
                // const geometry = new THREE.BoxGeometry( 2.5,5,2.5);
                // const material = new THREE.MeshBasicMaterial("cube_mat", {color: 0x00ff00} );
                // const cube = new THREE.Mesh( geometry, material );
                // object3d.add(cube);
                this.createEnemy();
             }, undefined, function ( error ) {
                 console.error( error );
             } 
         );
     }
     createEnemy=()=>{
        const enemat = new THREE.MeshStandardMaterial("enemat");
        for(let i=0;i<pos.length;i++){
            
            enemyObj[i] = object3d.clone();
            enemyObj[i].traverse( function (node){
                if(node.isMesh){
                    if(i>0){    
                        const mat = enemat.clone("ene_mat");     
                        mat.color =  new THREE.Color(Math.random(0,1),Math.random(0,1),Math.random(0,1));
                        node.material = mat;
                    }
                    else{
                        enemat.color =  new THREE.Color(Math.random(0,1),Math.random(0,1),Math.random(0,1));
                        node.material = enemat;
                    }
                }
            });
            const x = pos[i].x;
            const z = pos[i].z;
            enemyObj[i].position.set(x,pos[i].y,z);
            const mass = 10;
            const position={x:x, y:5,z:z};
            const shape     = new Ammo.btBoxShape( new Ammo.btVector3(1.25,2.5,1.25));
            shape.setMargin( 0.05 );
            const rigidBody = createAmmoRigidBody(shape,enemyObj[i], 0.2,.2,position,mass);
            enemyObj[i].userData.physicsBody = rigidBody;
            g_ammoPhysicsWorld.addRigidBody(
                rigidBody,
                COLLISION_GROUP_BOX,
                COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE
            );
            g_rigidBodies.push(enemyObj[i]);
            rigidBody.threeMesh = enemyObj[i];
            addMeshToScene(enemyObj[i]);
        }
        this.reset();
        this.updateEnemy();
    }
    updateEnemy=()=>{
        setInterval(() => {
            const player = g_scene.getObjectByName("movable");
            for(let i=0;i<pos.length;i++){
                    let scalingFactor = 10;
                    const random = randomInt(0,3);
                    let z=0,x=0;
                     switch(random){
                        case 0:
                            z = randomInt(10,40);
                            x = randomInt(-40,-10);
                            break;
                        case 1:
                            x = randomInt(10,40);
                            z = randomInt(-40,-10);
                            break;
                        default:
                            x = player.position.x;
                            z = player.position.z;
                            break;   
                     }   
                    let aa   = z - enemyObj[i].position.z;
                    let bb   = x - enemyObj[i].position.x;
                    let _ang = GetAngle(aa,bb);
                    const vx  =  Math.sin(_ang);
                    const vz  =  Math.cos(_ang);
                    let resultantImpulse = new Ammo.btVector3( vx, 0, vz )
                    resultantImpulse.op_mul(scalingFactor);
                    let physicsBody = enemyObj[i].userData.physicsBody;
                    physicsBody.setLinearVelocity(resultantImpulse);
                    this.checkPoints(player.position,enemyObj[i].position,i);
                    
            }
        }, 1000);
    }
    checkPoints(a,b,i){
        let d = Number(a.distanceTo( b ));
        if(d<=7 && !isDie[i]){
            enemyObj[i].visible = false;
            isDie[i] = true;
            points++;
            const score = "Game Score:"+points;
            document.getElementById("gamescore").innerHTML = score;
        }
    };
    reset(){
        for(let i=0;i<pos.length;i++){
            isDie[i] = false;
            enemyObj[i].visible = true;
        }
        points=0;    
    }
}
function randomInt(min,max){
  let no =Math.floor(min+Math.random()*max); 
  return no;
}
const GetAngle=(d,e)=>{
    if(d==0)
      return e>=0 ? Math.PI/2 : -Math.PI/2;

      
    else if (d > 0)
      return Math.atan(e/d);
    else
      return Math.atan(e/d) + Math.PI;
}
const degreeToRadians = (degrees)=> {
	return degrees * Math.PI / 180;
}
const radianToDegrees = (radians)=> {
	return radians * 180 / Math.PI;
}
 


