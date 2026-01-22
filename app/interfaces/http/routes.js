import express from "express";
import SaleController from "./SaleController.js";

const router = express.Router();
const saleController = new SaleController();

router.post("/sales", (req, res) => saleController.createSale(req, res));
router.post("/sales/items", (req, res) => saleController.addItem(req, res));

export default router;
