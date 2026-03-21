import express from 'express';
import { 
    fetchAll, 
    fetchById, 
    fetchRecent, 
    createUser, 
    updateUser, 
    removeUser, 
    countUser, 
    
} from '../controller/userController.js';

const router = express.Router();

router.get('/', fetchAll);
router.get('/count', countUser);

router.get('/recent', fetchRecent);

router.post('/', createUser);

router.route('/:id')
    .get(fetchById)
    .patch(updateUser)
    .delete(removeUser)

export default router;