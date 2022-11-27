//ligger litt funksjonalitet i denne file vi er usikre på om vi vil bruke, ligger kommetert ut.
import * as THREE from "three";
import {addMeshToScene,g_scene} from "./myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies,removeBody} from "./myAmmoHelper.js";
import {score} from './towerGame';

let g_xzPlaneSideLength=100;
const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_BOX = 8;

export const FACE_ENEMY=0,HORSE_ENEMY=1,DIANAUSER_ENEMY=3;
let points=0;
let currentScoreIndex = -4;


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
    constructor(enemy_mesh,eneyno,enemy_type,speed){
        this.enemyObj=[];     
        this.isDie=[];
        this.enemyType = enemy_type;
        this.speed = speed;
        this.create(enemy_mesh,eneyno);
    }

    create(enemy_mesh,eneyno){
        for(let i=0;i<eneyno;i++){
          //this.enemyObj[i] = enemy_mesh.clone();
            this.enemyObj.push(enemy_mesh.clone());
            this.isDie.length = this.enemyObj.length;
            this.enemyObj[i].velocity  = new Ammo.btVector3( 0, 0, 0 );
            this.enemyObj[i].traverse((child)=>{
                 if(child.isMesh){
                     child.castShadow =true;
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
            const mass = 2;
            const position={x:x, y:this.enemyObj[i].position.y,z:z};
            const shape     = new Ammo.btBoxShape( new Ammo.btVector3(1,1,1));
            shape.setMargin( 0.05 );
            const rigidBody = createAmmoRigidBody(shape,this.enemyObj[i], 0.2,.2,position,mass);
            this.enemyObj[i].userData.physicsBody = rigidBody;
            g_ammoPhysicsWorld.addRigidBody(
                rigidBody,
                COLLISION_GROUP_SPHERE,
                COLLISION_GROUP_BOX|
                COLLISION_GROUP_SPHERE |
                COLLISION_GROUP_PLANE
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
             this.enemyObj[i].collisionResponse = (mesh1,mesh2) => {
                 if(mesh2.name === "projectile"){
                     const player = g_scene.getObjectByName("projectile");
                     this.checkPoints(player.position,this.enemyObj[i].position,i);
                 }

             };
         }
         currentScoreIndex++;
         points=0;
     }

    updateEnemy(){
       // let dis = 0;
        setInterval(() => {
            const player = g_scene.getObjectByName("player");
            for(let i=0;i<this.enemyObj.length;i++){
            if(!this.enemyObj[i].userData.physicsBody)
                return;
                /*let scalingFactor = 15;
                let random = randomInt(0,10);
                const dis = Number(player.position.distanceTo(this.enemyObj[i]));
                if(dis<100)
                    random = 6;
                this.count[i]++;

                let z=0,x=0;

                switch(random){
                    case 0:
                        x = randomInt(-40,-30);
                        z = randomInt(-40,-30);
                        break;
                    case 1:
                        x = randomInt(-30,-20);
                        z = randomInt(-30,-20);
                        break;
                    case 2:
                        x = randomInt(-20,-10);
                        z = randomInt(-20,-10);
                        break;
                    case 3:
                        x = randomInt(30,40);
                        z = randomInt(30,40);
                        break;
                    case 4:
                        x = randomInt(20,30);
                        z = randomInt(20,30);
                        break;
                    case 5:
                        x = randomInt(10,20);
                        z = randomInt(10,20);
                        break;
                    default:
                        x = player.position.x;
                        z = player.position.z;
                        break;
                }
                let aa   = z - this.enemyObj[i].position.z;
                let bb   = x - this.enemyObj[i].position.x;
                let _ang = GetAngle(aa,bb);
                const vx  = Math.sin(_ang);
                const vz  = Math.cos(_ang);
                let velocity = new Ammo.btVector3( vx, 0, vz )
                let stand = randomInt(0,20);
                if(stand>12)
                */

                const dis = Number(player.position.distanceTo(this.enemyObj[i].position));
                //this.velocity[i] = new Ammo.btVector3( 0, 0, 0 );
                if(dis<20){
                    let x = player.position.x;
                    let z = player.position.z;
                    let aa   = z - this.enemyObj[i].position.z;
                    let bb   = x - this.enemyObj[i].position.x;
                    let _ang = GetAngle(aa,bb);
                    const vx  =  Math.sin(_ang);
                    const vz  =  Math.cos(_ang);
                    // this.velocity[i] = new Ammo.btVector3( vx, 0, vz );
                    this.enemyObj[i].velocity = new Ammo.btVector3( vx, 0, vz );
                }


                this.enemyObj[i].velocity.op_mul(this.speed);
                let physicsBody = this.enemyObj[i].userData.physicsBody;
                physicsBody.setLinearVelocity(this.enemyObj[i].velocity);

            }
        }, 1000/60);
    }

     checkPoints(a,b,i){
         let d = Number(a.distanceTo( b ));
         if(d<=7 && !this.isDie[i]){
             this.enemyObj[i].visible = false;
             this.isDie[i] = true;
             if(g_rigidBodies[i] === this.enemyObj[i])
                 g_rigidBodies.splice(i,1);
             if(this.enemyObj[i].userData.physicsBody){
                 removeBody(this.enemyObj[i].userData.physicsBody);
                 console.log(this.enemyObj[i].userData.physicsBody.getMotionState());
             }
             points++;
             document.getElementById("gamescore").textContent = "Score: "+points;
             score.total = points;
             const newScores = JSON.parse(localStorage.getItem("scores") || "[]");
             if (currentScoreIndex === -1) {
                 currentScoreIndex = newScores.length;
             }
             newScores[currentScoreIndex] = points;
             localStorage.setItem("scores", JSON.stringify(newScores));
         }
     }

 }

 


