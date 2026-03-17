import express from "express";
import { 
    fetchAll, 
    createProduct, 
    fetchById, 
    removeProduct 
} from "../controller/productController.js";

const router = express.Router();

router.get('/', fetchAll)

router.post('/', createProduct)

router.route('/:id')
.get(fetchById)
.delete(removeProduct)

export default router;