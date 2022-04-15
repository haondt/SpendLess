import { DetectorComparisons } from "../enums/DetectorComparisons";
import { DetectorOperations } from "../enums/DetectorOperations";
import { ParserOperations } from "../enums/ParserOperations";

export class TransactionDatapointMappingModel {
    isDefault: boolean = false;

    detectorColumn: number | undefined;
    detectorOperation: number = DetectorOperations['isNotEmpty'].id;
    detectorRegularExpression: string = "";
    detectorComparison: number = DetectorComparisons['e'].id;
    detectorStringValue: string = "";
    detectorValueIsNumeric: boolean = false;

    parserDatapoint: number | undefined;
    parserOperation: number = ParserOperations['is'].id;
    parserNumericValue: number = 0;
    parserStringValue: string = "";
    parserColumn: number | undefined;
    parserInvertValue: boolean = false;;
    parserDateTimeValue: string | undefined;
    parserBoolValue: boolean = false;

}