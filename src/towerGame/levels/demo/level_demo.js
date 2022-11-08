
import * as THREE from "three";

import {g_lilGui, g_scene} from "../../myThreeHelper.js";
import {level_demo_build} from "./level_demo_build.js";

export async function level_demo(scene_width, scene_length){

	level_demo_build(scene_width, scene_length)

	let pointLight1 = new THREE.PointLight(0xffffff, 0.5)
	pointLight1.position.y = 40;
	pointLight1.position.x = -50;
	pointLight1.position.z = -30;
	g_scene.add(pointLight1);

	const pointLightFolder = g_lilGui.addFolder( 'Demo level Pointlight' );
	pointLightFolder.add(pointLight1, 'visible').name("On/Off");
	pointLightFolder.add(pointLight1, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	pointLightFolder.addColor(pointLight1, 'color').name("Color");

}