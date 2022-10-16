type input = {
    output: number
    input: number[]
}

type rawInput = {
    output: string
    input: number[]
}

//TODO: import as config
const Delta = 0.1

const AgentAmount = 100
// Layers is count
// Amount in layers is element
const HiddenLayers = [10]

function IndexOutputs(data: rawInput[]): string[] {
    const output = data.map(e => e.output)
    return output.filter((e, i) => output.indexOf(e) === i)
}

function CheckInputs(data: rawInput[]): number {
    const length = data[0].input.length
    if (!length)
        throw new Error("No input given on input 1")

    const outliers = data.filter(e => e.input.length !== length)
    if (outliers.length > 0)
        throw new Error(`Input lengths did not match data set 1 (l=${length})`)

    return length
}

export function formatData(data: rawInput[]): [Data: input[], Layers: number[]] {
    const Inputs = CheckInputs(data)
    const Outputs = IndexOutputs(data)

    const Layers = [Inputs, ...HiddenLayers, Outputs.length]

    const OutHash: { [key: string]: number } = {}
    Outputs.forEach((e, i) => OutHash[e] = i)

    const Data: input[] = data.map(e => { return { input: e.input, output: OutHash[e.output] } })

    return [Data, Layers]
}
