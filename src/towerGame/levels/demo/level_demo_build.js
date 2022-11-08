
import {createWall_no_windows} from "../../shapes/structures/walls/wall_no_windows.js";

export async function level_demo_build(scene_width, scene_length, level_height){

	await createWall_no_windows("wall_left", scene_width, level_height, scene_width*0.01, {x:-scene_width/2, y:level_height/2, z:0}, {x:0, z:0, y:Math.PI/2})
	await createWall_no_windows("wall_back", scene_length, level_height, scene_width*0.01, {x:0, y:level_height/2, z:-scene_width/2}, {x:0, z:0, y:0})
	await createWall_no_windows("wall_right", scene_width, level_height, scene_width*0.01, {x:scene_width/2, y:level_height/2, z:0}, {x:0, z:0, y:Math.PI/2})
	await createWall_no_windows("wall_front", scene_length, level_height, scene_width*0.01, {x:0, y:level_height/2, z:scene_width/2}, {x:0, z:0, y:0}, 0.15)

}