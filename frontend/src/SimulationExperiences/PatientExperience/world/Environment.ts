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
        this.setEnvironmentMap();
    }

    //Este metodo crea una luz que simula la del sol
    setSunLight() {
        this.sunLight = new THREE.DirectionalLight( "#ffffff", 4 );
        //Habilitamos la proyeccion de sombras
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set( 1024, 1024 );
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3.5, 2, -1.5);
        this.scene.add( this.sunLight );
    }

    setEnvironmentMap() {
        this.environmentMap = {
            intensity: 0.4,
            texture: this.resources.items.environmentMapTexture
        };

        this.environmentMap.texture.mapping = THREE.EquirectangularReflectionMapping;

        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

        this.scene.background = this.environmentMap.texture;
        this.scene.backgroundRotation.set( 0, -Math.PI * 1/2, 0 );
        this.scene.environment = this.environmentMap.texture;

    }
}