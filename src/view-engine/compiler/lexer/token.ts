export const enum TokenType {
    End,
    OpenTag,
    CloseTag,
    SelfclosingTag,
    Comment,
    Content,
    Attribute,
    EventBinding
}

export const enum AttributeType {
    Attribute,
    EventBinding
}

export interface IPosition {
    row: number;
    col: number;
}

export interface IAttributeToken extends IToken {
    key?: string;
    value?: string;
}

export interface IEventBindingToken extends IToken {
    eventName?: string;
    eventHandler?: string;
}

export interface IToken {
    type: TokenType;
    start: IPosition;
}

export interface ITagToken extends IToken {
    name: string;
}

export interface IStringToken extends IToken {
    value: string;
    stringParts: IStringPart[];
}

export enum StringPartType {
    Text,
    Interpolation
}

export interface IStringPart {
    value: string;
    type: StringPartType;
}