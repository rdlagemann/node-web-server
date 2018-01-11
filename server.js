const express = require('express');
const hbs = require('hbs'); // handlebars view engine
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.locals.title = "Teste com Express";

// handlebars partials & helpers
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// app level express middlewares 

app.use((req, res, next) => {
    let now = new Date().toString();
    let serverLog = `${now} : ${req.method} ${req.url}`;
    console.log(serverLog);
    fs.appendFileSync('server.log', serverLog + "\n");

    next();
});

app.set('view engine', 'hbs');

// definindo o public depois do app.use -> maintenance( sem next()) fica garantido
// que não será possível acessar paginas dentro do public (como help.html)
// mas também perdem-se os estilos css que estiverem lá
// ou seja, a página maintenance fica sem estilo
app.use(express.static(__dirname + '/public'));

// app.use((req, res, next) => {
//     res.render("maintenance.hbs", {
//         pageTitle: "Under Maintenance"
//     });
    
//     // next(); descomentar para ter pagina "em manutenção"
// });

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: "Home",
        welcomeMessage: "Hello! Welcome to nodeJS + express test"
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About'
    });
});

app.get("/bad", (req, res) => {
    res.send("<h1 style='color:red'>Unable to reach the page");
});

app.listen(port, () => {
    console.log("App is listen on port " + port);
});