import express from "express";
import { 
    fetchAll, 
    latestProduct,
    createProduct, 
    fetchById, 
    removeProduct, 
    updateProduct
} from "../controller/productController.js";

const router = express.Router();

router.get('/', fetchAll)

router.get('/latest', latestProduct);

router.post('/', createProduct)

router.route('/:id')
.get(fetchById)
.patch(updateProduct)
.delete(removeProduct)

export default router;