const express = require('express');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');
const favorite = require('../models/favorite');
const { findOneAndDelete } = require('../models/favorite');
const Favorite = require('../models/favorite');
const cors = require('./cors');

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsites')
    .then(favorite => {
        res
            .statusCode(200)
            .json(favorite);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite) {
            req.body.forEach(fav => {
                if (!favorite.campsites.includes(fav._id)) {
                    favorite.campsites.push(fav._id)
                }
            })
            favorite.save()
            .then(favorite => {
                res
                    .statusCode(200)
                    .json(favorite);
            })
            .catch(err => next(err));
        }else {
            Favorite.create({user: req.user._id})
            .then(favorite => {
                req.body.forEach(fav => {
                    if (!favorite.campsites.includes(fav._id)) {
                        favorite.campsites.push(_id)
                    }
                })
                favorite.save()
                .then(favorite => {
                    res
                        .statusCode(200)
                        .json(favorite);
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            res
                .statusCode(200)
                .json(favorite);
        } else {
            res
                .statusCode(200)
                .end('You do not have any favorites to delete.');
        }
    })
    .catch(err => next(err));
})

favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            if(favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push(req.params.campsiteId);
                favorite.save()
                .then(favorite => {
                    res 
                        .statusCode(200)
                        .json(favorite);
                })
            } else {
                res.statusCode(200).end('That campsite already exists.');
            }
        } else {
            Favorite.create({user: req.user._id, campsites: [req.params.campsiteId]})
            .then(favorite => {
                res.statusCode(200).json(favorite);
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if(favorite) {
            const index = favorite.indexOf(req.params.campsiteId)
                if (index >= 0) {
                    favorite.campsites.splice(index, 1);
                }

            favorite.save()
            .then(favorite => {
                res.statusCode(200).json(favorite);
            })
            .catch(err => next(err));
        } else {
            res.statusCode(200).end('You do not have any favorites to delete.');
        }
    })
    .catch(err => next(err));
})

module.exports = favoriteRouter;
