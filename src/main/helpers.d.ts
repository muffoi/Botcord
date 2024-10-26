/**
 * Creates a new HTML element
 * @param tag HTML tag of the element
 * @param classes Class or classes to assign to the element
 * @param id ID to assign to the element
 * @param source If `<img>`, `<video>`, `<audio>`, etc., set the source URL for the resource
 * @returns Newly created element
 */
declare function mkelem(tag:string, classes:string | string[] | undefined, id:string | undefined, source:string | undefined):HTMLElement

/**
 * Search for HTML elements (alias for `querySelector` and `querySelectorAll`)
 * @param selector A CSS selector to query
 * @param all If to search for all results (default: `false`)
 * @returns The HTML element(s) found
 */
declare function elem(selector:string, all:false):HTMLElement
declare function elem(selector:string):HTMLElement
declare function elem(selector:string, all:true):NodeList

/**
 * HTML-escapes a string
 * @param txt String to escape
 * @returns Escaped string
 */
declare function esc(txt:string):string

/**
 * Add event listener to a HTML element (alias for `el.addEventListener(ev, fn)`)
 * @param el HTML element to attach event to
 * @param event Type of event to listen to
 * @param fn Function to execute
 */
declare function evt(el:HTMLElement, event:string, fn:Function):void

/**
 * Sets active (selected) element on specified list id. 
 * If there is an active for the id already, it is replace by new one.
 * 
 * An active element means it has the `.active` class.
 * @param el Element to assign active to
 * @param id ID of the list to update / add
 * @returns The element that got active enabled
 */
declare function active(el:HTMLElement, id:string):HTMLElement

// /**
//  * Counts the length of an object
//  * @param o Object to count keys for
//  * @returns Length of the object
//  */
// declare function objLength(o:object):number

// /**
//  * Checks if a number is an integer or a floating-point number
//  * 
//  * - `true` if number is an integer
//  * - `false` if number is a float
//  * @param number Number to check
//  * @returns If number is an integer or a float
//  */
// declare function isInt(number:number):boolean

/**
 * Adds the function provided to the `window` object, anonymizing the function contents and under a random name.
 * @param fn Function to anonymize
 * @returns Function's name in the `window` object
 */
declare function anonymize(fn:Function):string

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
declare function prepEvt(fn:Function, event:string):string

/**
 * Lets a renderer frame happen. Useful to let the user see script progress in the middle of a script.
 */
declare function pushFrame():Promise<void>

/**
 * Clamps a number to a range between `min` and `max`. If any of range bounds is set to `null` or omitted, number is not clamped to that bound.
 * @param num Number to clamp
 * @param min Minimum number value (inclusive)
 * @param max Maximum number value (inclusive)
 * @returns Clamped number
 */
declare function clampNumber(num: number, min: number | undefined, max: number | undefined): number

/**
 * Merges objects into a single object, objects with higher index overwrite lower ones.
 * @param objects Objects to merge
 * @returns Merging result
 */
declare function mergeObjects(...objects: Object[]): Object

/**
 * Returns promise that resolves after an interval given by `ms`
 * @param ms Milliseconds to wait
 */
declare function wait(ms: number): Promise<void>