import * as THREE from "three";
import Experience from "../Experience";
import type Resources from "../utils/Resources";
import type { GLTF } from "three/examples/jsm/Addons.js";

export default class HospitalRoom {
    experience: Experience;
    scene: THREE.Scene;
    resources: Resources;
    resource: GLTF;
    model!: GLTF["scene"];

    constructor( canvas: Element ) {
        this.experience = new Experience( canvas );
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.resource = this.resources.items.hospitalRoomModel as GLTF;

        this.setModel();
    }

    setModel() {
        this.model = this.resource.scene;
        
        this.model.scale.set( 2, 2, 2 );
        this.scene.add( this.model );

        this.model.traverse(child => {
            if( child instanceof THREE.Mesh ) {
                child.castShadow = true;
            }
        })
    }
}