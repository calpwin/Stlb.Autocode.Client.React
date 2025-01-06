import { Application, Container, Graphics, Text } from 'pixi.js';

export class LogicBlockPopUp {
  constructor(
    private readonly _pointerCoordinates: { x: number; y: number },
    private readonly _logicBlockCodes: string[],
    private readonly _app: Application
  ) {}

  render() {
    const container = new Container();
    container.width = 200;
    container.height = 150;
    container.x = this._pointerCoordinates.x;
    container.y = this._pointerCoordinates.y;

    const graphics = new Graphics().rect(0, 0, 200, 150).fill('white');
    container.addChild(graphics);

    let logicBlockContainerY = 0;
    this._logicBlockCodes.forEach((code) => {
      const logicBlockContainer = this._renderLogicBlock(code);

      logicBlockContainer.y = logicBlockContainerY; 
      logicBlockContainerY += logicBlockContainer.y + logicBlockContainer.height;

      container.addChild(logicBlockContainer)
    });

    this._app.stage.addChild(container);
  }

  private _renderLogicBlock(blockCode: string) {
    const container = new Container();    
    
    const graphics = new Graphics().rect(0,0,200,30);
    graphics.fill('white');
    // graphics.stroke({width: 1, color: 'red'});    

    const text = new Text({ text: blockCode });
    text.x = 5;
    text.style.fontSize = 14;
    text.y = graphics.height/2 - text.height/2;    
    text.style.fill = 'black';

    graphics.addChild(text);

    container.addChild(graphics);

    return container;
  }
}
