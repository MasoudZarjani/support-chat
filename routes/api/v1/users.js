import express from 'express'
import userController from '../../../controllers/userController'

const router = express.Router()

router.get('/index', userController.getUsersApi)
router.get('/admin/info', userController.getAdminInfoApi)
router.get('/chat_titles/:token', userController.getChatTitlesApi)

export default router;