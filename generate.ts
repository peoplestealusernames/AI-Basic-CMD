import { writeFileSync } from "fs"

const colors: {
    input: [number, number, number]
    output: string
}[] = []

const reducer = 10

for (let r = 0; r < 255 / reducer; r++)
    for (let g = 0; g < 255 / reducer; g++)
        for (let b = 0; b < 255 / reducer; b++) {
            colors.push({
                input: [r * reducer, g * reducer, b * reducer],
                output: ((r * reducer + g * reducer + b * reducer) / 3) > 127.5 ? "white" : "black"
            })
        }

console.log(colors.length)

writeFileSync("./input.json", JSON.stringify(colors), { encoding: "ascii" })