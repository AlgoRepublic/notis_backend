const { aysncMiddleware } = require('../../../../../middlewares/async')
const { sendEmail } = require('../../../../../utils/email')

const send = aysncMiddleware(async (req, res, next) => {
    const { name, email, subject, message } = req.body
    const Textmessage = `<div style="color:#000000"> 
                            <div style="display:flex;">
                                <div style="min-width:8%"><strong>Name : </strong></div>
                                <div>${name}</div>
                            </div>
                            <div style="display:flex;">
                                <div style="min-width:8%"><strong>Email : </strong></div>
                                <div>${email}</div>
                           </div>
                            <div style="display:flex;">
                                <div style="min-width:8%"><strong>Subject : </strong></div>
                                <div>${subject}</div>
                            </div>
                            <div style="display:flex;">
                                <div style="min-width:8%"><strong>Message : </strong></div>
                                <div>${message}</div>
                            </div>     
                        <div>
    `

    const emailOptions = {
        subject: 'Notis App Contact ',
        text: Textmessage,
    }

    await sendEmail(res, emailOptions)
})

module.exports = send
