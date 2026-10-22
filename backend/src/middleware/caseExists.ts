import { Request, Response, NextFunction } from "express"
import { Case } from "../models/Case";

declare global {
    namespace Express {
        interface Request {
            clinicalCase: Case
        }
    }
}

export const caseExists = async( req: Request, res: Response, next: NextFunction ) => {
    const { caseId } = req.params;

    const clinicalCase = await Case.findOne({
        where: { id: caseId }
    });

    if(!clinicalCase) {
        const error = new Error("El caso no existe");
        return res.status(404).send( { error: error.message } );
    }

    if( clinicalCase.teacher_id !== req.user.id && req.user.rol !== "teacher" ) {
        const error = new Error("Accion no permitida");
        return res.status(400).send( { error: error.message } );
    }

    req.clinicalCase = clinicalCase;
    next();
}