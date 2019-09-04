import { IPosition, TokenType, IAttributeToken, IToken, IStringToken, ITagToken, IStringPart, StringPartType, IEventBindingToken } from "./token";
import { Injectable, registerType } from "../../../di";

const enum Context {
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
    interpolationEnd: "}}",
    openBracket: "(",
    closeBracket: ")"
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

// TODO: handle ' in template

/**
 * Tokenizes given template.
 */
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

    /**
     * Gets the next token of the initialized template.
     */
    nextToken() {
        if (this.isEnd()) {
            return this.createToken(TokenType.End);
        }

        this.skipWhiteSpace();

        if (this.isCommentStart()) {
            return this.createCommentToken();
        }

        if (this.shouldGetAttribute()) {
            return this.createAttributeToken();
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

    private createAttributeToken() {
        const attribute = this.getAttribute();
        const isEventBinding = attribute.key.startsWith(identifiers.openBracket) &&
                               attribute.key.endsWith(identifiers.closeBracket);
        const tryProcessEndOfTag = () => {
            this.skipWhiteSpace();
            if (this.isTagEnd() || this.isSelfClosingTagEnd(null)) {
                this.setContext(Context.AfterOpenTag);
            }
        };

        if (isEventBinding) {
            const eventBinding: IEventBindingToken = { type: TokenType.EventBinding, start: attribute.start };
            const eventName = attribute.key
                .replace(identifiers.openBracket, "")
                .replace(identifiers.closeBracket, "");

            eventBinding.eventName = eventName;
            eventBinding.eventHandler = attribute.value;

            tryProcessEndOfTag();
            return eventBinding;
        }

        tryProcessEndOfTag();
        return attribute;
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

        this.setContext(Context.InOpenTag);
        this.skipChars(identifiers.tagOpenBracket.length);
        this.skipWhiteSpace();
        this.initTagData(token);

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

    private getAttribute() {
        const attribute: IAttributeToken = this.createToken(TokenType.Attribute);

        if (this.context === Context.BeforeAttributeKey) {
            this.skipWhiteSpace();

            attribute.key = this.consumeUntil((ch) => ch !== identifiers.attributeKeyValueDelimiter && !isWhiteSpace(ch) && !this.isTagEnd() && !this.isSelfClosingTagEnd(null));
        }

        if (this.context === Context.AfterOpenTag) {
            return attribute;
        }

        this.setContext(Context.BeforeAttributeValue);
        this.skipChars(identifiers.attributeKeyValueDelimiter.length);
        this.skipChars(identifiers.quote.length);

        attribute.value = this.consumeUntil(c => c !== identifiers.quote);

        this.skipChars(identifiers.quote.length);
        this.setContext(Context.BeforeAttributeKey);
        this.skipWhiteSpace();

        return attribute;
    }

    private initTagData(token: ITagToken) {
        let name = "";

        this.setContext(Context.BeforeAttributeKey);

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

            if (token) {
                token.type = TokenType.SelfclosingTag;
            }

            return true;
        }

        return false;
    }

    private isTagEnd() {
        const isInsideTag = this.context === Context.InOpenTag ||
                            this.context === Context.BeforeAttributeKey ||
                            this.context === Context.BeforeAttributeValue;

        if (this.currentIndex + identifiers.tagCloseBracket.length <= this.length() &&
            this.template.substr(this.currentIndex, identifiers.tagCloseBracket.length) === identifiers.tagCloseBracket) {
                this.skipChars(identifiers.tagCloseBracket.length);

            if (isInsideTag) {
                this.setContext(Context.AfterOpenTag);
            }

            return true;
        }

        return false;
    }

    private setContext(ctx: Context) {
        this.context = ctx;
    }

    private shouldGetAttribute() {
        return this.context === Context.InOpenTag || this.context === Context.BeforeAttributeKey;
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
