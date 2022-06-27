'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


var charitySchema = Schema( {
    userID: ObjectId,
    name: String,
    type: String,
    createdAt: Date, 
} );

module.exports = mongoose.model( 'InterestCharity', charitySchema );
