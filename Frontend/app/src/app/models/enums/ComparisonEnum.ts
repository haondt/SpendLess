class Comparison {
    id: Number;
    viewValue: string;
}

const Comparisons: { [key: string]: { id: number, viewValue: string } } = {
    lt: { id: 0, viewValue: "<"},
    lte: { id: 1, viewValue: "<="},
    gt: { id: 2, viewValue: ">"},
    gte: { id: 3, viewValue: ">="},
    e: { id: 4, viewValue: "="},
    ne: { id: 5, viewValue: "≠"}
}

export {
    Comparison,
    Comparisons
}