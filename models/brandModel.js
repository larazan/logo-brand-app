const mongoose = require('mongoose')
const slugify = require('slugify')
const Str = require('@supercharge/strings')

const brandSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    slug: {
       type: String,
       unique:true
    },
    category:{
        type: String,
        required: true
    },
    images:{
        type: Object,
        required: false
    },
    
}, {
    timestamps: true //important
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
brandSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true })+'-'+Str.random(5);
    next();
});

module.exports = mongoose.model("Brands", brandSchema)