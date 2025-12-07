import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, getAllProducts, deleteProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.use((req, res, next) => {
    console.log('Request to product router:', req.path);
    next();
});

productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productRouter.get('/all', getAllProducts)
productRouter.get('/id', productById)
productRouter.post('/stock', authSeller, changeStock)
productRouter.post('/delete', authSeller, deleteProduct)

export default productRouter;