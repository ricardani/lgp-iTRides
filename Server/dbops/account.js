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
    }, function(error, response) { //uh oh, there was an error
        if (error) console.log(JSON.stringify(error));
        //everything's good, lets see what mandrill said
        else console.log(response);
    });
}

function register(req, res) {
    var hash, temp;
    hash = sha256(req.body.password);
    temp = req.body;
    temp.name = req.body.firstName + " " + req.body.lastName;
    temp.password = hash;
    var person = new Account(temp);
    person.save(function(error, data) {
        if (error) {
            res.json(error);
        } else {
            res.json(data);
        }
    });

    sendMail(req.body.email, "iTRides Account Confirmation", "Hello, Confirmation Link: <br><br> <a href=\"http://localhost:5000/user/confirmAccount?code=" + sha256(req.body.email + req.body.name) + "&email=" + req.body.email +"\"> LINK </a> <br><br> LGP iTRides");
}

module.exports.reg = register;

function accountConfirmation(req, res) {
    Account.findOne({
        email: req.query.email
    }, function(err, user) {
        if (sha256(user.email + user.name) === req.query.code) {
            user.activated = true;
            user.save(function(err) {
                if (err) {
                    res.json(err);
                } else {
                    res.json('Account confirmed');
                }
            });
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

    var message = 'Caro/a Utilizador(a) <br><br> ' + 
                'Foi requisitada, por parte da sua conta, uma alteração da palavra passe.<br><br>' +
                'A sua nova palavra passe é: ' + req.body.password + '<br><br>' +
                'Aconselhamos, para sua segurança, que a mude o mais brevemente possivel.<br>' + 
                'Pode-o fazer na opção "Alterar dados da conta" no separador "Perfil"<br><br>' + 
                'Atenciosamente,<br>' + 'iTRides';

    Account.update(
        {'email': req.body.email},
        {
            'password' : sha256(req.body.password),
        },
        { upsert: true },
        function(err, data) {
            if(err) {
                res.json(err);
            } else {
                sendMail(req.body.email,'iTRides: Nova Password Gerada', message);
                res.json(data);
            }
        }
    );
}

module.exports.passwordReset = resetPassword;
