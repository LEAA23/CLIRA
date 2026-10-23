import * as THREE from "three";
import Experience from "../Experience";
import type Resources from "../utils/Resources";
import type { GLTF } from "three/examples/jsm/Addons.js";

export default class Patient {
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    resource: GLTF;
    model!: GLTF["scene"];

    constructor( canvas: Element ) {
        this.experience = new Experience( canvas );
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.resource = this.resources.items.patientModel as GLTF;
        this.setModel();
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.position.set(0, 0, 2);
        this.model.scale.set(6, 6, 6);
        this.scene.add( this.model );

        this.model.traverse(child => {
            if( child instanceof THREE.Mesh ) {
                child.castShadow = true;
            }
        })
    }
}