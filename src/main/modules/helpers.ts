/**
 * Creates a new HTML element
 * @param tag HTML tag of the element
 * @param classes Class or classes to assign to the element
 * @param id ID to assign to the element
 * @param source If `<img>`, `<video>`, `<audio>`, etc., set the source URL for the resource
 * @returns Newly created element
 */
export function mkelem<T extends keyof HTMLElementTagNameMap>(tag: T, classes?: string | string[] | null, id?: string | null, source?: string | null): HTMLElementTagNameMap[T] {
    let elem = document.createElement(tag);

    if(typeof classes === "object" && classes instanceof Array)
        classes.forEach(c => {
            elem.classList.add(c)
        }); 

    else if(typeof classes === "string") elem.classList.add(classes);

    if(typeof id === "string") elem.id = id;
    if(typeof source === "string" && elem instanceof HTMLImageElement) elem.src = source;

    return elem;
}

/**
 * Search for HTML elements (alias for `querySelector` and `querySelectorAll`)
 * @param selector A CSS selector to query
 * @param all Search for all results (default: `false`)
 * @returns The HTML element(s) found
 */
export function elem<T extends HTMLElement, E extends boolean = false>(
    selector: string, options?: { all?: E, root?: HTMLElement | Document}
): E extends true? NodeListOf<T>: T

export function elem<T extends HTMLElement>( selector: string, { all, root = document }: { all?: boolean, root?: HTMLElement | Document } = {}): NodeListOf<T> | T  {
    if(all) {
        return root.querySelectorAll<T>(selector);
    }

    return root.querySelector<T>(selector)!;
}

/**
 * HTML-escapes a string
 * @param txt String to escape
 * @returns Escaped string
 */
export function esc(txt: string): string {
    let el = mkelem("p");
    el.innerText = txt;

    return el.innerHTML;
}

/**
 * Add event listener to a HTML element (alias for `el.addEventListener(ev, fn)`)
 * @param el HTML element to attach event to
 * @param event Type of event to listen to
 * @param fn Function to execute
 */
export function evt<E extends HTMLElement, T extends keyof HTMLElementEventMap>(
    el: E,
    event: T,
    fn: (this: E, e: HTMLElementEventMap[T]) => any
): void

export function evt(el: HTMLElement, event: keyof HTMLElementEventMap, fn: (this: HTMLElement, e: Event) => any): void {
    el.addEventListener(event, fn);
}

export const actives: Record<string, HTMLElement> = {};

/**
 * Sets active (selected) element on specified list id. 
 * If there is an active for the id already, it is replace by new one.
 * 
 * An active element means it has the `.active` class.
 * @param el Element to assign active to
 * @param id ID of the list to update / add
 * @returns The element that got active enabled
 */
export function active(el: HTMLElement, id: string): HTMLElement {
    if(actives[id]) actives[id].classList.remove("active");
    
    actives[id] = el;
    el.classList.add("active");
    return el;
}

// function objLength(o) {
//     let length = 0;
//     for(let i in o){
//         length++;
//     }
//     return length;
// }

// function isInt(number) {
//     return Math.floor(number) == number;
// }

const _anonymousGen = (function() {
    let createID = () => {
        let id: string, generateID = () => {
			let result = "";

			while(result.length < 10)
				result += "abcdefghijklmopqrstuvwxyz1234567890".split("")[ Math.floor( Math.random() * 35 ) ];
            
            return result;
		};
        
		id = generateID();
		while(window[id as keyof Window]) id = generateID();
        
		return id;
	}
    
    return function(fn: Function): string {
        let id = createID();
        
        Object.defineProperty(window, id, {
            value: function(...args: any[]) {
                fn(...args);
            }
        });

        return id;
    }
})();

/**
* Adds the function provided to the `window` object, anonymizing the function contents and under a random name.
 * @param fn Function to anonymize
 * @returns Function's name in the `window` object
 */
export function anonymize(fn: Function): string {
    return _anonymousGen(fn);
}

/**
 * Prepares a portion of HTML code meant to insert into a HTML tag in the format:
 * 
 * `on{event}="{function code}"`
 * 
 * Under the hood, it uses `anonymize()` to access the function out of the script
 * @param fn Function to prepare
 * @param event Event to fire function on (default: `click`)
 * @returns The `on` code
 */
export function prepEvt<E extends HTMLElement, T extends keyof HTMLElementEventMap = "click">(fn: (this: E, e: HTMLElementEventMap[T], t: E) => any, event: T): string {
    return `on${event}="window['${_anonymousGen(fn)}'].call(this, event, this);"`;
}

/**
 * Lets a renderer frame happen. Useful to let the user see script progress in the middle of a script.
 */
export function pushFrame(): Promise<void> {
    return new Promise(r => {
        setImmediate(r);
    })
}

/**
 * Clamps a number to a range between `min` and `max`. If any of range bounds is set to `null` or omitted, number is not clamped to that bound.
 * @param num Number to clamp
 * @param min Minimum number value (inclusive)
 * @param max Maximum number value (inclusive)
 * @returns Clamped number
 */
export function clampNumber(num: number, min: number | null = num, max: number | null = num): number {
    if(min === null) min = num;
    if(max === null) max = num;

    return num < min? min: num > max? max: num;
}

/**
 * Merges objects into a single object, objects with higher index overwrite lower ones.
 * @param objects Objects to merge
 * @returns Merging result
 */
export function mergeObjects(...objects: object[]): object;
export function mergeObjects(...objects: Record<any, any>[]): object {
    let obj: Record<any, any> = {};
    
    for (const object of objects) {
        for(let prop in object) {
            obj[prop] = object[prop];
        }
    }

    return obj;
}

/**
 * Returns promise that resolves after an interval given by `ms`
 * @param ms Milliseconds to wait
 */
export function wait(ms: number): Promise<void> {
    return new Promise(r => {
        setTimeout(r, ms);
    })
}

/**
 * Prints an error to the console
 * @param error The error to print to console
 */
export function logError(error: ErrorLike): void {
    logger.warn(
        `ERROR LOGGED => Name: ${error.name}; Message: ${error.message}; Code: ${error.code}; Constr: ${error.constructor.name}`
    );
}

/**
 * Catches promise rejections and substitutes them with `null`
 * @param value A `Promise`, thenable or any other value
 * @returns Returns a `Promise` that resolves to:
 * - If `value` is a `Promise`: `null` if the promise rejects, otherwise the value `value` resolves to
 * - If `value` is not a `Promise`: `value`
 */
export function toNull<T>(value: T): Promise<Awaited<T> | T | null> {
    return new Promise(resolve => {
        if(value instanceof Promise) {
            value.then(resolve, () => {
                resolve(null);
            });
        } else resolve(value);
    })
}

let fetches: Record<string, Promise<any> | null> = {};

/**
 * If a pending promise is present in cache on key `id`, it's returned.
 * Otherwise, `fetcher` is saved to cache and returned.
 * @param fetcher A promise to use if no cache is present
 * @param id Cache key used to check for existing cache
 */
export function fetchUnfinished(fetcher: Promise<any>, id: string): Promise<any> {
    let removeFetch = () => {
        fetches[id] = null;
    };

    if(!fetches[id]) {
        fetches[id] = fetcher;
        fetcher.then(removeFetch).catch(removeFetch);
    }
    
    return fetches[id];
}

fetchUnfinished._fetches = fetches;