import express, { Request, Response } from "express";
import validator from "validator";

const router = express.Router();

type Transaction = {
  id: string;
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
router.post("/", (req: Request, res: Response) => {
  const { id, typeId, amount, createdAt, for: forWhat } = req.body;

  // Validate required fields
  if (!id || !typeId || !amount || !createdAt) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Type checks
  if (
    typeof id !== "string" ||
    typeof typeId !== "number" ||
    typeof amount !== "number"
  ) {
    return res.status(400).json({ error: "Invalid field types" });
  }

  // UUID v4 validation
  if (!validator.isUUID(id, 4)) {
    return res.status(400).json({ error: "Invalid UUID v4 for 'id'" });
  }

  // Date validation
  const parsedDate = new Date(createdAt);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "Invalid 'createdAt' date format" });
  }

  const newTransaction: Transaction = {
    id,
    typeId,
    amount,
    createdAt: parsedDate,
    for: forWhat,
  };

  transactions.push(newTransaction);

  setTimeout(() => {
    res.status(201).json(newTransaction);
  }, 500); // Simulate a delay
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
 *           type: string
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
