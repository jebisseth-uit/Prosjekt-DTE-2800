//Tok utgangspunkt i pendel fra eksempel DEL4 ammoConstraints, hingedarm.js

import * as THREE from "three";
import {addMeshToScene} from "../../myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "../../myAmmoHelper.js";

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_MOVEABLE = 4;
const COLLISION_GROUP_BOX = 8;       //..osv. legg til etter behov.


export function createHingedArm(mass = 10, color=0x00FF00, position={x:0, y:50, z:0}) {

    const rigidBodyArm = createArm();
    const rigidBodyAnchor = createAnchor();
    const armLength = rigidBodyArm.threeMesh.geometry.parameters.width;
    //AMMO, hengsel: SE F.EKS: https://www.panda3d.org/manual/?title=Bullet_Constraints#Hinge_Constraint:
    const anchorPivot = new Ammo.btVector3( 0, 0.5, 0 );
    const anchorAxis = new Ammo.btVector3(0,0,1);
    const armPivot = new Ammo.btVector3( - armLength/2, 0, 0 );
    const armAxis = new Ammo.btVector3(0,0,1);
    const hingeConstraint = new Ammo.btHingeConstraint(
        rigidBodyAnchor,
        rigidBodyArm,
        anchorPivot,
        armPivot,
        anchorAxis,
        armAxis,
        false
    );

    const lowerLimit = -Math.PI;
    const upperLimit = Math.PI;
    const softness = 0;
    const biasFactor = 0;
    const relaxationFactor = 0;
    hingeConstraint.setLimit( lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
    hingeConstraint.enableAngularMotor(true, 0, 0);
    g_ammoPhysicsWorld.addConstraint( hingeConstraint, false );

    // NB! LA STÅ!
    // Se: https://pybullet.org/Bullet/phpBB3/viewtopic.php?t=4145
    // og: https://gamedev.stackexchange.com/questions/71436/what-are-the-parameters-for-bthingeconstraintsetlimit
    /*
    void btHingeConstraint::setLimit    (
        btScalar    low,
        btScalar    high,
        btScalar    _softness = 0.9f,
        btScalar    _biasFactor = 0.3f,
        btScalar    _relaxationFactor = 1.0f
    )
    The parameters low and high are the angles restricting the hinge.
      The angle between the two bodies stays in that range.
      For no restriction, you pass a lower limit <= -pi and an upper limit >= pi here. This might be useful for things that rotate completely around other things, for example wheels on a car. For the other three parameters, I can only guess, so I don't claim this answer is complete.
      _softness
                might be a negative measure of the friction that determines how much the
                hinge rotates for a given force. A high softness would make the hinge rotate
                easily like it's oiled then.
      _biasFactor
                might be an offset for the relaxed rotation of the hinge.
                It won't be right in the middle of the low and high angles anymore. 1.0f is the neural value.
      _relaxationFactor
                might be a measure of how much force is applied internally to bring
                the hinge in its central rotation. This is right in the middle of the
                low and high angles. For example, consider a western swing door.
                After walking through it will swing in both directions but at
                the end it stays right in the middle.
    */


    g_ammoPhysicsWorld.addConstraint( hingeConstraint, false );
}

function createArm() {
    const mass=10;
    const width=10, height=1, depth=1;
    const position={x:0, y:0, z:0}



    //THREE
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width,height,depth, 1, 1),
        new THREE.MeshStandardMaterial({color: 0x000000}));
    mesh.name = 'hinge_arm';
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const direction = new THREE.Vector3();
    mesh.getWorldDirection(direction);  // NB! worldDIRECTION! Gir en vektor som peker mot +Z. FRA DOC: Returns a vector representing the direction of object's positive z-axis in world space.
    //addArrowHelper(mesh, direction.normalize(), new THREE.Vector3( 0, 0, 0 ), 'worlddirection_arrow', 0xff0000, 5);

    //AMMO
    const mesh_width = mesh.geometry.parameters.width;    //(er her overflødig)
    const mesh_height = mesh.geometry.parameters.height;  //(er her overflødig)
    const mesh_depth = mesh.geometry.parameters.depth;    //(er her overflødig)

    const shape = new Ammo.btBoxShape( new Ammo.btVector3( mesh_width/2, mesh_height/2, mesh_depth/2) );
    shape.setMargin( 0.05 );
    const rigidBody = createAmmoRigidBody(shape, mesh, 0, 0.0, position, mass);
    rigidBody.setDamping(0, 0);
    rigidBody.setActivationState(4);
    mesh.userData.physicsBody = rigidBody;

    // Legger til physics world:
    g_ammoPhysicsWorld.addRigidBody(
        rigidBody,
        COLLISION_GROUP_BOX,
        COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE
    );

    addMeshToScene(mesh);
    g_rigidBodies.push(mesh);
    rigidBody.threeMesh = mesh;

    return rigidBody;
}

function createAnchor(color=0x000000) {
    const radius = 1;
    const position={x:-20, y:30, z:0};
    const mass = 0;

    //THREE
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
        new THREE.MeshStandardMaterial({color: color, transparent: true, opacity: 0.5}));
    mesh.name = 'hinge_anchor';
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.collisionResponse = (mesh1) => {
        mesh1.material.color.setHex(Math.random() * 0x000000);
    };
    //AMMO
    const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
    shape.setMargin( 0.05 );
    const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
    mesh.userData.physicsBody = rigidBody;
    g_ammoPhysicsWorld.addRigidBody(
        rigidBody,
        rigidBody,
        COLLISION_GROUP_BOX,
        COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE );
    g_rigidBodies.push(mesh);
    rigidBody.threeMesh = mesh;

    addMeshToScene(mesh);
    g_rigidBodies.push(mesh);
    rigidBody.threeMesh = mesh;

    return rigidBody;
}

export function pushHingedArm(mesh, direction) {
    //if (!mesh.userData.physicsBody)
    //    return;
    //const rigidBody = mesh.userData.physicsBody;
    //rigidBody.activate(true);
    // Gir impuls ytterst på armen:s
    const armWidth = mesh.geometry.parameters.width;
    const relativeVector = new Ammo.btVector3(armWidth/2, 0, 0);
    const impulseVector = new Ammo.btVector3(10*direction.x, 0, 10*direction.z);
    rigidBody.applyImpulse(impulseVector, relativeVector);
}
