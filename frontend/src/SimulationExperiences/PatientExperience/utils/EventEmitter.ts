type Callback = (...args: any[]) => any;

interface EventName {
    original: string;
    value: string;
    namespace: string;
}

interface CallbackNamespace {
    [eventName: string]: Callback[];
}

interface Callbacks {
    [namespace: string]: CallbackNamespace;
}

export default class EventEmitter {
    callbacks: Callbacks;

    constructor() {
        this.callbacks = {
            base: {}
        };
    }

    on(_names: string, callback: Callback): this | false {
        // Errors
        if (typeof _names === "undefined" || _names === "") {
            console.warn("wrong names");
            return false;
        }

        if (typeof callback === "undefined") {
            console.warn("wrong callback");
            return false;
        }

        // Resolve names
        const names = this.resolveNames(_names);

        // Each name
        names.forEach((_name) => {
            // Resolve name
            const name = this.resolveName(_name);

            // Create namespace if it does not exist
            if (!(this.callbacks[name.namespace] instanceof Object)) {
                this.callbacks[name.namespace] = {};
            }

            // Create callback array if it does not exist
            if (!(this.callbacks[name.namespace][name.value] instanceof Array)) {
                this.callbacks[name.namespace][name.value] = [];
            }

            // Add callback
            this.callbacks[name.namespace][name.value].push(callback);
        });

        return this;
    }

    off(_names: string): this | false {
        // Errors
        if (typeof _names === "undefined" || _names === "") {
            console.warn("wrong name");
            return false;
        }

        // Resolve names
        const names = this.resolveNames(_names);

        // Each name
        names.forEach((_name) => {
            // Resolve name
            const name = this.resolveName(_name);

            // Remove namespace
            if (name.namespace !== "base" && name.value === "") {
                delete this.callbacks[name.namespace];
            } else {
                // Default namespace
                if (name.namespace === "base") {
                    // Try to remove from each namespace
                    for (const namespace in this.callbacks) {
                        if (
                            this.callbacks[namespace] instanceof Object &&
                            this.callbacks[namespace][name.value] instanceof Array
                        ) {
                            delete this.callbacks[namespace][name.value];

                            // Remove namespace if empty
                            if (
                                Object.keys(this.callbacks[namespace]).length === 0
                            ) {
                                delete this.callbacks[namespace];
                            }
                        }
                    }
                }
                // Specified namespace
                else if (
                    this.callbacks[name.namespace] instanceof Object &&
                    this.callbacks[name.namespace][name.value] instanceof Array
                ) {
                    delete this.callbacks[name.namespace][name.value];

                    // Remove namespace if empty
                    if (
                        Object.keys(this.callbacks[name.namespace]).length === 0
                    ) {
                        delete this.callbacks[name.namespace];
                    }
                }
            }
        });

        return this;
    }

    trigger(_name: string, _args: unknown[] = []): unknown {
        // Errors
        if (typeof _name === "undefined" || _name === "") {
            console.warn("wrong name");
            return false;
        }

        let finalResult: unknown = null;
        let result: unknown = null;

        // Default args
        const args = Array.isArray(_args) ? _args : [];

        // Resolve name
        const names = this.resolveNames(_name);
        const name = this.resolveName(names[0]);

        // Default namespace
        if (name.namespace === "base") {
            // Try to find callback in each namespace
            for (const namespace in this.callbacks) {
                const callbacks = this.callbacks[namespace][name.value];

                if (Array.isArray(callbacks)) {
                    callbacks.forEach((callback) => {
                        result = callback.apply(this, args);

                        if (typeof finalResult === "undefined") {
                            finalResult = result;
                        }
                    });
                }
            }
        }
        // Specified namespace
        else if (this.callbacks[name.namespace] instanceof Object) {
            if (name.value === "") {
                console.warn("wrong name");
                return this;
            }

            const callbacks = this.callbacks[name.namespace][name.value];

            if (Array.isArray(callbacks)) {
                callbacks.forEach((callback) => {
                    result = callback.apply(this, args);

                    if (typeof finalResult === "undefined") {
                        finalResult = result;
                    }
                });
            }
        }

        return finalResult;
    }

    resolveNames(_names: string): string[] {
        let names = _names;

        names = names.replace(/[^a-zA-Z0-9 ,/.]/g, "");
        names = names.replace(/[,/]+/g, " ");
        names = names.split(" ").filter(Boolean).join(" ");

        return names.split(" ");
    }

    resolveName(name: string): EventName {
        const parts = name.split(".");

        const newName: EventName = {
            original: name,
            value: parts[0],
            namespace: "base"
        };

        // Specified namespace
        if (parts.length > 1 && parts[1] !== "") {
            newName.namespace = parts[1];
        }

        return newName;
    }
}