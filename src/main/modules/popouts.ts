export class Popouts {
    active: HTMLElement | null;
    links: {
        occupied: number,
        db: HTMLElement[][],
        readonly ref: "popoutLinkRef"
    };

    constructor() {
        this.active = null;
        this.links = {
            occupied: 0,
            db: [],
            ref: "popoutLinkRef"
        };
    }

    _rem(el: HTMLElement): void {
        el.classList.remove("open");
    }

    _add(el: HTMLElement): void {
        el.classList.add("open");
    }

    enable(el: HTMLElement): true {
        if(this.active !== el) {
            if(this.active !== null) {
                this._rem(this.active);
                if(typeof this.active[this.links.ref] === "number") {
                    for (const link of this.links.db[this.active[this.links.ref]!]) {
                        this._rem(link);
                    }
                }
            }
            this._add(el);
            if(typeof el[this.links.ref] === "number") {
                for (const link of this.links.db[el[this.links.ref]!]) {
                    this._add(link);
                }
            }
            this.active = el;
        }
        return true;
    }

    disable(el: HTMLElement): false {
        if(this.active === el) {
            this._rem(el);
            if(typeof el[this.links.ref] === "number") {
                for (const link of this.links.db[el[this.links.ref]!]) {
                    this._rem(link);
                }
            }
            this.active = null;
        }
        return false;
    }

    toggle(el: HTMLElement): boolean {
        if(this.active === el) {
            this.disable(el);
            return false;
        } else {
            this.enable(el);
            return true;
        }
    }

    isActive(el: HTMLElement): boolean {
        return this.active === el;
    }

    link(mainEl: HTMLElement, secondaryEl: HTMLElement): number {
        let added = typeof mainEl[this.links.ref] == "number";
        let index = added? mainEl[this.links.ref]!: this.links.occupied, db = this.links.db;

        if(!db[index]) db[index] = [];
        db[index].push(secondaryEl);
        if(!added) {
            mainEl[this.links.ref] = index;
            this.links.occupied++;
        }

        return index;
    }
}