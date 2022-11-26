import * as THREE from "three";
import {addMeshToScene,g_scene} from "./myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "./myAmmoHelper.js";
let g_xzPlaneSideLength=100;
const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;

export const FACE_ENEMY=0,HORSE_ENEMY=1,DIANAUSER_ENEMY=3;
let points=0;
let currentScoreIndex = -2;


const randomInt=(min,max)=>{
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
  const enemat = new THREE.MeshStandardMaterial("enemat");
 export default class Enemy{
    constructor(enemy_mesh,eneyno,enemy_type){
        this.enemyObj=[];     
        this.isDie=[];
        this.enemyType = enemy_type;
        this.create(enemy_mesh,eneyno);
    }

    create(enemy_mesh,eneyno){
        for(let i=0;i<eneyno;i++){
          //this.enemyObj[i] = enemy_mesh.clone();
            this.enemyObj.push(enemy_mesh.clone());
            this.isDie.length = this.enemyObj.length;
            this.enemyObj[i].traverse((child)=>{
                 if(child.isMesh){
                     switch (this.enemyType){
                         case FACE_ENEMY:
                             const mat = enemat.clone("ene_mat");
                             mat.color =  new THREE.Color(Math.random(0,1),Math.random(0,1),Math.random(0,1));
                             child.material = mat;
                             break;
                         case HORSE_ENEMY:
                             break
                         case DIANAUSER_ENEMY:
                             break;
                     }
                 }
            });
            const x = -(g_xzPlaneSideLength/2) + Math.random() * g_xzPlaneSideLength;
            const z = -(g_xzPlaneSideLength/2) + Math.random() * g_xzPlaneSideLength;
            this.enemyObj[i].position.set(x,2,z);
            const mass = 10;
            const position={x:x, y:this.enemyObj[i].position.y,z:z};
            const shape     = new Ammo.btBoxShape( new Ammo.btVector3(1.25,2.5,1.25));
            shape.setMargin( 0.05 );
            const rigidBody = createAmmoRigidBody(shape,this.enemyObj[i], 0.2,.2,position,mass);
            this.enemyObj[i].userData.physicsBody = rigidBody;
            g_ammoPhysicsWorld.addRigidBody(
                rigidBody,
                COLLISION_GROUP_BOX,
                COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE
            );
            g_rigidBodies.push(this.enemyObj[i]);
            rigidBody.threeMesh = this.enemyObj[i];
            addMeshToScene(this.enemyObj[i]);
        }
        this.reset();
        this.updateEnemy();
    }
    reset(){
        for(let i=0;i<this.enemyObj.length;i++){
            this.isDie[i] = false;
            this.enemyObj[i].visible = true;
        }
        currentScoreIndex++;
        points=0;    
    }
    updateEnemy(){
        setInterval(() => {
            const player = g_scene.getObjectByName("player");
            for(let i=0;i<this.enemyObj.length;i++){
            if(!this.enemyObj[i].userData.physicsBody)
                return;
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
                let aa   = z - this.enemyObj[i].position.z;
                let bb   = x - this.enemyObj[i].position.x;
                let _ang = GetAngle(aa,bb);
                const vx  =  Math.sin(_ang);
                const vz  =  Math.cos(_ang);
                let velocity = new Ammo.btVector3( vx, 0, vz )
                velocity.op_mul(scalingFactor);
                let physicsBody = this.enemyObj[i].userData.physicsBody;
                physicsBody.setLinearVelocity(velocity);
                this.checkPoints(player.position,this.enemyObj[i].position,i);
            }
        }, 1000);
    }
    checkPoints(a,b,i){
        let d = Number(a.distanceTo( b ));
        if(d<=7 && !this.isDie[i]){
            this.enemyObj[i].visible = false;
            this.isDie[i] = true;
            points++;
            document.getElementById("gamescore").textContent = "Score: "+points;
            const newScores = JSON.parse(localStorage.getItem("scores") || "[]");
            if (currentScoreIndex === -1) {
                currentScoreIndex = newScores.length;
            }
            newScores[currentScoreIndex] = points;
            localStorage.setItem("scores", JSON.stringify(newScores));
        }
    }
 }

 


