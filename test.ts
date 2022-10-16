import { GPU } from "gpu.js/src";


const gpu = new GPU({ mode: "gpu" })

const kernal = gpu.createKernel(function (a: number[]) {
    return 10
}).setDynamicOutput(true)

const arr = [1, 2, 3, 4, 5]
console.log(kernal.setOutput([40, 5])(arr))