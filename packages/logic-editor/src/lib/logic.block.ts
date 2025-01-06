export class LogicBlock {

    public code!: string;
            
    public leftParameter!: LogicParameter;

    public rightParameter!: LogicParameter;
}

export class LogicParameter {
    public code!: string;

    public properties!: LogicParameterProperty[];
}

export class LogicParameterProperty {
    public type!: string;

    public name!: string;

    public value!: string;
}