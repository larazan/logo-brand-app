const mongoose = require('mongoose')
const slugify = require('slugify')

const brandSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true
    },
    slug: String,
    images:{
        type: Object,
        required: false
    },
    
}, {
    timestamps: true //important
})

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
brandSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model("Brands", brandSchema)