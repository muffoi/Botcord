module.exports = {
    active: null,
    links: {
        occupied: 0,
        db: [],
        ref: "popoutLinkRef"
    },

    _rem(el) {
        el.classList.remove("open");
    },

    _add(el) {
        el.classList.add("open");
    },

    enable(el) {
        if(this.active !== el) {
            if(this.active !== null) {
                this._rem(this.active);
                if(typeof this.active[this.links.ref] === "number") {
                    for (const link of this.links.db[this.active[this.links.ref]]) {
                        this._rem(link);
                    }
                }
            }
            this._add(el);
            if(typeof el[this.links.ref] === "number") {
                for (const link of this.links.db[el[this.links.ref]]) {
                    this._add(link);
                }
            }
            this.active = el;
        }
        return true;
    },

    disable(el) {
        if(this.active === el) {
            this._rem(el);
            if(typeof el[this.links.ref] === "number") {
                for (const link of this.links.db[el[this.links.ref]]) {
                    this._rem(link);
                }
            }
            this.active = null;
        }
        return false;
    },

    toggle(el) {
        if(this.active === el) {
            this.disable(el);
            return false;
        } else {
            this.enable(el);
            return true;
        }
    },

    isActive(el) {
        return this.active === el;
    },

    link(mainEl, secondaryEl) {
        let added = typeof mainEl[this.links.ref] == "number";
        let i = added? mainEl[this.links.ref]: this.links.occupied, db = this.links.db;

        if(!db[i]) db[i] = [];
        db[i].push(secondaryEl);
        if(!added) {
            mainEl[this.links.ref] = i;
            this.links.occupied++;
        }

        return i;
    }
}