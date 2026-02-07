import express from 'express'
import {getCategories,postCategories} from '../Controllers/category.controller.js'

const router = express.Router()

router.get('/', getCategories)
router.post('/',postCategories)

export default router;