import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Experience from "./Experience";
import type Sizes from "./utils/Sizes";


export default class Camera {
    experience: Experience;
    sizes: Sizes;
    scene: THREE.Scene;
    canvas: Element;
    instance!: THREE.PerspectiveCamera;
    controls!: OrbitControls;

    constructor( canvas: Element ) {
        this.experience = new Experience( canvas );
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = canvas;

        this.setInstance();
        this.setOrbitControls();

    }

    //Este metodo lo que hace es crear la instancia de la camara de THREE.js
    setInstance() {
        this.instance = new THREE.PerspectiveCamera( 35, this.sizes.width / this.sizes.height, 0.1, 100 );
        this.instance.position.set( 6, 4, 8 );
        this.scene.add( this.instance );
    }

    //Este metodo crea los controles para que los usuarios puedan interactuar con la simulacion
    setOrbitControls() {
        this.controls = new OrbitControls( this.instance, this.canvas as HTMLElement );
        //Activamos Damping para tener un arrastre de a simulacion mas suave
        this.controls.enableDamping = true;
    }

    //Este metodo actualiza los valores de la camara cuando ocurre el evento de resize
    resize() {
        //Actualiza el aspecto de la camara
        this.instance.aspect = this.sizes.width / this.sizes.height;
        //Actualiza la matriz de proyeccion que determina como proyectar los modelos 3D en la pantalla 2D
        this.instance.updateProjectionMatrix();
    }

    //Actualiza los controles
    update() {
        this.controls.update();
    }
}