import { Base64 } from "../src/Utils/Base64";

describe("Base64", () => {

    const plain = "abc def ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !\"§ $%& /() =?* '<> #|; ²³~ @`´.";

    const encoded = "YWJjIGRlZiBnaGkgamtsIG1ubyBwcXJzIHR1diB3eHl6IEFCQyBERUYgR0hJIEpLTCBNTk8gUFFSUyBUVVYgV1hZWiAhIsKnICQlJiAvKCkgPT8qICc8PiAjfDsgwrLCs34gQGDCtC4=";

    describe("encode", () => {
        it("should encode text to base64", () => {
            // Arrange

            // Act
            const actual = Base64.encode(plain);

            // Assert
            expect(actual).toBe(encoded);
        });
    });

    describe("decode", () => {
        it("should decode base64 to text", () => {
            // Arrange

            // Act
            const actual = Base64.decode(encoded);

            // Assert
            expect(actual).toBe(plain);
        });
    });

});
