import express from 'express';
import { 
    fetchAll, 
    fetchById, 
    fetchRecent, 
    createUser, 
    updateUser, 
    removeUser, 
    countUser, 
    uploadAvatar,
} from '../controller/userController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', fetchAll);
router.get('/count', countUser);
router.get('/recent', fetchRecent);
router.post('/', createUser);

router.patch('/:id/avatar', upload.single("picture"), uploadAvatar);

router.route('/:id')
    .get(fetchById)
    .patch(updateUser)
    .delete(removeUser)

export default router;