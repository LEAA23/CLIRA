import type { Scene } from "three";
import Experience from "../Experience";
import type Resources from "../utils/Resources";


export default class HospitalRoom {
    experience: Experience;
    scene: Scene;
    resources: Resources;

    constructor( canvas: Element ) {
        this.experience = new Experience( canvas );
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.resource = this.resources.items.hospitalRoomModel
    }
}