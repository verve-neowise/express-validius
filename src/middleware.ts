import { Schema } from "@verve-neowise/validius";
import { Request, Response, NextFunction } from "express";

export function body(schema: Schema) {
    return check(schema, "invalid body parameters", (req, res) => req.body)
}

export function query(schema: Schema) {
    return check(schema, "invalid query parameters", (req, res) => req.query)
}

export function url(schema: Schema) {
    return check(schema, "invalid url parameters", (req, res) => req.params)
}

function check(schema: Schema, errorMessage: string, dataProvider: (req: Request, res: Response) => any) {
    return (req: Request, res: Response, next: NextFunction) => {
        let data = dataProvider(req, res)
        let result = schema.validate(data)
        if (result.isFine()) {
            next()
        }
        else {
            res.status(403).json({
                message: errorMessage,
                errors: result.all()
            })
        }
    }
}