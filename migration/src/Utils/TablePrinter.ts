import { OutputInterface, StyledOutput, TextUtilities } from "@mscs/console";

export class TablePrinter {

    private io: StyledOutput;

    public constructor(io: StyledOutput) {
        this.io = io;
    }

    public printTable(headers: string[], rows: (string | number)[][]) {
        const output = this.io.getOutput();

        const lengths = this.rotate([
            headers,
            ...rows,
        ]).map(items => Math.max(...items.map(item => item.toString().length)));

        output.writeln(this.getSeparator(lengths));
        output.writeln(this.formatRow(headers, lengths));
        output.writeln(this.getSeparator(lengths));

        for (const row of rows) {
            output.writeln(this.formatRow(row, lengths));
        }

        output.writeln(this.getSeparator(lengths));
    }

    private formatRow(row: (string | number)[], lengths: number[]) {
        return `|${row.map((content, index) => this.formatCell(content, index, lengths)).join("|")}|`;
    }

    private formatCell(content: string | number, index: number, lengths: number[]) {
        const value = content.toString();
        const length = TextUtilities.stripTags(value).length;
        const spaces = " ".repeat((lengths[index] - length) + 1 /* Space after */);

        return /* Space before => */ ` ${value}${spaces}`;
    }

    private getSeparator(lengths: number[]) {
        return `+${lengths.map(length => "-".repeat(length + 2 /* spaces around cell content */)).join("+")}+`;
    }

    private rotate(matrix: (string | number)[][]) {
        const result = [];

        for (let i = 0; i < matrix[0].length; i++) {
            const row = matrix.map(e => e[i]).reverse();

            result.push(row);
        }

        return result;
    }

}
