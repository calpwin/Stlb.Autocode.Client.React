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
  Left,
  Top,
  Right,
  Bottom,
}

export class StlbResizer {
  private _resizerG = new Graphics().circle(0, 0, 7).fill('green');

  private _isActive = false;
  private _startPointerXPosition?: number;
  private _startPointerYPosition?: number;
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
    this._resizerG.zIndex = 1000;

    if (this.side === StlcResizerSide.Left)
      this._resizerG = this._renderLeftResizer();
    else if (this.side === StlcResizerSide.Top)
      this._resizerG = this._renderTopResizer();
    else if (this.side === StlcResizerSide.Right)
      this._resizerG = this._renderRightResizer();
    else if (this.side === StlcResizerSide.Bottom)
      this._resizerG = this._renderBottomResizer();

    return this._resizerG;
  }

  _renderLeftResizer() {
    this._resizerG.position.x = 0;
    this._resizerG.position.y =
      this._parentGComp.getProperty<number>('height').value / 2;

    return this._resizerG;
  }

  _renderTopResizer() {
    this._resizerG.position.x =
      this._parentGComp.getProperty<number>('width').value / 2;
    this._resizerG.position.y = 0;

    return this._resizerG;
  }

  _renderRightResizer() {
    this._resizerG.position.x =
      this._parentGComp.getProperty<number>('width').value;
    this._resizerG.position.y =
      this._parentGComp.getProperty<number>('height').value / 2;

    return this._resizerG;
  }

  _renderBottomResizer() {
    this._resizerG.position.x =
      this._parentGComp.getProperty<number>('width').value / 2;
    this._resizerG.position.y =
      this._parentGComp.getProperty<number>('height').value;

    return this._resizerG;
  }

  private _bindEvents() {
    this._resizerG.eventMode = 'static';
    StlbGlobals.app.stage.eventMode = 'static';
    this._resizerG.hitArea = new Circle(0, 0, 10);

    this._resizerG.on('mousedown', (e) => {
      this._isActive = true;
      this._startPointerXPosition = e.client.x;
      this._startPointerYPosition = e.client.y;

      this._startXPosition = this._parentGComp.getProperty<number>('x').value;
      this._startYPosition = this._parentGComp.getProperty<number>('y').value;
      this._startWidth = this._parentGComp.getProperty<number>('width').value;
      this._startHeight = this._parentGComp.getProperty<number>('height').value;

      const getRandomIntegerInclusive = (min: number, max: number) => {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
      };      

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
    const xDelta = this._startPointerXPosition! - e.client.x;

    if (this.side === StlcResizerSide.Left) {
      this._parentGComp.setProperty({
        name: 'x',
        value: this._startXPosition! - xDelta,
      });
      this._parentGComp.setProperty({
        name: 'width',
        value: this._startWidth! + xDelta,
      });
    } else if (this.side === StlcResizerSide.Top) {
      this._parentGComp.setProperty({ name: 'y', value: e.client.y });
      this._parentGComp.setProperty({
        name: 'height',
        value: this._startHeight! + (this._startPointerYPosition! - e.client.y),
      });
    } else if (this.side === StlcResizerSide.Right) {
      // this._parentGComp.setProperty({ name: 'x', value: e.client.x });
      this._parentGComp.setProperty({
        name: 'width',
        value: this._startWidth! + (e.client.x - this._startPointerXPosition!),
      });
    } else if (this.side === StlcResizerSide.Bottom) {
      this._parentGComp.setProperty({
        name: 'height',
        value: this._startHeight! + (e.client.y - this._startPointerYPosition!),
      });
    }
  }
}
