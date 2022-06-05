import { NextApiRequest, NextApiResponse } from "next";

// GET: return all files uploaded by students as a zip archive 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    switch(req.method) {
        case('GET'):
            return res.status(200);
    }
}