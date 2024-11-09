export class ComponentArgument {
    public name!: string;
    public value!: string;
}

export class ClientComponent {
    public code!: string;
    public arguments: ComponentArgument[] = [];
}