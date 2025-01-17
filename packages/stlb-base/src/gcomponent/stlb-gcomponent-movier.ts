import { FederatedMouseEvent } from 'pixi.js';
import { StlbBaseGComponent } from './stlb-base-gcomponent';
import { debounce } from 'ts-debounce';

export class StlbGComponentMovier {
  private _isActive = false;

  public get isActive() {
    return this._isActive;
  }

  constructor(private readonly _gcomp: StlbBaseGComponent) {}

  public enable() {
    this._gcomp._container.on('mousedown', this._onMouseDown);
  }

  public disable() {
    this._isActive = false;
    this._gcomp._container.off('mousedown', this._onMouseDown);
    this._gcomp._container.off('mouseup', this._onMouseUp);
  }

  public dispose() {
    this._isActive = false;
    this._gcomp._container.off('mousedown', this._onMouseDown);
    this._gcomp._container.off('mouseup', this._onMouseUp);
  }

  private _onMouseDown = (e: FederatedMouseEvent) => {
    this._isActive = true;
    this._gcomp._container.on('mouseup', this._onMouseUp);
    this._gcomp._container.on('mousemove', this._MoveGComponent);
  };

  private _onMouseUp = (e: FederatedMouseEvent) => {
    this._isActive = false;
    this._gcomp._container.off('mousemove', this._MoveGComponent);
  };

  private _MoveGComponent = (e: FederatedMouseEvent) => {
    if (!this._isActive) return;

    debounce(
      (_e) => {
        console.log(e.movementX);
        this._gcomp.x += e.movementX;
        this._gcomp.y += e.movementY;
      },
      20,
      { isImmediate: true }
    )(e);
  };
}
