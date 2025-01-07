import { Application } from "pixi.js";
import { GComponentList } from "./gcomponent-list";

export class StlbGlobals {
    static app: Application;
    
    static readonly gComponents = new GComponentList();
}