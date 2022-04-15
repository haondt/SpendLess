import { ViewEnum } from "./ViewEnum";

export const ParserOperations: { [key: string]: ViewEnum } = {
    is: { id: 0, viewValue: "is" },
    isColumn: { id: 1, viewValue: "is column" },
    parseColumn: { id: 2, viewValue: "parse column" }
};