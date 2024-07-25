export class JsonBuilder {
    private json: any = {};
    private current = null;

    constructor() {
    }

    AddProperty(key: string, value: any): JsonBuilder {
        if (this.current == null) {
            this.json[key] = value;
        } else {
            this.current[key] = value;
        }
        return this;
    }

    Itr(key: string): any {
        if (this.current == null) {
            this.current = this.json[key];
        } else {
            this.current = this.current[key];
        }
        return this;
    }

    ResetItr(): JsonBuilder {
        this.current = null;
        return this;
    }

    Build(): any {
        return this.json;
    }
}