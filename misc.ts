
//MISC
export function RandomIndex(arr: any[]) {
    return Math.floor(Math.random() * arr.length)
}

export function NormalizeArray(arr: number[]) {
    let max = arr[0]
    for (const n of arr)
        if (n > max)
            max = n

    if (max === 0)
        return arr.map(() => 0)
    return arr.map(e => e / max)
}

export function ArrayAvg(arr: number[]) {
    let sum = 0;
    for (const n of arr)
        sum += n

    return (sum / arr.length)
}