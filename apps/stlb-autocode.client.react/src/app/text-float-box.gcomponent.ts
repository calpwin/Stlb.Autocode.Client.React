import { Graphics, Text } from 'pixi.js';
import { TextWord } from './text-word';

class SelectedTextWord {
  constructor(public readonly textWord: TextWord, public index: number) {}
}

export class TextFloatBoxGComponent {
  public get graphics() {
    return this._graphics;
  }

  public readonly width: number;

  public get selectedWord() {
    return this._selectedWord;
  }

  public set selectedWord(word: SelectedTextWord) {
    this._selectedWord = word;

    this.redrawBase();
  }

  private _graphics = new Graphics();

  private _textGCompoent?: Text;
  private _selectedWord: SelectedTextWord = new SelectedTextWord(
    this.wordsToChoose.at(0)!,
    0
  );

  constructor(
    public readonly x: number,
    public readonly y: number,
    readonly w: number,
    public readonly word: TextWord,
    public readonly wordsToChoose: TextWord[]
  ) {
    this.width = w > 100 ? w : 100;

    document.addEventListener('keydown', this.onKeyDown);
  }

  render(): Graphics {
    this.redrawBase();

    return this.graphics;
  }

  destroy() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const chooseNextWordIndex = (
      currentIndex: number,
      direction: 'up' | 'down'
    ) => {
      if (this.wordsToChoose.length === 1) return 0;

      const nextIndex =
        direction === 'down' ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex < 0) return this.wordsToChoose.length - 1;

      if (nextIndex > this.wordsToChoose.length - 1) return 0;

      return nextIndex;
    };

    switch (e.key) {
      case 'ArrowUp':
        {
          const nextIndex = chooseNextWordIndex(this.selectedWord.index, 'up');
          const nextWordG = this.wordsToChoose.at(nextIndex)!;

          this.selectedWord = new SelectedTextWord(nextWordG, nextIndex);
        }
        break;
      case 'ArrowDown':
        {
          const nextIndex = chooseNextWordIndex(
            this.selectedWord.index,
            'down'
          );
          const nextWordG = this.wordsToChoose.at(nextIndex)!;

          this.selectedWord = new SelectedTextWord(nextWordG, nextIndex);
        }
        break;    
    }
  };

  private redrawBase() {
    this.graphics.removeChildren();

    let currentX = this.x;
    let currentY = this.y;

    this._textGCompoent = this.createTextG(this.word.text, false);

    this._textGCompoent.position.x = currentX;
    this._textGCompoent.position.y = currentY;

    currentY += this._textGCompoent.height + 10;

    this.graphics.addChild(this._textGCompoent);

    for (let index = 0; index < this.wordsToChoose.length; index++) {
      const word = this.wordsToChoose[index];

      const wordG = this.createTextG(
        word.text,
        index === this._selectedWord.index
      );
      wordG.position.x = currentX;
      wordG.position.y = currentY;

      currentY += wordG.height + 10;

      this.graphics.addChild(wordG);
    }

    this.graphics.rect(this.x, this.y, this.width + 20, currentY);
    this.graphics.fill(0xde3249);
  }

  private createTextG(text: string, isSelected: boolean) {
    return new Text({
      text: text,
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: isSelected ? 0xddaa8b : 0xffedff,
        align: 'center',
      },
    });
  }
}
