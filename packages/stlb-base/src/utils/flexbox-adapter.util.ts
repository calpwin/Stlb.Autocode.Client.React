import { Circle, Container, Graphics, GraphicsPath, Text, TextureMatrix } from 'pixi.js';
import { Subject } from 'rxjs';
import {
  SComponentAlignType,
  SComponentFlexboxAlign,
  SComponentFlexboxAlignDirection,
  SComponentFlexboxAutoAlign,
  SComponentFlexboxFixAlign,
} from '../redux/stlb-store-slice';
import { StlbNumberInput } from '../gcomponent/input/stlb-text-input';

export class FlexboxAdapterUtil {
  public readonly testContainer = new Container();
  public readonly propertyEditorContainer = new Container();

  public readonly onAlignChanged = new Subject<SComponentFlexboxAlign>();

  public get propertyEditorWidth() {
    return this.propertyEditorContainer.getBounds().width;
  }

  public get propertyEditorHeight() {
    return 80;
  }

  private readonly _testElsBounds = [
    {
      width: 150,
      height: 70,
      fill: 'yellow',
    },
    {
      width: 100,
      height: 50,
      fill: 'green',
    },
    {
      width: 70,
      height: 40,
      fill: 'red',
    },
  ];

  redraw() {
    this.redrawTest();
  }

  private readonly _propEditorWidth = 150;
  private readonly _propEditorHeight = 100;
  private readonly _propEditorPadding = 20;
  private readonly _propEditorCellGapHorizontal = (this._propEditorWidth - this._propEditorPadding * 2) / 2;
  private readonly _propEditorCellGapVertical = (this._propEditorHeight - this._propEditorPadding * 2) / 2;
  private readonly _alignCellGraphicsFill = 'blue';

  private readonly _fixAlignGraphicsBounds = { width: 2, heightMin: 6, heightMedium: 7, heightMax: 10 };
  private readonly _autoAlignGraphicsBounds = { width: 2, heightCenter: 6, heightEnds: 10 };

  private propEditorFieldCells: {
    [key in SComponentFlexboxFixAlign]: {
      x: number;
      y: number;
      graphics: Graphics;

      fixHorizontalAlignGraphics: Graphics;
      fixVerticalAlignGraphics: Graphics;

      autoHorizontalAlignGrapchis: Graphics;
      autoVerticalAlignGrapchis: Graphics;
    };
  } = {
    [SComponentFlexboxFixAlign.TopLeft]: {
      x: this._propEditorPadding,
      y: this._propEditorPadding,
      graphics: new Graphics(),

      // Fix align
      fixHorizontalAlignGraphics: new Graphics()
        .rect(0, 0, this._fixAlignGraphicsBounds.width, this._fixAlignGraphicsBounds.heightMedium)
        .rect(
          this._fixAlignGraphicsBounds.width + 2,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMax
        )
        .rect(
          this._fixAlignGraphicsBounds.width * 2 + 4,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMin
        ),

      fixVerticalAlignGraphics: new Graphics()
        .rect(0, 0, this._fixAlignGraphicsBounds.heightMedium, this._fixAlignGraphicsBounds.width)
        .rect(
          0,
          this._fixAlignGraphicsBounds.width + 2,
          this._fixAlignGraphicsBounds.heightMax,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          0,
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width
        ),

      // Auto align
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.TopCenter]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal,
      y: this._propEditorPadding,
      graphics: new Graphics(),

      // Fix align
      fixHorizontalAlignGraphics: new Graphics()
        .rect(0, 0, this._fixAlignGraphicsBounds.width, this._fixAlignGraphicsBounds.heightMedium)
        .rect(
          this._fixAlignGraphicsBounds.width + 2,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMax
        )
        .rect(
          this._fixAlignGraphicsBounds.width * 2 + 4,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMin
        ),

      fixVerticalAlignGraphics: new Graphics()
        .rect(
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMedium / 2,
          0,
          this._fixAlignGraphicsBounds.heightMedium,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          0,
          this._fixAlignGraphicsBounds.width + 2,
          this._fixAlignGraphicsBounds.heightMax,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMin / 2,
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width
        ),

      // Auto align
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightCenter
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.TopRight]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal * 2,
      y: this._propEditorPadding,
      graphics: new Graphics(),

      // Fix align
      fixHorizontalAlignGraphics: new Graphics()
        .rect(0, 0, this._fixAlignGraphicsBounds.width, this._fixAlignGraphicsBounds.heightMedium)
        .rect(
          this._fixAlignGraphicsBounds.width + 2,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMax
        )
        .rect(
          this._fixAlignGraphicsBounds.width * 2 + 4,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMin
        ),

      fixVerticalAlignGraphics: new Graphics()
        .rect(
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMedium,
          0,
          this._fixAlignGraphicsBounds.heightMedium,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          0,
          this._fixAlignGraphicsBounds.width + 2,
          this._fixAlignGraphicsBounds.heightMax,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width
        ),

      // Auto align
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },

    [SComponentFlexboxFixAlign.Left]: {
      x: this._propEditorPadding,
      y: this._propEditorPadding + this._propEditorCellGapVertical,
      graphics: new Graphics(),

      // Fix align
      fixHorizontalAlignGraphics: new Graphics()
        .rect(
          0,
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMedium / 2,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMedium
        )
        .rect(
          this._fixAlignGraphicsBounds.width + 2,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMax
        )
        .rect(
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMin / 2,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMin
        ),

      fixVerticalAlignGraphics: new Graphics()
        .rect(0, 0, this._fixAlignGraphicsBounds.heightMedium, this._fixAlignGraphicsBounds.width)
        .rect(
          0,
          this._fixAlignGraphicsBounds.width + 2,
          this._fixAlignGraphicsBounds.heightMax,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          0,
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width
        ),

      // Auto align
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightCenter,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.Center]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal,
      y: this._propEditorPadding + this._propEditorCellGapVertical,
      graphics: new Graphics(),

      // Fix align
      fixHorizontalAlignGraphics: new Graphics()
        .rect(
          0,
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMedium / 2,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMedium
        )
        .rect(
          this._fixAlignGraphicsBounds.width + 2,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMax
        )
        .rect(
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMin / 2,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMin
        ),

      fixVerticalAlignGraphics: new Graphics()
        .rect(
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMedium / 2,
          0,
          this._fixAlignGraphicsBounds.heightMedium,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          0,
          this._fixAlignGraphicsBounds.width + 2,
          this._fixAlignGraphicsBounds.heightMax,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMin / 2,
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width
        ),

      // Auto align
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightCenter
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightCenter,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.Right]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal * 2,
      y: this._propEditorPadding + this._propEditorCellGapVertical,
      graphics: new Graphics(),

      // Fix align
      fixHorizontalAlignGraphics: new Graphics()
        .rect(
          0,
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMedium / 2,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMedium
        )
        .rect(
          this._fixAlignGraphicsBounds.width + 2,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMax
        )
        .rect(
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMin / 2,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMin
        ),

      fixVerticalAlignGraphics: new Graphics()
        .rect(
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMedium,
          0,
          this._fixAlignGraphicsBounds.heightMedium,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          0,
          this._fixAlignGraphicsBounds.width + 2,
          this._fixAlignGraphicsBounds.heightMax,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width
        ),

      // Auto align
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightCenter,
        this._autoAlignGraphicsBounds.width
      ),
    },

    [SComponentFlexboxFixAlign.BottomLeft]: {
      x: this._propEditorPadding,
      y: this._propEditorPadding + this._propEditorCellGapVertical * 2,
      graphics: new Graphics(),

      // Fix aliogn
      fixHorizontalAlignGraphics: new Graphics()
        .rect(
          0,
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMedium,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMedium
        )
        .rect(
          this._fixAlignGraphicsBounds.width + 2,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMax
        )
        .rect(
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMin
        ),

      fixVerticalAlignGraphics: new Graphics()
        .rect(0, 0, this._fixAlignGraphicsBounds.heightMedium, this._fixAlignGraphicsBounds.width)
        .rect(
          0,
          this._fixAlignGraphicsBounds.width + 2,
          this._fixAlignGraphicsBounds.heightMax,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          0,
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width
        ),

      // Auto align
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.BottomCenter]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal,
      y: this._propEditorPadding + this._propEditorCellGapVertical * 2,
      graphics: new Graphics(),

      // Fix align
      fixHorizontalAlignGraphics: new Graphics()
        .rect(
          0,
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMedium,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMedium
        )
        .rect(
          this._fixAlignGraphicsBounds.width + 2,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMax
        )
        .rect(
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMin
        ),

      fixVerticalAlignGraphics: new Graphics()
        .rect(
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMedium / 2,
          0,
          this._fixAlignGraphicsBounds.heightMedium,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          0,
          this._fixAlignGraphicsBounds.width + 2,
          this._fixAlignGraphicsBounds.heightMax,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          this._fixAlignGraphicsBounds.heightMax / 2 - this._fixAlignGraphicsBounds.heightMin / 2,
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width
        ),

      // Auto align
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightCenter
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },
    [SComponentFlexboxFixAlign.BottomRight]: {
      x: this._propEditorPadding + this._propEditorCellGapHorizontal * 2,
      y: this._propEditorPadding + this._propEditorCellGapVertical * 2,
      graphics: new Graphics(),

      // Fix align
      fixHorizontalAlignGraphics: new Graphics()
        .rect(
          0,
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMedium,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMedium
        )
        .rect(
          this._fixAlignGraphicsBounds.width + 2,
          0,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMax
        )
        .rect(
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width,
          this._fixAlignGraphicsBounds.heightMin
        ),

      fixVerticalAlignGraphics: new Graphics()
        .rect(
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMedium,
          0,
          this._fixAlignGraphicsBounds.heightMedium,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          0,
          this._fixAlignGraphicsBounds.width + 2,
          this._fixAlignGraphicsBounds.heightMax,
          this._fixAlignGraphicsBounds.width
        )
        .rect(
          this._fixAlignGraphicsBounds.heightMax - this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width * 2 + 4,
          this._fixAlignGraphicsBounds.heightMin,
          this._fixAlignGraphicsBounds.width
        ),

      // Auto align
      autoHorizontalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.width,
        this._autoAlignGraphicsBounds.heightEnds
      ),
      autoVerticalAlignGrapchis: new Graphics().rect(
        0,
        0,
        this._autoAlignGraphicsBounds.heightEnds,
        this._autoAlignGraphicsBounds.width
      ),
    },
  };

  constructor(public readonly flexboxAlign: SComponentFlexboxAlign) {}

  redrawPropertyEditor() {
    this.propertyEditorContainer.removeChildren();

    // #region direction & fix/auto Buttons

    const btnBounds = { width: 35, height: 25 };
    const paddings = 10;

    // Button Auto or Fix Align direction
    const btnAutoOrFixAlignG = new Graphics().rect(0, 0, btnBounds.width, btnBounds.height).fill(0xefeeee);
    btnAutoOrFixAlignG.eventMode = 'static';
    btnAutoOrFixAlignG.hitArea = new Circle(btnBounds.width / 2, btnBounds.height / 2, btnBounds.height / 2);
    btnAutoOrFixAlignG.on('click', () => {
      if (this.flexboxAlign.alignType === SComponentAlignType.Auto) {
        this.onAlignChanged.next({ ...this.flexboxAlign, alignType: SComponentAlignType.Fix });
      } else {
        this.onAlignChanged.next({
          ...this.flexboxAlign,
          alignType: SComponentAlignType.Auto,
          align: SComponentFlexboxAutoAlign.Start,
        });
      }
    });
    const btnAutoOrFixAlignTextG = new Text({
      style: {
        fill: this.flexboxAlign.alignType === SComponentAlignType.Fix ? 'blue' : 'black',
        fontSize: 15,
      },
    });
    btnAutoOrFixAlignTextG.text = 'A/F';
    btnAutoOrFixAlignTextG.position.x = btnBounds.width / 2 - 11;
    btnAutoOrFixAlignTextG.position.y = 5;

    if (this.flexboxAlign.alignType !== SComponentAlignType.Absolute) {
      btnAutoOrFixAlignG.addChild(btnAutoOrFixAlignTextG);
      this.propertyEditorContainer.addChild(btnAutoOrFixAlignG);
    }

    // Input Fix Align direction
    const inputFixAlignDirection = new StlbNumberInput('F', 50);
    inputFixAlignDirection.inputText = this.flexboxAlign.alignFixComponentsGap.toFixed(0);
    const inputFixAlignDirectionG = inputFixAlignDirection.render();
    inputFixAlignDirectionG.x = 0;
    inputFixAlignDirectionG.y = (btnBounds.height + paddings) * 2;
    inputFixAlignDirection.onChanged.subscribe((value) => {
      this.onAlignChanged.next({
        ...this.flexboxAlign,
        alignFixComponentsGap: value,
      });
    });

    if (this.flexboxAlign.alignType === SComponentAlignType.Fix) {
      this.propertyEditorContainer.addChild(inputFixAlignDirectionG);
    }

    // Button Horizontal direction
    const btnHorizontalDirectionG = new Graphics()
      .rect(btnBounds.width + 5, 0, btnBounds.width, btnBounds.height)
      .fill(0xefeeee);
    btnHorizontalDirectionG.eventMode = 'static';
    btnHorizontalDirectionG.hitArea = new Circle(
      btnBounds.width + 5 + btnBounds.width / 2,
      btnBounds.height / 2,
      btnBounds.height / 2
    );
    btnHorizontalDirectionG.on('click', () => {
      this.onAlignChanged.next({
        ...this.flexboxAlign,
        direction: SComponentFlexboxAlignDirection.Horizontal,
      });
    });
    const btnHorizontalDirectionTextG = new Text({
      style: {
        fill:
          this.flexboxAlign.alignType !== SComponentAlignType.Absolute &&
          this.flexboxAlign.direction === SComponentFlexboxAlignDirection.Horizontal
            ? 'blue'
            : 'black',
        fontSize: 15,
      },
    });
    btnHorizontalDirectionTextG.text = 'H';
    btnHorizontalDirectionTextG.position.x = btnBounds.width + 5 + btnBounds.width / 2 - 5;
    btnHorizontalDirectionTextG.position.y = 5;

    if (this.flexboxAlign.alignType !== SComponentAlignType.Absolute) {
      btnHorizontalDirectionG.addChild(btnHorizontalDirectionTextG);
      this.propertyEditorContainer.addChild(btnHorizontalDirectionG);
    }

    // Button Vertical direction
    const btnVerticalDirectionG = new Graphics()
      .rect((btnBounds.width + 5) * 2, 0, btnBounds.width, btnBounds.height)
      .fill(0xefeeee);
    btnVerticalDirectionG.eventMode = 'static';
    btnVerticalDirectionG.hitArea = new Circle(
      (btnBounds.width + 5) * 2 + btnBounds.width / 2,
      btnBounds.height / 2,
      btnBounds.height / 2
    );
    btnVerticalDirectionG.on('click', () => {
      this.onAlignChanged.next({
        ...this.flexboxAlign,
        direction: SComponentFlexboxAlignDirection.Vertical,
      });
    });
    const btnVerticalDirectionTextG = new Text({
      style: {
        fill:
          this.flexboxAlign.alignType !== SComponentAlignType.Absolute &&
          this.flexboxAlign.direction === SComponentFlexboxAlignDirection.Vertical
            ? 'blue'
            : 'black',
        fontSize: 15,
      },
    });
    btnVerticalDirectionTextG.text = 'V';
    btnVerticalDirectionTextG.position.x = (btnBounds.width + 5) * 2 + btnBounds.width / 2 - 5;
    btnVerticalDirectionTextG.position.y = 5;

    if (this.flexboxAlign.alignType !== SComponentAlignType.Absolute) {
      btnVerticalDirectionG.addChild(btnVerticalDirectionTextG);
      this.propertyEditorContainer.addChild(btnVerticalDirectionG);
    }

    // Button AlignType
    const btnAlignTypeG = new Graphics()
      .rect(0, btnBounds.height + paddings, btnBounds.width, btnBounds.height)
      .fill(0xefeeee);
    btnAlignTypeG.eventMode = 'static';
    btnAlignTypeG.hitArea = new Circle(
      btnBounds.width / 2,
      btnBounds.height + paddings + btnBounds.height / 2,
      btnBounds.height / 2
    );
    btnAlignTypeG.on('click', () => {
      this.onAlignChanged.next({
        ...this.flexboxAlign,
        alignType:
          this.flexboxAlign.alignType === SComponentAlignType.Absolute
            ? SComponentAlignType.Auto
            : SComponentAlignType.Absolute,
      });
    });
    const btnAlignTypeTextG = new Text({
      style: {
        fill: this.flexboxAlign.alignType === SComponentAlignType.Absolute ? 'blue' : 'black',
        fontSize: 15,
      },
    });
    btnAlignTypeTextG.text = 'AB';
    btnAlignTypeTextG.position.x = btnBounds.width / 2 - 10;
    btnAlignTypeTextG.position.y = btnBounds.height + paddings + 3;

    btnAlignTypeG.addChild(btnAlignTypeTextG);
    this.propertyEditorContainer.addChild(btnAlignTypeG);

    // #endregion

    const bgContainer = new Container();
    bgContainer.position.x = 120;
    bgContainer.position.y = 0;
    const propEditorWidth = 150;
    const propEditoBgG = new Graphics().rect(0, 0, propEditorWidth, this._propEditorHeight).fill(0xefeeee);

    if (this.flexboxAlign.alignType !== SComponentAlignType.Absolute) {
      bgContainer.addChild(propEditoBgG);
      this.propertyEditorContainer.addChild(bgContainer);
    }

    Object.keys(this.propEditorFieldCells).forEach((key) => {
      const cellAlign = <SComponentFlexboxFixAlign>+key;
      const cell = this.propEditorFieldCells[cellAlign];

      cell.graphics.circle(cell.x, cell.y, 1).fill('black');
      cell.graphics.eventMode = 'static';
      cell.graphics.hitArea = new Circle(cell.x, cell.y, 10);
      cell.graphics.on('click', () => this._oncCellClick(cellAlign));

      let isCellInSelectedAlign = false;
      if (this.flexboxAlign.alignType === SComponentAlignType.Auto) {
        const alignCellGraphics =
          this.flexboxAlign.direction === SComponentFlexboxAlignDirection.Horizontal
            ? cell.autoHorizontalAlignGrapchis
            : cell.autoVerticalAlignGrapchis;
        alignCellGraphics.fill(this._alignCellGraphicsFill);
        alignCellGraphics.position.x = cell.x - alignCellGraphics.getBounds().width / 2;
        alignCellGraphics.position.y = cell.y - alignCellGraphics.getBounds().height / 2;
        alignCellGraphics.eventMode = 'static';
        alignCellGraphics.hitArea = new Circle(cell.x, cell.y, 15);
        alignCellGraphics.on('click', () => this._oncCellClick(cellAlign));

        if (
          FlexboxAdapterUtil.isAutoAlignBelongsToAlign(
            <SComponentFlexboxAutoAlign>this.flexboxAlign.align,
            cellAlign,
            this.flexboxAlign.direction
          )
        ) {
          bgContainer.addChild(alignCellGraphics);
          isCellInSelectedAlign = true;
        }
      } else {
        if (this.flexboxAlign.align === cellAlign) {
          const alignCellGraphics =
            this.flexboxAlign.direction === SComponentFlexboxAlignDirection.Horizontal
              ? cell.fixHorizontalAlignGraphics.fill(this._alignCellGraphicsFill)
              : cell.fixVerticalAlignGraphics.fill(this._alignCellGraphicsFill);
          alignCellGraphics.position.x = cell.x - alignCellGraphics.getBounds().width / 2;
          alignCellGraphics.position.y = cell.y - alignCellGraphics.getBounds().height / 2;
          alignCellGraphics.eventMode = 'static';
          alignCellGraphics.hitArea = new Circle(cell.x, cell.y, 15);
          alignCellGraphics.on('click', () => this._oncCellClick(cellAlign));

          bgContainer.addChild(alignCellGraphics);
          isCellInSelectedAlign = true;
        }
      }

      if (!isCellInSelectedAlign) bgContainer.addChild(cell.graphics);
    });

    return this.propertyEditorContainer;
  }

  private _oncCellClick(cellAlign: SComponentFlexboxFixAlign) {
    let nextCellAlign: SComponentFlexboxFixAlign | SComponentFlexboxAutoAlign = cellAlign;

    if (this.flexboxAlign.alignType === SComponentAlignType.Auto)
      nextCellAlign = FlexboxAdapterUtil._autoAlignDirectionByCellAlign(cellAlign, this.flexboxAlign.direction);

    this.onAlignChanged.next({ ...this.flexboxAlign, align: nextCellAlign });
  }

  redrawTest() {
    const parentBound = { width: 600, height: 500 };

    const elPositionsAndBounds = this._testElsBounds.map((el) => ({
      x: 0,
      y: 0,
      width: el.width,
      height: el.height,
    }));
    const newElPositionsAndBounds = FlexboxAdapterUtil.applyAlign(
      elPositionsAndBounds,
      parentBound,
      SComponentFlexboxAlignDirection.Vertical,
      SComponentFlexboxAutoAlign.Start
    ).elPositionsAndBounds.map((elB, index) => ({ ...elB, fill: this._testElsBounds[index].fill }));

    const testBg = new Graphics().rect(0, 0, parentBound.width, parentBound.height).fill('grey');
    this.testContainer.addChild(testBg);

    newElPositionsAndBounds.forEach((elBound) => {
      const testReact = new Graphics().rect(elBound.x, elBound.y, elBound.width, elBound.height).fill(elBound.fill);
      this.testContainer.addChild(testReact);
    });
  }

  static applyAlign(
    elPositionsAndBounds: { x: number; y: number; width: number; height: number }[],
    parentBound: { width: number; height: number },
    alignDirection: SComponentFlexboxAlignDirection,
    align: SComponentFlexboxAutoAlign
  ) {
    let isApplied = false;
    if (elPositionsAndBounds.length <= 1) return { isApplied, elPositionsAndBounds };

    const newElPositionsAndBounds = [];

    let totalElsWidth = 0;
    let totalElsHeight = 0;

    elPositionsAndBounds.forEach((elPosBound) => {
      totalElsWidth += elPosBound.width;
      totalElsHeight += elPosBound.height;
    });

    let currentX = 0;
    let currentY = 0;
    let gapX = (parentBound.width - totalElsWidth) / (elPositionsAndBounds.length - 1);
    let gapY = (parentBound.height - totalElsHeight) / (elPositionsAndBounds.length - 1);
    for (let i = 0; i < elPositionsAndBounds.length; i++) {
      const newElPosBound = { ...elPositionsAndBounds[i] };

      // FlexboxAlignDirection.Horizontal
      if (alignDirection === SComponentFlexboxAlignDirection.Horizontal && align === SComponentFlexboxAutoAlign.Start) {
        newElPosBound.x = currentX;
        newElPosBound.y = 0;

        currentX += newElPosBound.width + gapX;
      } else if (
        alignDirection === SComponentFlexboxAlignDirection.Horizontal &&
        align === SComponentFlexboxAutoAlign.Center
      ) {
        newElPosBound.x = currentX;
        newElPosBound.y = parentBound.height / 2 - newElPosBound.height / 2;

        currentX += newElPosBound.width + gapX;
      } else if (
        alignDirection === SComponentFlexboxAlignDirection.Horizontal &&
        align === SComponentFlexboxAutoAlign.End
      ) {
        newElPosBound.x = currentX;
        newElPosBound.y = parentBound.height - newElPosBound.height;

        currentX += newElPosBound.width + gapX;
      }

      // FlexboxAlignDirection.Vertical
      else if (
        alignDirection === SComponentFlexboxAlignDirection.Vertical &&
        align === SComponentFlexboxAutoAlign.Start
      ) {
        newElPosBound.x = 0;
        newElPosBound.y = currentY;

        currentY += newElPosBound.height + gapY;
      } else if (
        alignDirection === SComponentFlexboxAlignDirection.Vertical &&
        align === SComponentFlexboxAutoAlign.Center
      ) {
        newElPosBound.x = parentBound.width / 2 - newElPosBound.width / 2;
        newElPosBound.y = currentY;

        currentY += newElPosBound.height + gapY;
      } else if (
        alignDirection === SComponentFlexboxAlignDirection.Vertical &&
        align === SComponentFlexboxAutoAlign.End
      ) {
        newElPosBound.x = parentBound.width - newElPosBound.width;
        newElPosBound.y = currentY;

        currentY += newElPosBound.height + gapY;
      }

      newElPositionsAndBounds.push(newElPosBound);
    }

    return { isApplied: true, elPositionsAndBounds: newElPositionsAndBounds };
  }

  private static _autoAlignDirectionByCellAlign(
    cellAlign: SComponentFlexboxFixAlign,
    alignDirection: SComponentFlexboxAlignDirection
  ) {
    if (alignDirection === SComponentFlexboxAlignDirection.Horizontal) {
      if (
        cellAlign === SComponentFlexboxFixAlign.TopLeft ||
        cellAlign === SComponentFlexboxFixAlign.TopCenter ||
        cellAlign === SComponentFlexboxFixAlign.TopRight
      ) {
        return SComponentFlexboxAutoAlign.Start;
      } else if (
        cellAlign === SComponentFlexboxFixAlign.Left ||
        cellAlign === SComponentFlexboxFixAlign.Center ||
        cellAlign === SComponentFlexboxFixAlign.Right
      ) {
        return SComponentFlexboxAutoAlign.Center;
      } else if (
        cellAlign === SComponentFlexboxFixAlign.BottomLeft ||
        cellAlign === SComponentFlexboxFixAlign.BottomCenter ||
        cellAlign === SComponentFlexboxFixAlign.BottomRight
      ) {
        return SComponentFlexboxAutoAlign.End;
      }
    } else if (alignDirection === SComponentFlexboxAlignDirection.Vertical) {
      if (
        cellAlign === SComponentFlexboxFixAlign.TopLeft ||
        cellAlign === SComponentFlexboxFixAlign.Left ||
        cellAlign === SComponentFlexboxFixAlign.BottomLeft
      ) {
        return SComponentFlexboxAutoAlign.Start;
      } else if (
        cellAlign === SComponentFlexboxFixAlign.TopCenter ||
        cellAlign === SComponentFlexboxFixAlign.Center ||
        cellAlign === SComponentFlexboxFixAlign.BottomCenter
      ) {
        return SComponentFlexboxAutoAlign.Center;
      } else if (
        cellAlign === SComponentFlexboxFixAlign.TopRight ||
        cellAlign === SComponentFlexboxFixAlign.Right ||
        cellAlign === SComponentFlexboxFixAlign.BottomRight
      ) {
        return SComponentFlexboxAutoAlign.End;
      }
    }

    throw new Error(`autoAlignDirectionByCellAlign: not all align variants emplimented`);
  }

  private static isAutoAlignBelongsToAlign(
    autoAlign: SComponentFlexboxAutoAlign,
    fixAlign: SComponentFlexboxFixAlign,
    alignDirection: SComponentFlexboxAlignDirection
  ) {
    if (autoAlign === SComponentFlexboxAutoAlign.Start) {
      return this.isStartAlign(fixAlign, alignDirection);
    } else if (autoAlign === SComponentFlexboxAutoAlign.Center) {
      return this.isCenterAlign(fixAlign, alignDirection);
    } else if (autoAlign === SComponentFlexboxAutoAlign.End) {
      return this.isEndAlign(fixAlign, alignDirection);
    }
  }

  private static alignToAutoAlign(align: SComponentFlexboxFixAlign, alignDirection: SComponentFlexboxAlignDirection) {
    if (FlexboxAdapterUtil.isStartAlign(align, alignDirection)) {
      return SComponentFlexboxAutoAlign.Start;
    } else if (FlexboxAdapterUtil.isCenterAlign(align, alignDirection)) {
      return SComponentFlexboxAutoAlign.Center;
    } else if (FlexboxAdapterUtil.isEndAlign(align, alignDirection)) {
      return SComponentFlexboxAutoAlign.End;
    }

    throw new Error(`alignToAutoAlign: ${FlexboxAdapterUtil} is not implemented`);
  }

  private static isStartAlign(align: SComponentFlexboxFixAlign, alignDirection: SComponentFlexboxAlignDirection) {
    return alignDirection === SComponentFlexboxAlignDirection.Horizontal
      ? align === SComponentFlexboxFixAlign.TopLeft ||
          align === SComponentFlexboxFixAlign.TopCenter ||
          align === SComponentFlexboxFixAlign.TopRight
      : align === SComponentFlexboxFixAlign.TopLeft ||
          align === SComponentFlexboxFixAlign.Left ||
          align === SComponentFlexboxFixAlign.BottomLeft;
  }

  private static isCenterAlign(align: SComponentFlexboxFixAlign, alignDirection: SComponentFlexboxAlignDirection) {
    return alignDirection === SComponentFlexboxAlignDirection.Horizontal
      ? align === SComponentFlexboxFixAlign.Left ||
          align === SComponentFlexboxFixAlign.Center ||
          align === SComponentFlexboxFixAlign.Right
      : align === SComponentFlexboxFixAlign.TopCenter ||
          align === SComponentFlexboxFixAlign.Center ||
          align === SComponentFlexboxFixAlign.BottomCenter;
  }

  private static isEndAlign(align: SComponentFlexboxFixAlign, alignDirection: SComponentFlexboxAlignDirection) {
    return alignDirection === SComponentFlexboxAlignDirection.Horizontal
      ? align === SComponentFlexboxFixAlign.BottomLeft ||
          align === SComponentFlexboxFixAlign.BottomCenter ||
          align === SComponentFlexboxFixAlign.BottomRight
      : align === SComponentFlexboxFixAlign.TopRight ||
          align === SComponentFlexboxFixAlign.Right ||
          align === SComponentFlexboxFixAlign.BottomRight;
  }
}
