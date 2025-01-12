import {
  Circle,
  FederatedEvent,
  FederatedPointerEvent,
  Graphics,
} from 'pixi.js';
import { StlbBaseGcomponent } from './stlb-base-gcomponent';
import { StlbGlobals } from '../globals';
import { debounce } from 'ts-debounce';

export enum StlcResizerSide {
  Left = 1,
  Top = 2,
  Right = 3,
  Bottom = 4,
}

export class StlbResizer {
  private _resizerG = new Graphics().circle(0, 0, 7).fill('green');

  private _isActive = false;
  private _startXPosition?: number;
  private _startYPosition?: number;
  private _startWidth?: number;
  private _startHeight?: number;

  constructor(
    public readonly side: StlcResizerSide,
    private readonly _parentGComp: StlbBaseGcomponent
  ) {
    this._bindEvents();
  }

  render() {
    this._resizerG.position.x = 0;
    this._resizerG.position.y =
      this._parentGComp.getProperty<number>('height')?.value / 2;
    this._resizerG.zIndex = 1000;

    return this._resizerG;
  }

  private _bindEvents() {
    this._resizerG.eventMode = 'static';
    StlbGlobals.app.stage.eventMode = 'static';
    this._resizerG.hitArea = new Circle(0, 0, 20);

    this._resizerG.on('mousedown', (e) => {
      this._isActive = true;
      this._startXPosition = e.client.x;
      this._startYPosition = e.client.y;
      this._startWidth = this._parentGComp.getProperty<number>('width')?.value;
      this._startHeight = this._parentGComp.getProperty<number>('height')?.value;

      StlbGlobals.app.stage.on('mousemove', this._onMouseMove);
    });

    StlbGlobals.app.stage.on('mouseup', (e) => {
      this._isActive = false;
      StlbGlobals.app.stage.off('mousemove', this._onMouseMove);
    });
  }

  private _onMouseMove = (e: FederatedPointerEvent) => {
    debounce(() => this._move(e), 20, { isImmediate: true })();
  };

  private _move(e: FederatedPointerEvent) {
    if (this.side === StlcResizerSide.Left) {
      this._parentGComp.setProperty({ name: 'x', value: e.client.x });
      this._parentGComp.setProperty({
        name: 'width',
        value: this._startWidth! + (this._startXPosition! - e.client.x),
      });
    }
  }
}
