import { IPosition, TokenType, IAttribute, IToken, IStringToken, ITagToken, IStringPart, StringPartType } from "./token";
import { Injectable } from "../../../di";

enum Context {
    None,
    InOpenTag,
    Text,
    Comment,
    AfterOpenTag,
    AfterCloseTag,
    BeforeAttributeKey,
    BeforeAttributeValue
}

const identifiers = {
    commentStart: "<!--",
    commentEnd: "-->",
    tagOpenBracket: "<",
    tagCloseBracket: ">",
    selfClosingTagEnd: "/>",
    attributeKeyValueDelimiter: "=",
    quote: '"',
    closeTagStart: "</",
    interpolationStart: "{{",
    interpolationEnd: "}}"
};

const matchers = {
    whiteSpace: /\s/,
    newLine: /[\r\n]/
};

function isWhiteSpace(char: string) {
    return matchers.whiteSpace.test(char);
}

function isNewLine(char: string) {
    return matchers.newLine.test(char);
}

@Injectable
export class Lexer {
    private currentIndex: number;
    private context: Context;
    private position: IPosition;
    private template: string;

    init(template: string) {
        this.context = Context.None;
        this.currentIndex = 0;
        this.position = { row: 0, col: 0 };
        this.template = template;
    }

    nextToken() {
        if (this.isEnd()) {
            return this.createToken(TokenType.End);
        }

        this.skipWhiteSpace();

        if (this.isCommentStart()) {
            return this.createCommentToken();
        }

        if (this.startsOpenTag()) {
            return this.createOpenTagToken();
        }

        if (this.startsCloseTag()) {
            return this.createCloseTagToken();
        }

        return this.createContentToken();
    }

    private createToken(type: TokenType): IToken {
        return { type, start: { ...this.position } };
    }

    private createContentToken() {
        const token = this.createToken(TokenType.Content) as IStringToken;
        token.value = this.consumeUntil(c => !this.isEnd() && c !== identifiers.tagOpenBracket);
        token.stringParts = this.getContentParts(token.value);

        return token;
    }

    private getContentParts(content: string): IStringPart[] {
        const parts: IStringPart[] = [];

        let currentPartValue = "";
        for (let i = 0; i < content.length; i++) {
            if (content.substr(i, identifiers.interpolationStart.length) === identifiers.interpolationStart) {
                parts.push({ value: currentPartValue, type: StringPartType.Text });
                currentPartValue = "";
                i += identifiers.interpolationStart.length;

                while (content.substr(i, identifiers.interpolationStart.length) !== identifiers.interpolationEnd) {
                    currentPartValue += content[i];
                    i++;
                }

                parts.push({ value: currentPartValue, type: StringPartType.Interpolation });
                i += identifiers.interpolationEnd.length - 1;
                currentPartValue = "";
                continue;
            }

            currentPartValue += content[i];

            if (i === content.length - 1) {
                parts.push({ value: currentPartValue, type: StringPartType.Text });
            }
        }

        return parts;
    }

    private createCommentToken() {
        const token = this.createToken(TokenType.Comment) as IStringToken;
        token.value = "";

        this.skipChars(identifiers.commentStart.length);

        while (!this.isEnd()) {
            if (this.isCommentEnd()) {
                this.skipChars(identifiers.commentEnd.length);
                break;
            }

            token.value += this.consumeChar();
        }

        return token;
    }

    private createOpenTagToken() {
        const token = this.createToken(TokenType.OpenTag) as ITagToken;
        token.attributes = [];

        this.setContext(Context.InOpenTag);
        this.skipChars(identifiers.tagOpenBracket.length);
        this.skipWhiteSpace();
        this.initTagData(token);

        if (this.context === Context.InOpenTag) {
            token.attributes = this.getAttributes(token);
        }

        this.setContext(Context.AfterOpenTag);
        return token;
    }

    private createCloseTagToken() {
        const token = this.createToken(TokenType.CloseTag) as ITagToken;

        this.skipChars(identifiers.closeTagStart.length);
        this.skipWhiteSpace();

        token.name = this.consumeUntil(c => !isWhiteSpace(c) && c !== identifiers.tagCloseBracket);

        this.skipWhiteSpace();
        this.skipChars(identifiers.tagCloseBracket.length);

        return token;
    }

    private getAttributes(token: ITagToken) {
        const attributes: IAttribute[] = [];

        this.setContext(Context.BeforeAttributeKey);

        while (!this.isTagEnd() && !this.isSelfClosingTagEnd(token)) {
            const attribute: IAttribute = { key: null, value: null };

            if (this.context === Context.BeforeAttributeKey) {
                this.skipWhiteSpace();

                attribute.key = this.consumeUntil((ch) => ch !== identifiers.attributeKeyValueDelimiter && !isWhiteSpace(ch));
                if (isWhiteSpace(this.currentChar())) {
                    attributes.push(attribute);
                    continue;
                }

                this.setContext(Context.BeforeAttributeValue);
                this.skipChars(identifiers.attributeKeyValueDelimiter.length);
            }

            this.skipChars(identifiers.quote.length);

            attribute.value = this.consumeUntil(c => c !== identifiers.quote);
            attributes.push(attribute);

            this.skipChars(identifiers.quote.length);
            this.setContext(Context.BeforeAttributeKey);
            this.skipWhiteSpace();
        }

        return attributes;
    }

    private initTagData(token: ITagToken) {
        let name = "";

        while (!this.isEnd()) {
            let shouldBreak = false;

            if (isWhiteSpace(this.currentChar())) {
                this.skipWhiteSpace();
                shouldBreak = true;
            }

            if (this.isSelfClosingTagEnd(token) || this.isTagEnd()) {
                this.setContext(Context.AfterOpenTag);
                shouldBreak = true;
            }

            if (shouldBreak) {
                break;
            }

            name += this.consumeChar();
        }

        token.name = name;
    }

    private isSelfClosingTagEnd(token: ITagToken) {
        if (this.currentIndex + identifiers.selfClosingTagEnd.length <= this.length() &&
            this.template.substr(this.currentIndex, identifiers.selfClosingTagEnd.length) === identifiers.selfClosingTagEnd) {
            this.skipChars(identifiers.selfClosingTagEnd.length);
            token.type = TokenType.SelfclosingTag;
            return true;
        }

        return false;
    }

    private isTagEnd() {
        if (this.currentIndex + identifiers.tagCloseBracket.length <= this.length() &&
            this.template.substr(this.currentIndex, identifiers.tagCloseBracket.length) === identifiers.tagCloseBracket) {
                this.skipChars(identifiers.tagCloseBracket.length);
                return true;
        }

        return false;
    }

    private setContext(ctx: Context) {
        this.context = ctx;
    }

    private startsOpenTag() {
        const char = this.currentChar();
        const isNotCloseTagStart = `${char}${this.template[this.currentIndex + 1]}` !== identifiers.closeTagStart;

        return char === identifiers.tagOpenBracket && isNotCloseTagStart;
    }

    private startsCloseTag() {
        const char = this.currentChar();
        const isCloseTagStart = `${char}${this.template[this.currentIndex + 1]}` === identifiers.closeTagStart;

        return char === identifiers.tagOpenBracket && isCloseTagStart;
    }

    private isCommentStart() {
        if (this.currentIndex + identifiers.commentStart.length > this.length()) {
            return false;
        }

        return this.template.substr(this.currentIndex, identifiers.commentStart.length) === identifiers.commentStart;
    }

    private isCommentEnd() {
        if (this.currentIndex + identifiers.commentEnd.length > this.length()) {
            return false;
        }

        return this.template.substr(this.currentIndex, identifiers.commentEnd.length) === identifiers.commentEnd;
    }

    private skipWhiteSpace() {
        while (!this.isEnd()) {
            const char = this.currentChar();
            if (!isWhiteSpace(char)) {
                break;
            }

            this.consumeChar();
        }
    }

    private length() {
        return this.template.length;
    }

    private isEnd() {
        return this.currentIndex === this.length();
    }

    private currentChar() {
        return this.template[this.currentIndex];
    }

    private skipChars(count) {
        for (let i = 0; i < count; i++) {
            this.consumeChar();
        }
    }

    private consumeUntil(verify: (ch: string) => boolean) {
        let val = "";

        while (verify(this.currentChar())) {
            val += this.consumeChar();
        }

        return val;
    }

    private consumeChar() {
        const char = this.template[this.currentIndex++];

        // TODO: handle \n\r
        if (!this.isEnd()) {
            if (isNewLine(char)) {
                this.position.col = 0;
                this.position.row++;
            } else {
                this.position.col++;
            }
        }

        return char;
    }
}