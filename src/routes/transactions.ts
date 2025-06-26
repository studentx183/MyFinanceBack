import express from "express";

const router = express.Router();

type Transaction = {
  id: number;
  typeId: number;
  amount: number;
  createdAt: Date;
  for: string;
};

let transactions: Transaction[] = []; // in-memory DB for now

// GET all transactions
router.get("/", (_req, res) => {
  res.json(transactions);
});

// POST new transaction
router.post("/", (req, res) => {
  const { typeId, amount, createdAt, for: forWhat } = req.body;

  const newTransaction: Transaction = {
    id: transactions.length + 1,
    typeId,
    amount,
    createdAt: new Date(createdAt),
    for: forWhat,
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

export default router;

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *   post:
 *     summary: Add a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: The created transaction
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - id
 *         - typeId
 *         - amount
 *         - createdAt
 *         - for
 *       properties:
 *         id:
 *           type: integer
 *         typeId:
 *           type: integer
 *         amount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         for:
 *           type: string
 */
