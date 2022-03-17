const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");


//Aqui tienen otra forma de llamar a cada uno de los modelos
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                return res.status(200).json({
                    total: movies.length,
                    data: movies,
                    status: 200
                })
                //res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                return res.status(200).json({
                    data: movie,
                    status: 200
                })
                //res.render('moviesDetail.ejs', {movie})
            })
    },
    'guardar': (req, res) => {
        return res.json(req.body)
        //db.Movie.create(req.body)
        //    .then(movie => {
        //        return res.status(200).json({
        //            data: movie,
        //            status: 200,
        //            created: 'ok'
        //        })
        //    })
    },
    'delete': (req, res) => {
        db.Movie.destroy({
            where: {id: req.params.id}})
            .then((response) => {
                return res.json(response)
                })
            },
            
    add: function (req, res) {
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
        .all([promGenres, promActors])
        .then(([allGenres, allActors]) => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesAdd'), {allGenres,allActors})})
            .catch(error => res.send(error))
        },

    create: function (req,res) {
        Movies
        .create(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            }
            )
            .then(()=> {
                return res.redirect('/movies')})            
                .catch(error => res.send(error))
            },   

    edit: function(req,res) {
        let movieId = req.params.id;
        let promMovies = Movies.findByPk(movieId,{include: ['genre','actors']});
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        Promise
        .all([promMovies, promGenres, promActors])
        .then(([Movie, allGenres, allActors]) => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesEdit'), {Movie,allGenres,allActors})})
            .catch(error => res.send(error))
        },

    update: function (req,res) {
        let movieId = req.params.id;
        Movies
        .update(
            {
                title: req.body.title,
                rating: req.body.rating,
                awards: req.body.awards,
                release_date: req.body.release_date,
                length: req.body.length,
                genre_id: req.body.genre_id
            },
            {
                where: {id: movieId}
            })},

    delete: function (req,res) {
        let movieId = req.params.id;
        Movies
        .findByPk(movieId)
        .then(Movie => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesDelete'), {Movie})})
            .catch(error => res.send(error))
        },

    destroy: function (req,res) {
        let movieId = req.params.id;
        Movies
        .destroy({where: {id: movieId}, force: true})
        .then(()=>{
            return res.redirect('/movies')})
        .catch(error => res.send(error)) 
        }          
        
}

module.exports = moviesController;