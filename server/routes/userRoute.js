import express from 'express';
import { fetchAll, fetchById, fetchRecent, createUser, updateUser, removeUser } from '../controller/userController.js';

const router = express.Router();

router.get('/', fetchAll);

router.get('/recent', fetchRecent);

router.post('/', createUser);

router.route('/:id')
    .get(fetchById)
    .patch(updateUser)
    .delete(removeUser)

export default router;