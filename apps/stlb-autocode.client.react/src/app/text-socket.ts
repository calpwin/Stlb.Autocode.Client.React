import EventEmitter from "events";

export class TextSocket {
  messageRecievedEvent = new EventEmitter();

  private _socket: WebSocket;

  constructor(url: string) {
    this._socket = new WebSocket(`ws://${url}`);

    this._socket.onmessage = this.onMessage;
  }

  onMessage = (e: any) => {
    console.log(e);

    const eventMsg = JSON.parse(e.data) as EventMessage;

    this.messageRecievedEvent.emit('event', eventMsg);
  };

  sendMessage(event: SelectVariantMessage) {
    var msgJson = JSON.stringify(event);

    console.log(msgJson);
    
    this._socket.send(msgJson);
  }
}

export enum EventMessageType {
  NextVariants,
  SelectVariant
}

export class EventMessage {
  public type!: EventMessageType;
}

export class NextVariantsMessage extends EventMessage {
  public variantsCodes: string[] = [];
}

export class SelectVariantMessage extends EventMessage {
  public selectedVariant!: string;
}
