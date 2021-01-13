import { OutputInterface } from "@mscs/console";

export class TablePrinter {

    private output: OutputInterface;

    public constructor(output: OutputInterface) {
        this.output = output;
    }

    public printTable(headers: string[], rows: (string | number)[][]) {
        const lengths = this.rotate([
            headers,
            ...rows,
        ]).map(items => Math.max(...items.map(item => item.toString().length)));

        this.output.writeln(this.getSeparator(lengths));
        this.output.writeln(this.formatRow(headers, lengths));
        this.output.writeln(this.getSeparator(lengths));

        for (const row of rows) {
            this.output.writeln(this.formatRow(row, lengths));
        }

        this.output.writeln(this.getSeparator(lengths));
    }

    private formatRow(row: (string | number)[], lengths: number[]) {
        return `|${row.map((content, index) => this.formatCell(content, index, lengths)).join("|")}|`;
    }

    private formatCell(content: string | number, index: number, lengths: number[]) {
        const spaces = " ".repeat((lengths[index] - content.toString().length) + 1 /* Space after */);

        return /* Space before => */ ` ${content}${spaces}`;
    }

    private getSeparator(lengths: number[]) {
        return `|${lengths.map(length => "-".repeat(length + 2 /* spaces around cell content */)).join("|")}|`;
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
