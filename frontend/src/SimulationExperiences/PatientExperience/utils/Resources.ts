import { GLTFLoader, RGBELoader, type GLTF } from "three/examples/jsm/Addons.js";
import sources from "../sources";
import EventEmitter from "./EventEmitter";
import { DataTexture, Texture, TextureLoader, type TextureEventMap } from "three";

interface SourceI {
    name: string,
    type: string;
    path: string;
}

interface LoadersI {
    gltfLoader: GLTFLoader,
    textureLoader: TextureLoader,
    hdriLoader: RGBELoader
}

//Esta clase se va a encargar de cargar los Modelos 3D que requeramos
export default class Resources extends EventEmitter {
    sources: SourceI[];
    items: Record<string, GLTF | Texture>;;
    toLoad: number;
    loaded: number;
    loaders!: LoadersI;

    constructor() {
        super();

        //En este atributo vamos a almacenar todos los recursos como texturas, etc.
        this.sources = sources;
        this.items = {};
        //En este almacenamos la cantidad de recursos que vamos a cargar
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.setLoaders();
        this.startLoading();
    }

    //Con este metodo instanciamos todos los loaders necesarios para cargar texturas
    setLoaders() {
        this.loaders = {
            gltfLoader : new GLTFLoader(),
            textureLoader : new TextureLoader(),
            hdriLoader : new RGBELoader()
        }
    }

    startLoading() {
        this.sources.forEach(source => {
            if( source.type === "gltfModel" ) {
                this.loaders.gltfLoader.load(source.path, file => {
                    this.sourceLoaded( source, file );
                });
            }
            else if( source.type === "texture" ) {
                this.loaders.textureLoader.load( source.path, file => {
                    this.sourceLoaded( source, file );
                }  )
            }
            else if( source.type === "hdriEnvironmentMapTexture" ) {
                this.loaders.hdriLoader.load(source.path, file => {
                    this.sourceLoaded( source, file );
                });
            }
        });
    }

    sourceLoaded( source: SourceI, file : DataTexture | GLTF | Texture<HTMLImageElement, TextureEventMap> ) {
        this.items[ source.name ] = file;
        this.loaded++;

        if( this.loaded === this.toLoad ) {
            this.trigger("ready");
        }
    }
}