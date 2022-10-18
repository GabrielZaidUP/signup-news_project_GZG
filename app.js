const express = require("express");
const request = require("request");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.router("/").get((req, res) => {
        res.sendFile(__dirname + "/signup.html");
        }).post("/", (req, res) => {
        const fName = req.body.fName;
        const lName = req.body.lName;
        const email = req.body.email;

        var data = {
            members: [{
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                              }
                        }]
                 }
        var jsonData = JSON.stringify(data);
        const listId = "add4f250d";
        const apiKey = "2114e84123e34232ba056189595d6b4b-us8";
        const url = "https://us8.api.mailchimp.com/3.0/lists/" + listId;
        const options = {
            method: "POST",
            auth: "0244959up:" + apiKey
        }

        const name = "<li>name</li><li>callback</li>";
        var mailRequest = https.request(url, options, (response) => {
            if(response.statusCode === 200) {
                response.on("data", (data) => {
                    var jsonResp = JSON.parse(data);
                    if(jsonResp["error_count"] === 0) {
                        res.render(__dirname + "/success.html", {name:name});
                        console.log("success!!")
                    } else {
                        res.render(__dirname + "/failure.html", {name:name});
                        console.log(jsonResp.errors[0]["error_code"]);
                        console.log(jsonResp.errors[0]["error"]);
                    }
                }).on("error", (e) => {
                    res.render(__dirname + "/failure.html", {name:name});
                });
            } else {
                res.render(__dirname + "/failure.html", {name:name});
            }
        });
        mailRequest.write(jsonData);
        mailRequest.end();
    });


app.get("/success", (req, res) => {
    res.redirect("/");
});

app.get("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
