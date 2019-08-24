export const enum TokenType {
    End,
    OpenTag,
    CloseTag,
    SelfclosingTag,
    Comment,
    Content
}

export interface IPosition {
    row: number;
    col: number;
}

export interface IAttribute {
    key: string;
    value: string;
}

export interface IToken {
    type: TokenType;
    start: IPosition;
}

export interface ITagToken extends IToken {
    name: string;
    attributes?: IAttribute[];
}

export interface IStringToken extends IToken {
    value: string;
}