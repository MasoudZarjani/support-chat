import express from 'express'
import userController from '../../../controllers/userController'

const router = express.Router()

router.get('/index', userController.getUsers)

export default router;