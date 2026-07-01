import { onRequest } from "firebase-functions/https";
import { Resend } from 'resend';

import { setGlobalOptions } from "firebase-functions/v2";

// Set the maximum instances to 10 for all functions
setGlobalOptions({ maxInstances: 10 });



export const sendEmail = onRequest(async (req, res) => {

    const resend = new Resend('re_Z7UDBY34_Q6HnpXic7hEfpCY1DaARwRB7');

    const {from, to, text, subject} = req.body;

    const error : string | null = checkInputs({
        to: to, 
        from: from, 
        subject: subject, 
        text: text
    });

    if(error != null){
        res.status(400).send({
            'success': false,
            'message': error
        });
        return;
    }

    try{
        const {data} = await resend.emails.send({
            from: from,
            to: to,
            text: text,
            subject: subject
        });

        // Call Resend
        res.send({
            'success': true,
            'message': `Email sent to ${to} from ${from}`
        });
        
        return;
    }
    catch(err){
        res.status(400).send({
            'success': false,
            'message': `${err}`
        });
    }

});


type checkInputsProps = {
    to: string,
    from: string,
    subject: string,
    text: string
}

function checkInputs({to, from, subject, text} : checkInputsProps) : string | null{
    if(to == undefined){
        return 'Missing to paramter';
    }

    if(text == undefined){
        return 'Missing text paramter';
    }

    if(subject == undefined){
        return 'Missing subject paramter';
    }

    if(from == undefined){
        return 'Missing from paramter';
    }

    return null;
}