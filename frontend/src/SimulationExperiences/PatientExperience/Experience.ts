

//Nos va a permitir verificar si ya existe una instancia de Experience, con la finalidad de aplicar singleton
let instance : Experience | null = null;

export default class Experience {
    //Atributos
    canvas!: HTMLCanvasElement;

    constructor( canvas : HTMLCanvasElement ) {

        //SINGLETON - Si ya existe una instancia de esta clase entonces la vamos a retornar, si es la primera vez que se instancia entonces la instanciamos
        if( instance ) {
            return instance;
        }

        instance = this;
        window.experience = this;

        //El canvas en donde la simulacion se va a mostrar
        this.canvas = canvas;
    }
}