import * as THREE from "three";
import {addMeshToScene,g_scene} from "./myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "./myAmmoHelper.js";
const  enemyObj=[],isDie=[];
let g_xzPlaneSideLength=100;
const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;     
let points=0;
let currentScoreIndex = -2;
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

const createEnemy = (enemy_mesh,eneyno) => {
    //enemyObj.length = eneyno;
    //isDie.length = eneyno;
    const enemat = new THREE.MeshStandardMaterial("enemat");
    for(let i=0;i<eneyno;i++){
        //enemyObj[i] = enemy_mesh.clone();
        enemyObj.push(enemy_mesh.clone());
        isDie.length = enemyObj.length;
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
        const x = -(g_xzPlaneSideLength/2) + Math.random() * g_xzPlaneSideLength;
        const z = -(g_xzPlaneSideLength/2) + Math.random() * g_xzPlaneSideLength;
        enemyObj[i].position.set(x,2,z);
        const mass = 10;
        const position={x:x, y:enemyObj[i].position.y,z:z};
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

    console.log(enemyObj.length);
    reset();

    updateEnemy();
}
const updateEnemy=()=>{
    setInterval(() => {
        const player = g_scene.getObjectByName("player");
        for(let i=0;i<enemyObj.length;i++){

                console.log(enemyObj.length,"3333333333333333333    "+i);
                if(!enemyObj[i].userData.physicsBody)
                   return;

            console.log(enemyObj.length,"###################################  "+i);
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
                let velocity = new Ammo.btVector3( vx, 0, vz )
                velocity.op_mul(scalingFactor);
                let physicsBody = enemyObj[i].userData.physicsBody;
                physicsBody.setLinearVelocity(velocity);
                checkPoints(player.position,enemyObj[i].position,i);
                
        }
    }, 1000);
}
const checkPoints= (a,b,i)=>{
    let d = Number(a.distanceTo( b ));
    if(d<=7 && !isDie[i]){
        enemyObj[i].visible = false;
        isDie[i] = true;
        points++;
        document.getElementById("gamescore").textContent = "Score: "+points;
        const newScores = JSON.parse(localStorage.getItem("scores") || "[]");
        if (currentScoreIndex === -1) {
            currentScoreIndex = newScores.length;
        }
        newScores[currentScoreIndex] = points;
        localStorage.setItem("scores", JSON.stringify(newScores));
    }
};
const reset=()=>{
    for(let i=0;i<enemyObj.length;i++){
        isDie[i] = false;
        enemyObj[i].visible = true;
    }
    currentScoreIndex++;
    points=0;    
}

export {createEnemy};

