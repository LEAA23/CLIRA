import * as THREE from "three";
import type Camera from "./Camera";
import Experience from "./Experience";
import type Sizes from "./utils/Sizes";


export default class Renderer {
    experience: Experience;
    canvas: Element | null;
    sizes: Sizes;
    camera: Camera;
    scene: THREE.Scene;
    instance!: THREE.WebGLRenderer;

    constructor( canvas: Element ) {
        this.experience = new Experience( canvas );
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;

        this.setInstance();

        
        
    }

    //Con este metodo lo que hacemos es crear una instancia de WebGLRenderer para poder renderizar la simulacion del paciente
    setInstance() {
        //Recibe el canvas donde se va a renderizar y pasamos antialias con true para que mejore la calidad del renderizado en el modelo.
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas as HTMLElement,
            antialias: true
        });

        this.instance.toneMapping = THREE.CineonToneMapping;
        this.instance.toneMappingExposure = 1.75;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = THREE.PCFShadowMap;
        this.instance.setClearColor("#211d20");
        this.instance.setSize( this.sizes.width, this.sizes.height );
        this.instance.setPixelRatio( this.sizes.pixelRatio );

    }

    //Con este metodo lo que hacemos es adecuar el render al tamnio del canvas cuando ocurre un resize
    resize() {
        this.instance.setSize( this.sizes.width, this.sizes.height );
        this.instance.setPixelRatio( this.sizes.pixelRatio );
    }


    update() {
        this.instance.render( this.scene, this.camera.instance );
    }
}