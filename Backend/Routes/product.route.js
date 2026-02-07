import express from 'express'
import { getProducts, postProducts,getProductByID } from '../Controllers/product.controller.js'

const router = express.Router() 

router.get('/', getProducts)
router.post('/', postProducts)
router.get('/:id',getProductByID)


export default router;