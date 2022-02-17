const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/subscribe", (req, res) => {
  const { firstName, lastName, email, company } = req.body;

  if (!firstName || !lastName || !email) {
    res.status(400).send("Please fill all fields");
    return;
  } else {
    console.log(res.body);
  }

  //construct request data
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          COMPANY: company,
        },
      },
    ],
  };

  const postData = JSON.stringify(data);

  const options = {
    //mailchimp default url prefixed with your server (us14) and list_id
    url: `https://us14.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`,
    method: "POST",
    headers: {
      //your api key prefixed with "auth"
      Authorization: `auth ${process.env.API_KEY}`,
    },
    body: postData,
  };

  request(options, (err, response, body) => {
    if (err) {
      res.status(400).send("INTERNAL SERVER ERROR");
      // return;
    } else if (response.statusCode === 200) {
      res.status(200).send(response);
      // return;
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));
