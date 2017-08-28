const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailre = require('nodemailer');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Welcome'
    })
});

app.get('/about', (req, res) => {
    res.render('about')
});

app.get('/contact', (req, res) => {
    res.render('contact')
});
app.post('/contact/send', (req, res) => {
    let transporter = nodemailre.createTransport({
        service: 'Gmail',
        auth: {
            user: 'edikbastin@gmail.com',
            pass: '***'
        }
    });
    let mailObject = {
        from: 'mail',
        to: 'edikbastin@gmail.com',
        subject: 'Website submittion',
        text: `Submition \n Name : ${req.body.name} \n Email: ${req.body.mail} \n Message: ${req.body.message}`,
        html: `<p>
            Name : ${req.body.name} <br> Email: ${req.body.mail} <br> Message: ${req.body.message} 
        </p>`
    };

    transporter.sendMail(mailObject, (error, info) => {
        if (error) {
            console.log(error);
            res.redirect('/');
        } else {
            console.log('message sent' + info.responses);
            res.redirect('/');
        }

    });
});

app.listen(3000);

console.log('Server is running on the port 3000');