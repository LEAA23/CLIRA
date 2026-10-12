import * as THREE from "three";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./world/World";
import Resources from "./utils/Resources";
import { GLTFLoader } from "three/examples/jsm/Addons.js";


//Nos va a permitir verificar si ya existe una instancia de Experience, con la finalidad de aplicar singleton
let instance : Experience | null = null;

export default class Experience {
    //Atributos
    canvas!: Element | null;
    sizes!: Sizes;
    time!: Time;
    scene!: THREE.Scene;
    resources!: Resources;
    camera!: Camera;
    renderer!: Renderer;
    world!: World;

    constructor( canvas : Element ) {

        //SINGLETON - Si ya existe una instancia de esta clase entonces la vamos a retornar, si es la primera vez que se instancia entonces la instanciamos
        if( instance ) {
            return instance;
        }

        instance = this;
        window.experience = this;

        //El canvas en donde la simulacion se va a mostrar
        this.canvas = canvas;

        //Intanciamos todos los elementos para que la simulacion funcione
        this.sizes = new Sizes( this.canvas );
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources();
        this.camera = new Camera( this.canvas );
        this.renderer = new Renderer( this.canvas );
        this.world = new World( this.canvas );

        console.log(this.sizes.width + " " + this.sizes.height )

        const loader = new GLTFLoader();
        loader.load("/charite_university_hospital_-_operating_room/scene.gltf", model => {
            this.scene.scale.set(2, 2, 2)
            this.scene.add( model.scene )
        })

        loader.load("/3432cedf3a711e826ceb40a81ee91322.glb", model => {
            model.scene.position.set(0, 0, 1);
            model.scene.scale.set(3, 3, 3)
            this.scene.add( model.scene )
        })


        //Escuchamos al evento de resize atraves de la clase de Size, de forma que mandamos a llamar al metodo de resize
        this.sizes.on("resize", () => {
            this.resize();
        });

        this.time.on("tick", () => {
            this.update();
        })

        
    }

    /**
     * Cundo ocurre el evento de resize en la clase de Sizes lo que hacemos es esuchar ese evento y mandamos a llamar este metodo
     * el cual va a traversear en cada clase que requiera un resize, en este caso las instancias de camara y el renderer
     */
    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    /**
     * Cuando ocurre el evento de update lo que vamos a hacer es escuhar por ese evento y ejecutamos este metodo, el cual va a
     * hacer traversing a traves de cada instancia que requiera una actualizacion
     */
    update() {
        this.camera.update();
        this.renderer.update();
    }
}