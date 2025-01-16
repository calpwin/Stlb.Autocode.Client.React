import EventEmitter from 'events';

export class TextSocket {
  messageRecievedEvent = new EventEmitter();

  private _socket: WebSocket;

  constructor(url: string) {
    this._socket = new WebSocket(`ws://${url}`);

    this._socket.onmessage = this.onMessage;
  }

  onMessage = (e: any) => {    
    const eventMsg = JSON.parse(e.data) as EventMessage;

    this.messageRecievedEvent.emit('event', eventMsg);
  };

  sendMessage(event: SelectVariantMessage) {
    var msgJson = JSON.stringify(event);    

    this._socket.send(msgJson);
  }
}

export enum EventMessageType {
  ClientRender,
  NextVariants,
  SelectVariant,
}

export class EventMessage {
  public type!: EventMessageType;
}

export class ClientRenderMessage extends EventMessage {
  public arguments: string[] = [];
}

export class NextVariantsMessage extends EventMessage {
  public variantsCodes: string[] = [];
}

export class SelectVariantMessage extends EventMessage {
  public selectedVariantCode?: string;

  public selectedVariantValue?: string;
}
