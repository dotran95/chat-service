import { StatusCodes } from "src/constants"

export const responseObj = (data?: any, meta?: any) => {
    return {
        statusCode: StatusCodes.success,
        data,
        meta,
        message: "OK"
    }
}