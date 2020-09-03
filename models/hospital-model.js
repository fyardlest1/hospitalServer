const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});


const hospitalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        // required: true
    },
    address: {
        type: String,
        required: true
    },
    // location: {
    //     lat: {
    //         type: Number,
    //         required: true
    //     },
    //     lng: {
    //         type: Number,
    //         required: true
    //     }
    // },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        required: true
    },
    // creator: {
    //     type: String,
    //     required: true
    // },
    description: {
        type: String,
        required: true
    },
    comments: [commentSchema]
},
    {
        timestamps: true
    }    
);

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;