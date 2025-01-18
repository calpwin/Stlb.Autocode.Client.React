import { Container, FederatedMouseEvent, Graphics } from 'pixi.js';
import { SComponentPropertyType } from '../../redux/stlb-properties';
import { StlbBaseinput } from './stlb-base-input';
import Picker from 'vanilla-picker';

export class StlbColorPickerInput extends StlbBaseinput<string> {
  constructor(name: string, width?: number) {
    super(name, SComponentPropertyType.String, width);
  }

  private _container = new Container();
  private _color: string = 'red';

  render() {
    super.render();

    return this.container;
  }

  drawInputValue() {
    this._redrawColorPicker();

    return this._container;
  }

  private _redrawColorPicker() {
    const pickerWidth = 20;

    const inputValueG = super.drawInputValue();

    this._container.removeChildren();
    this._container.position.x = inputValueG.position.x;
    this._container.position.y = inputValueG.position.y;

    inputValueG.position.x = pickerWidth;
    this._container.addChild(inputValueG);

    const pickerG = new Graphics().circle(pickerWidth / 2, this._height / 2 - 1, 5).fill(this._color);
    pickerG.eventMode = 'static';
    pickerG.on('click', (e: FederatedMouseEvent) => {
      const pickerWrapper = document.createElement('div')!;
      document.getElementsByTagName('body')[0]!.append(pickerWrapper);
      //   const pickerWrapper = document.getElementById('stlb-colorpicker')!;
      //   pickerWrapper.style.display = 'block';
      pickerWrapper.style.position = 'absolute';
      pickerWrapper.style.display = 'block';
      pickerWrapper.style.width = 1 + 'px';
      pickerWrapper.style.height = 1 + 'px';
      pickerWrapper.style.left = e.clientX - 50 + 'px';
      pickerWrapper.style.top = e.clientY + 10 + 'px';

      var picker = new Picker(pickerWrapper);
      picker.show();
      picker.onChange = (color) => {
        this._color = color.hex;
        this.inputText = this._color;

        this._redrawColorPicker();
      };

      e.stopPropagation();
    });

    this._container.addChild(pickerG);
  }
}
