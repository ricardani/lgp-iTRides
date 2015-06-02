var Account = require('../models/account');
var sha256 = require('sha256');
var mandrill = require('node-mandrill')('Kj-1SGPKFICoSgUIo9OEqw');
//Tokens
var jwt = require('jsonwebtoken');
var secret_key = 'shhhhhhared-secret';

function sendMail(who, title, msg) {
    mandrill('/messages/send', {
        message: {
            to: [{
                email: who,
                name: "iTRides"
            }],
            from_email: "no-reply@LGPiTRides.com",
            subject: title,
            html: msg
        }
    }, function(error, response) {

    });
}

function register(req, res) {

    var email = req.body.email.toString();
    var emailDomain = email.substring(email.indexOf("@") + 1);
    if(emailDomain === "itgrow.pt" || emailDomain === "criticalsoftware.com") {

        Account.findOne({
            "email": req.body.email
        }, function(err,data){
            if(err) {
                res.json(err);
            }
            else if(data === null) {

                var hash, temp;
                hash = sha256(req.body.password);
                temp = req.body;
                temp.name = req.body.name;
                temp.password = hash;

                var person = new Account(temp);
                person.save(function(error, data) {
                    if (error) {
                        res.json(error);
                    } else {
                        var message = "Olá " + temp.name + "<br><br> Obrigado por se registar na aplicação iTRides.<br>" +
                            "Para poder usufruir de todos os nossos serviços, basta confirmar a sua inscrição, carregando na hiperligação abaixo.<br><br>" +
                            "<a href=\"https://itrides.herokuapp.com/user/confirmAccount?code=" + sha256(req.body.email + req.body.name) + "&email=" + req.body.email +"\">Siga esta ligação para ativar a sua conta.</a><br><br> " +
                            "Obrigado,<br>iTRides";

                        sendMail(req.body.email, "iTRides: Confirmação de Conta", message);
                        res.json(data);
                    }
                });
            }
            else {
                console.log("Invalid email: already in use.");
                res.json("AU");
            }
        });
    }
    else {
        console.log("Invalid email: must be from iTGrow(@itgrow.pt) or Critical Software(@criticalsoftware.com) domain.");
        res.json("WD");
    }
}

module.exports.reg = register;

function accountConfirmation(req, res) {
    Account.findOne({
        email: req.query.email
    }, function(err, user) {
        if (err || user === null) {
            res.writeHead(302, {
                'Location': 'accountConfirmed'
            });
            res.end();
        } else if (sha256(user.email + user.name) === req.query.code) {
            user.activated = true;
            user.save(function(err) {
                if (err) {
                    res.json(err);
                } else {
                    res.writeHead(302, {
                        'Location': 'accountConfirmed'
                    });
                    res.end();
                }
            });
        }else{
            res.writeHead(302, {
                'Location': 'accountConfirmed'
            });
            res.end();
        }
    });
}

module.exports.confirmAccount = accountConfirmation;

function login(req, res) {
    Account.findOne({
        email: req.body.email,
        password: sha256(req.body.password)
    }, function(err, data) {
        if (err) {
            res.sendStatus(404);
        } else if(data != null) {
            if (data.activated) {
                var profile = {
                    id: data.id
                };
                var token = jwt.sign(profile, secret_key, {expiresInMinutes: 60*24});
                res.json({activated: data.activated, token: token});
            }else{
                res.sendStatus(400);
            }
        }else{
            res.sendStatus(404);
        }
    });
}

module.exports.checkLogin = login;


function resetPassword(req, res) {

    Account.findOneAndUpdate(
        {
            email: req.body.email,
            activated: true
        },
        {
            'password' : sha256(req.body.password)
        },
        function(err, data) {
            if(err || data === null) {
                res.json(err);
            } else {
                var message = 'Olá ' + data.name + '<br><br> ' +
                    'Foi requisitada, por parte da sua conta, uma alteração da palavra passe.<br><br>' +
                    'A sua nova palavra passe é: ' + req.body.password + '<br><br>' +
                    'Aconselhamos, para sua segurança, que a mude o mais brevemente possivel.<br>' +
                    'Pode-o fazer na opção "Alterar dados da conta" no separador "Perfil"<br><br>' +
                    'Atenciosamente,<br>' + 'iTRides';
                sendMail(req.body.email,'iTRides: Nova Password Gerada', message);
                res.json(data);
            }
        }
    );
}

module.exports.passwordReset = resetPassword;
