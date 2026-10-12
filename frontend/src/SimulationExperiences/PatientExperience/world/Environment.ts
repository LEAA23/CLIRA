import type { Scene } from "three";
import * as THREE from "three";
import Experience from "../Experience";
import type Resources from "../utils/Resources";

interface EnvironmentMap {
    intensity: number;
    texture:  THREE.Texture<unknown, THREE.TextureEventMap>;
    
}

export default class Environment {
    experience: Experience;
    scene: Scene;
    resources: Resources;
    sunLight!: THREE.DirectionalLight;
    environmentMap!: EnvironmentMap

    constructor( canvas: Element ) {
        this.experience = new Experience( canvas );
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.setSunLight();
    }

    //Este metodo crea una luz que simula la del sol
    setSunLight() {
        this.sunLight = new THREE.DirectionalLight("#ffffff", 5);

        //Activamos la proyeccion de sombras
        this.sunLight.castShadow = true;

        // Configuración de sombras
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.camera.near = 0.1;
        this.sunLight.shadow.camera.far = 20;

        // Reduce los artefactos de sombras
        this.sunLight.shadow.normalBias = 0.03;

        // Suavizado de sombras
        this.sunLight.shadow.radius = 4;

        this.sunLight.position.set(0, 8, 2);

        this.scene.add(this.sunLight);

        // Luz de relleno para reducir las zonas oscuras
        const fillLight = new THREE.HemisphereLight(
            "#ffffff",
            "#b0b0b0",
            2
        );

        this.scene.add(fillLight);
    }
}