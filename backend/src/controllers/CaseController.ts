import { Request, Response } from "express"

export class CaseController {

    static createCase = ( req : Request, res: Response ) => {
        try {
            
        } catch (error) {
            return res.status(500).json( { error: "Error interno del servidor" } );
        }
    }
}