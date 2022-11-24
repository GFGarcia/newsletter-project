const bodyParser = require("body-parser");
const { response } = require("express");
const request = require("request");
const express = require("express");
const https = require("https");
const port = 3000;

const app = express();

/* Serve static files such as images, CSS files, and JavaScript files */
/* public: Nome do arquivo estático */
app.use(express.static("public"));
/* Uso do body-parser através do express */
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    /* Varíaveis configuradas como const pois não irão midar: Boa prática!!! */
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    /* Variável criada para: 1. Capturar os dados do form, 2. Transformar em JSON e 3. Enviar para API MailChimp */
    const data = {
        /* Infos extraídas em: https://mailchimp.com/developer/marketing/api/list-members/add-member-to-list/ */
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    /* Visto em: https://us9.admin.mailchimp.com/lists/settings/merge-tags?id=1036289 */
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    /* Transforma os dados em string JSON */
    const jsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/a582276793";

    /* Options para o método request: https://nodejs.org/api/http.html#httprequestoptions-callback */
    const options = {
        method: "POST",
        /* https://mailchimp.com/developer/marketing/guides/quick-start/#generate-your-api-key. Ver Make your first API call: curl -sS --user */
        /* Mailchimp exige autenticação. Sintaxe: <qualquer coisa>:chaveAPI */
        auth: "guilherme1:bd4d5bec6c6c59291027a158053acb6e-us9"
    }

    /* https://nodejs.org/api/https.html#httpsrequesturl-options-callback */
    const request = https.request(url, options, function(response) {
        /* Resposta do status do servidor mailchimp em relação a requisição */
        let result = response.statusCode;

        if(result === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
    })
    
    /* Envia os dados obtidos do form para o servidor Mailchimp */
    request.write(jsonData);
    request.end();
});

app.post("/home", function (req, res) {
    /* Redireciona o usuário para a home */
    res.redirect("/");
});

/* process.env.PORT: Porta do servidor que o Heroku escolher para o app. Variável dinâmica para definição da porta. */
/* Ou escuta a porta 3000 para rodar local */
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port: " + port);
});


/* Mailchimp Endpoint */
/* https://us9.api.mailchimp.com/3.0/ */

/* Server Prefix || Data Center {dc} */
/* us9 */

/* API Key */
/* bd4d5bec6c6c59291027a158053acb6e-us9 */

/* Mailchimp Audience/List ID */
/* a582276793 */