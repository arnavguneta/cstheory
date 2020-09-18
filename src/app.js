const path = require('path')
const express = require('express')
const hbs = require('hbs')
const apiCall = require('./utils/dfas')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

// paths for config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// hbs setup
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static dir to serve
app.use(express.static(publicPath))

app.get('/', (req,res) => {
    res.render('index', {
        title: 'Deterministic Finite Automaton',
        name: 'Arnav Guneta',
        message: 'Use this website to help compute the union and intersections of complicated DFAs'
    })
})

// post request for data
app.post('/api/dfa', (req,res) => {
    const data = apiCall(req.body.op,req.body.dfa_1,req.body.dfa_2)
    res.json({ data: data })
})

app.get('/union', (req,res) => {
    res.render('union', {
        title: 'Union of DFAs',
        name: 'Arnav Guneta',
        message: 'Enter Grafstate plaintext for DFAs 1 and 2 to compute their union DFA.'
    })
})

app.get('/intersection', (req,res) => {
    res.render('intersection', {
        title: 'Intersection of DFAs',
        name: 'Arnav Guneta',
        message: 'Enter Grafstate plaintext for DFAs 1 and 2 to compute their intersection DFA.'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title: 'Help',
        name: 'Arnav Guneta',
        message: 'Instructions on how to use this website'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help article not found',
        name: 'Arnav Guneta',
        message: 'The help page you were looking for was not found. Try again by going back to the help page.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Page not found',
        name: 'Arnav Guneta',
        message: 'The page you were looking for was not found.'
    })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})