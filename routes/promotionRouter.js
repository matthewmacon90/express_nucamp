const express = require('express');
const promotionRouter = express.Router();
const authenticate = require('../authenticate');

const Promotion = require('../models/promotion');

promotionRouter.route('/')
.get((req, res, next) => {
    Promotion.find()
    .then(promotions => res.status(200).json(promotions)) //Another possible way
    .catch(err => next(err))
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotion.create(req.body)
    .then(promotion => res.status(200).json(promotion))
    .catch(err => next(err))
    // console.log('Promotion Created ', promotion);
})
.put(authenticate.verifyUser,(req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Promotion.deleteMany()
    .then(promotions => res.status(200).json(promotions))
    .catch(err => next(err))
    // console.log('Promotions Deleted ', promotions);
});

promotionRouter.route('/:promotionId')
.get((req,res, next) => {
    Promotion.findById(req.params.promotionId)
    .then(promotion => res.status(200).json(promotion))
    .catch(err => next(err))
    // console.log('Promotions Deleted ', promotion);
})
.post(authenticate.verifyUser,(req, res) => { //Can delete...you will never support a post here and waste of resouce...notes for future.
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/:promotionId`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req,res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body //replaces entire body or certain fields{description: req.body.description,  name: req.body.name}
    }, {new: true}) //Returning payload..False stops the .then
    .then(promotion => res.status(200).json(promotion))
    .catch(err => next(err))
    // console.log('Promotions Deleted ', promotion);
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(promotion => res.status(200).json(promotion))
    .catch(err => next(err))
    // console.log('Promotion Deleted ', promotion);
})

module.exports = promotionRouter;


