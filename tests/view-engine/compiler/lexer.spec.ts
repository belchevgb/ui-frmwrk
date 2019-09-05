import { Lexer } from "../../../src/view-engine/compiler/lexer/lexer";
import { IStringToken, TokenType, ITagToken, StringPartType, IAttributeToken } from "../../../src/view-engine/compiler/lexer/token";
import { App } from "../../../src/app";

describe("Lexer tests", () => {
    beforeEach(() => {
        App.reinit();
    });

    describe("Should process comments correctly", () => {
        it("process single-line comment", () => {
            const text = " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed ";
            const comment = `<!--${text}-->`;
            const lexer = new Lexer();
            lexer.init(comment);
            const token = lexer.nextToken() as IStringToken;

            expect(token.type).toEqual(TokenType.Comment);
            expect(token.value).toEqual(text);
            expect(token.start).toEqual({ row: 0, col: 0 });
        });

        it("process muli-line comment", () => {
            const text = `
            x
            `;
            const comment = `<!--${text}-->`;
            const lexer = new Lexer();
            lexer.init(comment);
            const token = lexer.nextToken() as IStringToken;

            expect(token.type).toEqual(TokenType.Comment);
            expect(token.value).toEqual(text);
            expect(token.start).toEqual({ row: 0, col: 0 });
        });
    });

    describe("Should process tags correctly", () => {
        it("process open tag without attributes", () => {
            const tagName = "div";
            const tags = [`<${tagName}>`, `< ${tagName} >`];

            for (const tag of tags) {
                const lexer = new Lexer();
                lexer.init(tag);
                const token = lexer.nextToken() as ITagToken;

                expect(token.type).toEqual(TokenType.OpenTag);
                expect(token.name).toEqual("div");
                expect(token.start).toEqual({ row: 0, col: 0 });
            }
        });

        it("Shoul process open tag with attributes correctly", () => {
            const html = `<div attr1="attr" attr2></div>`;
            const lexer = new Lexer();

            lexer.init(html);

            const tagToken = lexer.nextToken() as ITagToken;
            expect(tagToken.type).toEqual(TokenType.OpenTag);

            const firstAttr = lexer.nextToken() as IAttributeToken;
            expect(firstAttr.type).toEqual(TokenType.Attribute);
            expect(firstAttr.key).toEqual("attr1");
            expect(firstAttr.value).toEqual("attr");

            const secondAttr = lexer.nextToken() as IAttributeToken;
            expect(secondAttr.type).toEqual(TokenType.Attribute);
            expect(secondAttr.key).toEqual("attr2");
        });

        it("process close tag", () => {
            const tagName = "div";
            const tag = `</ ${tagName} >`;
            const lexer = new Lexer();
            lexer.init(tag);
            const token = lexer.nextToken() as ITagToken;

            expect(token.type).toEqual(TokenType.CloseTag);
            expect(token.name).toEqual(tagName);
        });

        it("should process content", () => {
            const content = "content";
            const html = `<div>${content}</div>`;
            const lexer = new Lexer();

            lexer.init(html);

            const openTagToken = lexer.nextToken();
            expect(openTagToken.type).toEqual(TokenType.OpenTag);

            const contentToken = lexer.nextToken() as IStringToken;
            expect(contentToken.value).toEqual(content);

            const closeTagToken = lexer.nextToken();
            expect(closeTagToken.type).toEqual(TokenType.CloseTag);
        });

        it("process interpolations in content", () => {
            const content = "some text {{interpolation}} other text {{interpolation}}";
            const lexer = new Lexer();

            lexer.init(content);

            const token = lexer.nextToken() as IStringToken;

            expect(token.stringParts[0].value).toEqual("some text ");
            expect(token.stringParts[0].type).toEqual(StringPartType.Text);

            expect(token.stringParts[1].value).toEqual("interpolation");
            expect(token.stringParts[1].type).toEqual(StringPartType.Interpolation);

            expect(token.stringParts[2].value).toEqual(" other text ");
            expect(token.stringParts[2].type).toEqual(StringPartType.Text);

            expect(token.stringParts[3].value).toEqual("interpolation");
            expect(token.stringParts[3].type).toEqual(StringPartType.Interpolation);
        });

        it("tokenize sample html", () => {
            const html = `
            <div attr="attr">
                content
                <h1 attr2>dsadas</h1>
                <br />
                <!-- comment -->
            </div>`;
            const lexer = new Lexer();

            lexer.init(html);

            let token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.OpenTag);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.Attribute);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.Content);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.OpenTag);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.Attribute);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.Content);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.CloseTag);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.SelfclosingTag);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.Comment);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.CloseTag);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.End);
        });
    });
});