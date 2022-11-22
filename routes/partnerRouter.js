const express = require('express');
const partnerRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

const Partner = require('../models/partner');

partnerRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Partner.find()
    .then(partners => res.status(200).json(partners)) //Another possible way
    .catch(err => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Partner.create(req.body)
    .then(partner => res.status(200).json(partner))
    .catch(err => next(err))
    // console.log('Partner Created ', partner);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Partner.deleteMany()
    .then(partners => res.status(200).json(partners))
    .catch(err => next(err))
    // console.log('Partners Deleted ', partners);
});

partnerRouter.route('/:partnerId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then(partner => res.status(200).json(partner))
    .catch(err => next(err))
    // console.log('Partners Deleted ', partner);
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => { //Can delete...you will never support a post here and waste of resouce...notes for future.
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/:partnerId`);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId, {
        $set: req.body //replaces entire body or certain fields{description: req.body.description,  name: req.body.name}
    }, {new: true}) //Returning payload..False stops the .then
    .then(partner => res.status(200).json(partner))
    .catch(err => next(err))
    // console.log('Partners Deleted ', partner);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(partner => res.status(200).json(partner))
    .catch(err => next(err))
    // console.log('Partner Deleted ', partner);
})

module.exports = partnerRouter;


