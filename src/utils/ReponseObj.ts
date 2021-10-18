import { StatusCodes } from "src/constants"

export const responseObj = (data?: any) => {
    return {
        statusCode: StatusCodes.success,
        data,
        message: "OK"
    }
}