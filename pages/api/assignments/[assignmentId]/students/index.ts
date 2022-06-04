import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    switch(req.method) {
        case('GET'):
            // return all files uploaded by students 
            return res.status(200);
    }
}