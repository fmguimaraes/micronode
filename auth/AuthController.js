"use strict"
var UserModel = require('../models/user.model.js')
var config = require('../consts/config');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const RESPONSES = require('../consts/responses')

function encrypt(text) {
    const hashPassword = bcrypt.hashSync(text);

    return hashPassword
};


function decrypt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function create24hToken(id) {
    var returnValue = null;

    try {
        returnValue = jwt.sign({ _id: id }, config.secret, {
            expiresIn: 86400
        });
    } catch (e) {
        console.log(e);
        returnValue = e;
    }

    return returnValue;
};

function comparePasswords(password, dbPassword) {
    return (!!password && !!dbPassword) ? bcrypt.compareSync(password, dbPassword) : false;
}

async function verifyToken(token) {
    if (!token) {
        return false;
    }

    return new Promise(function (resolve, reject) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        });
    });
}

function hasToken(req) {
    return !!req.headers['authorization'];;
};

async function decryptToken(token) {
    var reason, tokenData = null;

    try {
        tokenData = await verifyToken(token)
    }
    catch (err) {
        reason = err;
        tokenData = null;
    }

    return tokenData;
}


async function validateStoredToken(token) {
    let tokenData = await decryptToken(token);
    let isStoredToken = null;
    if(!!tokenData) {
        let model = new UserModel();
        let response = await model.read({ _id: tokenData._id });
        isStoredToken = !!response[0] && !!response[0].token &&
            response[0].token ===  token;
    }


    return isStoredToken
}

async function tokenRequired(req, res, next) {
    let isStoredToken = false;

    if(hasToken(req)) {
        isStoredToken = await validateStoredToken(req.headers['authorization']);
    }

    if (!hasToken(req)) {
        res.status(401).send(RESPONSES.TOKEN_NOT_PROVIDED)
    } else if (!isStoredToken) {
        res.status(401).send(RESPONSES.INVALID_TOKEN)
    } else {
        next()
    }
};

module.exports = { tokenRequired, comparePasswords, encrypt, create24hToken, decryptToken };