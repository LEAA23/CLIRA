import EventEmitter from "./EventEmitter";


export default class Sizes extends EventEmitter {
    width: number;
    height: number;
    pixelRatio: number;

    constructor( canvas: Element ) {
        //Heredamos todos los metodos y atributos de la clase EventEmitter
        super();

        //Tomamos las medidas del canvas en donde se va a mostrar la simulacion del paciente
        this.width = canvas.getBoundingClientRect().width;
        this.height = canvas.getBoundingClientRect().height;
        //Obtenemos la tasa de pixeles del dispositivo
        this.pixelRatio = Math.min( window.devicePixelRatio, 2 );
        
        console.log(this.width + " " + this.height )


        //Actualizamos las medidas cuando ocurra el evento de resize
        window.addEventListener( "resize", () => {
            this.width = canvas.getBoundingClientRect().width;
            this.height = canvas.getBoundingClientRect().height;
            this.pixelRatio = Math.min( window.devicePixelRatio, 2 );

            console.log(this.width + " " + this.height )

            //Notificamos a la clase de experience que un resize ha ocurrido
            this.trigger("resize");
        } );
    }
}