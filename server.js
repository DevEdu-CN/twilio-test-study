require('dotenv').config();
const express = require("express");
const app = express();

const client = require("twilio")(
    process.env.YOUR_ACCOUNT_SID,
    process.env.YOUR_AUTH_TOKEN
  );


app.get("/", (req, res) => {
    res.status(200).send({
        message: "Server is running :D",
    });
});

app.get("/sendcode", (req, res) => {
    client.verify.v2
        .services(process.env.YOUR_SID_SERVICE)
        .verifications.create({
           to: `+${req.query.phonenumber}`,
           channel: req.query.channel === "call" ? "call" : "sms",
        }).then((data) => {
            res.status(200).send({
                message: "Verification is sent!!",
                phonenumber: req.query.phonenumber,
                data,
            });
        }).catch((error) => {
            console.error(error);
            res.status(500).send({ message: "Erro ao enviar verificação" });
        });
    });

app.get("/verify", (req, res) => {
    client.verify.v2
        .services(process.env.YOUR_SID_SERVICE)
        .verificationChecks.create({
            to: `+${req.query.phonenumber}`,
            code: req.query.code,
        })
        .then((data) => {
            if(data.status === "approved") {
                res.status(200).send({
                    message: "User is Verified!!",
                    data,
                });
            }else {
                res.status(400).send({
                    message: "User is not Verified",
                    data,
                });
            }
        });
});

app.listen(5000, () => {
    console.log(`Server is running at port 5000`);
})

