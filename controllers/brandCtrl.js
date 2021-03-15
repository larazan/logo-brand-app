const Brands = require('../models/brandModel');

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filtering() {
        const queryObj = {...this.queryString}

        const excludedFields = ['page', 'sort', 'limit'];
        excludedFields.forEach(el => delete(queryObj[el]));

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match);

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    pagination() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
    
}

const brandCtrl = {
    
    getBrands: async (req, res) => {
        try {
            const features = new APIfeatures(Brands.find(), req.query)
                .filtering()
                .sorting()
                .pagination()

            const brands = await features.query;

            res.json({
                status: 'success',
                result: brands.length,
                brands: brands
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getBrand: async (req, res) => {
        try {
            const brand = await Brands.findById(req.params.id);

            res.json({
                status: 'success',
                data: brand
            })
        } catch (error) {
            return res.status(500).json({msg: err.message})
        }
    },

    createBrand: async(req, res) => {
        try {
            const { name, images } = req.body;
            // if (!images) return res.status(400).json({msg: "No image upload"})

            const brand = await Brands.findOne({name});
            if (brand) return res.status(400).json({msg: "This product already exists."})

            const newBrand = new Brands({name: name.toLowerCase(), images});

            await newBrand.save();
            res.json({msg: "Created a product"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    deleteBrand: async (req, res) => {
        try {
            await Brands.findByIdAndDelete(req.params.id);
            res.json({msg: "Deleted a Product"});
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateBrand: async(req, res) => {
        try {
            const {name, images} = req.body;
            if(!images) return res.status(400).json({msg: "No image upload"})

            await Brands.findOneAndUpdate({_id: req.params.id}, {
                name: name.toLowerCase(), images
            })

            res.json({msg: "Updated a Product"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = brandCtrl