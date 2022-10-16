declare type input = {
    output: number;
    input: number[];
};
declare type rawInput = {
    output: string;
    input: number[];
};
export declare function formatData(data: rawInput[]): [Data: input[], Layers: number[]];
export {};
