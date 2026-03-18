import express from "express";
import { 
    fetchAll, 
    latestProduct,
    createProduct, 
    fetchById, 
    removeProduct 
} from "../controller/productController.js";

const router = express.Router();

router.get('/', fetchAll)

router.get('/latest', latestProduct);

router.post('/', createProduct)

router.route('/:id')
.get(fetchById)
.delete(removeProduct)

export default router;