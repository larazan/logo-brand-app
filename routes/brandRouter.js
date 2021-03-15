const router = require('express').Router()
const brandCtrl = require('../controllers/brandCtrl')


router.route('/brands')
    .get(brandCtrl.getBrands)
    .post(brandCtrl.createBrand)


router.route('/brands/:id')
    .get(brandCtrl.getBrand)
    .delete(brandCtrl.deleteBrand)
    .put(brandCtrl.updateBrand)




module.exports = router