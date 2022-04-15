import { ViewEnum } from "./ViewEnum"

export const DetectorOperations: { [key: string]: ViewEnum } = {
    isNotEmpty: { id: 0, viewValue: "is not empty"},
    isEmpty: {id: 1, viewValue: "is empty"},
    is: { id: 2, viewValue: "is"},
    matchesRegularExpression: { id: 3, viewValue: "matches regular expression"},
}