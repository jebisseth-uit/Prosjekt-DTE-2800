
import {createWall_no_windows} from "../../shapes/structures/walls/wall_no_windows.js";
import {createXZPlane} from "../../shapes/primitives/xzplane.js";
import {XZPLANE_SIDELENGTH} from "../../towerGame.js";
import {goalCube} from "../shared/goalCube.js";

export async function level_1_build(scene_width, scene_length, level_height){

	// WALL SETTINGS
	let wallTexture = "metal1.jpg";
	let wallAlphamapTexture = "bricks2_alphamap.jpg";
	let wallTextureRepeat = 4;

	// FLOOR SETTINGS
	let floorTexture = "rocks.jpg"
	let floorTextureRepeat = 10;

	// GOAL POST SETTINGS
	let goalPostLength = 1;
	let goalPostWidth = 1;
	let goalPostHeight = 8;
	let goalPostTexture = "checkered.jpg"
	let goalPostTextureRepeat = 1;
	let goalXPos = -20, goalYPos = 2, goalZPos = 10;


	// Floor
	await createXZPlane(XZPLANE_SIDELENGTH, floorTexture, floorTextureRepeat);

	// Walls
	await createWall_no_windows("wall_left", scene_width, level_height, scene_width*0.01, {x:-scene_width/2, y:level_height/2, z:0}, {x:0, z:0, y:Math.PI/2}, 1, wallTexture, wallAlphamapTexture, wallTextureRepeat)
	await createWall_no_windows("wall_back", scene_length, level_height, scene_width*0.01, {x:0, y:level_height/2, z:-scene_width/2}, {x:0, z:0, y:0},1, wallTexture, wallAlphamapTexture, wallTextureRepeat)
	await createWall_no_windows("wall_right", scene_width, level_height, scene_width*0.01, {x:scene_width/2, y:level_height/2, z:0}, {x:0, z:0, y:Math.PI/2}, 1, wallTexture, wallAlphamapTexture, wallTextureRepeat)
	await createWall_no_windows("wall_front", scene_length, level_height, scene_width*0.01, {x:0, y:level_height/2, z:scene_width/2}, {x:0, z:0, y:0}, 0.15, wallTexture, wallAlphamapTexture, wallTextureRepeat)

	await goalCube("goal", goalPostWidth,goalPostHeight,goalPostLength,{x:goalXPos, y:goalYPos, z:goalZPos}, {x:0, y:0, z:0}, 1, goalPostTexture,"bricks2_alphamap.jpg",goalPostTextureRepeat)

}