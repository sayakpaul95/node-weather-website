const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

const port=process.env.PORT || 3000

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialPath=path.join(__dirname,'../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))
hbs.registerPartials(partialPath)


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Sayak Paul'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Sayak Paul'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title:'Help',
        helpText: 'This is some helpful text.',
        name:'Sayak Paul'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }={}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*',(req,res) => {
    res.render('error',{
        title:'error',
        errorText: 'Help article not found',
        name:'Sayak Paul'
    })
})

app.get('*',(req,res) => {
    res.render('error',{
        title:'error',
        errorText: '404 - Page not found',
        name:'Sayak Paul'
    })
})

app.listen(port, () => {
    console.log('Server is up on port '+port)
})



// nodemon src/app.js -e js,hbs