import "express";
export {};
declare global {
    namespace Express {
        interface Request {
            user_id?: string;
        }
    }
}
//# sourceMappingURL=expressTypes.d.ts.map