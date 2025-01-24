import { Text } from 'pixi.js';

export class TextWord {
  public textG!: Text;

  constructor(public text: string, textG?: Text) {
    if (textG) this.textG = textG;
  }

  fromWord(word: TextWord) {
    this.text = word.text;
    this.textG = word.textG;
  } 

  static deepClone(word: TextWord): TextWord {
    const newWord = new TextWord(word.text);
    newWord.textG = word.textG;

    return newWord;
  }
}
