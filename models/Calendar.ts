export class Calendar {
    private _lundi: string;
    private _mardi: string;
    private _mercredi: string;
    private _jeudi: string;
    private _vendredi: string;
    private _samedi: string;
    private _dimanche: string;



    constructor(lundi: string, mardi: string, mercredi: string, jeudi: string, vendredi: string, samedi: string, dimanche: string) {
        this._lundi = lundi;
        this._mardi = mardi;
        this._mercredi = mercredi;
        this._jeudi = jeudi;
        this._vendredi = vendredi;
        this._samedi = samedi;
        this._dimanche = dimanche;
    }

    set lundi(value: string) {
        this._lundi = value;
    }

    set mardi(value: string) {
        this._mardi = value;
    }

    set mercredi(value: string) {
        this._mercredi = value;
    }

    set jeudi(value: string) {
        this._jeudi = value;
    }

    set vendredi(value: string) {
        this._vendredi = value;
    }

    set samedi(value: string) {
        this._samedi = value;
    }

    set dimanche(value: string) {
        this._dimanche = value;
    }
}