import express from 'express';
import { fetchAll, fetchById, createUser, updateUser, removeUser } from '../controller/userController.js';

const router = express.Router();

router.get('/', fetchAll);

router.post('/', createUser);

// router.get('/new');

router.route('/:id')
    .get(fetchById)
    .patch(updateUser)
    .delete(removeUser)

export default router;