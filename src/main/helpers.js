function mkelem(tag, classes, id, source) {
    let elem = document.createElement(tag);

    if(typeof classes === "object" && classes instanceof Array)
        classes.forEach(c => {
            elem.classList.add(c)
        }); 

    else if(typeof classes === "string") elem.classList.add(classes);

    if(typeof id === "string") elem.id = id;
    if(typeof source === "string") elem.src = source;

    return elem;
}

function elem(selector, all=false) {
    return document[ all? "querySelectorAll": "querySelector" ](selector);
}

function esc(txt) {
    let el = mkelem("p");
    el.innerText = txt;

    return el.innerHTML;
}

function evt(el, event, fn){
    el.addEventListener(event, fn);
}

const actives = {};

function active(el, id){
    if(actives[id]) actives[id].classList.remove("active");
    
    actives[id] = el;
    if(el instanceof HTMLElement) el.classList.add("active");
    return el;
}

// function objLength(o) {
//     let length = 0;
//     for(let i in o){
//         length++;
//     }
//     return length;
// }


// const MDParser = require("./modules/discordMarkdown");

// function isInt(number) {
//     return Math.floor(number) == number;
// }

const _anonymousGen = (function() {
    let createID = function(){
		let result, generateID = () => {
			result = "";

			while(result.length < 10)
				result += "abcdefghijklmopqrstuvwxyz1234567890".split("")[ Math.floor( Math.random() * 35 ) ];
		};

		generateID();
		while(window[result]) generateID();

		return result;
	}

    return function(fn) {
        let id = createID();
        window[id] = function(...args) {
            fn(...args);
        }

        return id;
    }
})();

function anonymize(fn) {
    return _anonymousGen(fn);
}

function prepEvt(fn, event = "click") {
    return `on${event}="window['${_anonymousGen(fn)}'].call(this, event, this);"`;
}

function pushFrame() {
    return new Promise(r => {
        setImmediate(r);
    })
}

function clampNumber(num, min = num, max = num) {
    return num < min? min: num > max? max: num;
}

function mergeObjects(...objects) {
    let obj = {};
    
    for (const object of objects) {
        for(let prop in object) {
            obj[prop] = object[prop];
        }
    }

    return obj;
}

function wait(ms) {
    return new Promise(r => {
        setTimeout(r, ms);
    })
}

function logError(error) {
    logger.warn(
        `ERROR LOGGED => Name: ${error.name}; Message: ${error.message}; Code: ${error.code}; Constr: ${error.constructor.name}`
    );
}