import EventEmitter from "./EventEmitter";


export default class Time extends EventEmitter {
    start: number;
    current: number;
    elapsedTime: number;
    delta: number;

    constructor() {
        super();

        this.start = Date.now();
        this.current = this.start;
        this.elapsedTime = 0;
        //En pantallas de 60fps cada frame es por cada 16 milisegundos
        this.delta = 16;

        //Esperamos a que suceda el primer frame para evitar un bug
        window.requestAnimationFrame(() => {
            this.tick();
        })
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsedTime = this.current - this.start;

        this.trigger("tick");

        window.requestAnimationFrame(() => {
            this.tick();
        })
    }
}