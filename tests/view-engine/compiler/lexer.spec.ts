import { Lexer } from "../../../src/view-engine/compiler/lexer/lexer";
import { IStringToken, TokenType, ITagToken, StringPartType } from "../../../src/view-engine/compiler/lexer/token";

describe("Lexer tests", () => {
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
            const text = "\nx\n";
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
                expect(token.attributes).toEqual([]);
            }
        });

        it("process open tag with attributes", () => {
            const tagName = "div";
            const tag = `<${tagName} a1 a2="v2" a3 a4="v4">`;
            const lexer = new Lexer();
            lexer.init(tag);
            const token = lexer.nextToken() as ITagToken;

            expect(token.type).toEqual(TokenType.OpenTag);
            expect(token.name).toEqual("div");
            expect(token.start).toEqual({ row: 0, col: 0 });

            const attrs = token.attributes;

            expect(attrs[0]).toEqual({ key: "a1", value: null });
            expect(attrs[1]).toEqual({ key: "a2", value: "v2" });
            expect(attrs[2]).toEqual({ key: "a3", value: null });
            expect(attrs[3]).toEqual({ key: "a4", value: "v4" });
        });

        it("process self-closing tag without attributes", () => {
            const tagName = "div";
            const tags = [`<${tagName} />`, `< ${tagName} />`];

            for (const tag of tags) {
                const lexer = new Lexer();
                lexer.init(tag);
                const token = lexer.nextToken() as ITagToken;

                expect(token.type).toEqual(TokenType.SelfclosingTag);
                expect(token.name).toEqual("div");
                expect(token.start).toEqual({ row: 0, col: 0 });
                expect(token.attributes).toEqual([]);
            }
        });

        it("process self-closing tag with attributes", () => {
            const tagName = "div";
            const tag = `<${tagName} a1 a2="v2" a3 a4="v4" />`;
            const lexer = new Lexer();
            lexer.init(tag);
            const token = lexer.nextToken() as ITagToken;

            expect(token.type).toEqual(TokenType.SelfclosingTag);
            expect(token.name).toEqual("div");
            expect(token.start).toEqual({ row: 0, col: 0 });

            const attrs = token.attributes;

            expect(attrs[0]).toEqual({ key: "a1", value: null });
            expect(attrs[1]).toEqual({ key: "a2", value: "v2" });
            expect(attrs[2]).toEqual({ key: "a3", value: null });
            expect(attrs[3]).toEqual({ key: "a4", value: "v4" });
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
            <div>
                content
                <h1>dsadas</h1>
                <br />
                <!-- comment -->
            </div>`;
            const lexer = new Lexer();

            lexer.init(html);

            let token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.OpenTag);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.Content);

            token = lexer.nextToken();
            expect(token.type).toEqual(TokenType.OpenTag);

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