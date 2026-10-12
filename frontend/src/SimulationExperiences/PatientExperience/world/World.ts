import * as THREE from "three";
import Experience from "../Experience";
import type Resources from "../utils/Resources";
import Environment from "./Environment";


export default class World {
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    environment!: Environment;

    constructor( canvas : Element ) {
        this.experience = new Experience( canvas );
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.resources.on("ready", () => {
            this.environment = new Environment( canvas );
        }) 

    }
}