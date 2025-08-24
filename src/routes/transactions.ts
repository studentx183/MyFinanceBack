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

let transactions: Transaction[] = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    typeId: 1,
    amount: 100.0,
    createdAt: new Date("2023-10-01T12:00:00Z"),
    for: "Groceries",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    typeId: 2,
    amount: 50.0,
    createdAt: new Date("2023-10-02T15:30:00Z"),
    for: "Utilities",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174002",
    typeId: 1,
    amount: 75.0,
    createdAt: new Date("2023-10-03T09:00:00Z"),
    for: "Groceries",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174003",
    typeId: 2,
    amount: 30.0,
    createdAt: new Date("2023-10-04T11:15:00Z"),
    for: "Transportation",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174004",
    typeId: 1,
    amount: 120.0,
    createdAt: new Date("2023-10-05T14:00:00Z"),
    for: "Groceries",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174005",
    typeId: 2,
    amount: 60.0,
    createdAt: new Date("2023-10-06T10:30:00Z"),
    for: "Utilities",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174006",
    typeId: 1,
    amount: 90.0,
    createdAt: new Date("2023-10-07T09:45:00Z"),
    for: "Groceries",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174007",
    typeId: 2,
    amount: 40.0,
    createdAt: new Date("2023-10-08T08:30:00Z"),
    for: "Transportation",
  },
]; // in-memory DB for now

const getParsedDate = (date: string) => {
  return new Date(date);
};

const validateRequest = (
  request: Request,
  method: "POST" | "PATCH"
): string | null => {
  const { id, typeId, amount, createdAt, for: forWhat } = request.body;

  if (method === "PATCH") {
    if (typeId !== undefined && typeof typeId !== "number") {
      return "Invalid type for 'typeId'";
    }

    if (amount !== undefined && typeof amount !== "number") {
      return "Invalid type for 'amount'";
    }

    if (createdAt !== undefined) {
      const parsedDate = new Date(createdAt);
      if (isNaN(parsedDate.getTime())) {
        return "Invalid 'createdAt' date format";
      }
    }

    return null;
  } else {
    if (!id || !typeId || !amount || !createdAt) {
      return "Missing required fields";
    }

    if (
      typeof id !== "string" ||
      typeof typeId !== "number" ||
      typeof amount !== "number"
    ) {
      return "Invalid field types";
    }

    if (!validator.isUUID(id, 4)) return "Invalid UUID v4 for 'id'";

    const parsedDate = new Date(createdAt);
    if (isNaN(parsedDate.getTime())) return "Invalid 'createdAt' date format";

    return null;
  }
};

// GET all transactions
router.get("/", (_req, res) => {
  res.json(transactions);
});

// POST new transaction
router.post("/", (request: Request, response: Response) => {
  const { id, typeId, amount, createdAt, for: forWhat } = request.body;

  const errorMessage = validateRequest(request, "POST");
  if (errorMessage) {
    return response.status(400).json({ error: errorMessage });
  }

  const parsedDate = getParsedDate(createdAt);
  const newTransaction: Transaction = {
    id,
    typeId,
    amount,
    createdAt: parsedDate,
    for: forWhat,
  };

  transactions.push(newTransaction);

  setTimeout(() => {
    response.status(201).json(newTransaction);
  }, 500); // Simulate a delay
});

// PATCH update transaction
router.patch("/:id", (request: Request, response: Response) => {
  const { id } = request.params;
  const { ...updates } = request.body;

  const errorMessage = validateRequest(request, "PATCH");
  if (errorMessage) {
    return response.status(400).json({ error: errorMessage });
  }

  const index = transactions.findIndex((tx) => tx.id === id);
  if (index === -1) {
    return response.status(404).json({ error: "Transaction not found" });
  }

  // Get the existing transaction
  const existingTransaction = transactions[index];

  // Apply only the provided fields (partial update)
  const updatedTransaction: Transaction = {
    ...existingTransaction,
    ...updates,
    createdAt: updates.createdAt
      ? getParsedDate(updates.createdAt)
      : existingTransaction.createdAt,
  };

  transactions[index] = updatedTransaction;

  setTimeout(() => {
    response.status(200).json(updatedTransaction);
  }, 500); // Simulate a delay
});

// DELETE transaction
router.delete("/:id", (request: Request, response: Response) => {
  const { id } = request.params;

  const index = transactions.findIndex((tx) => tx.id === id);
  if (index === -1) {
    return response.status(404).json({ error: "Transaction not found" });
  }

  transactions.splice(index, 1);

  setTimeout(() => {
    response.status(204).send();
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
 *
 *
 * /transactions/{id}:
 *   patch:
 *     summary: Partially update a transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionPatch'
 *     responses:
 *       200:
 *         description: The updated transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *   delete:
 *     summary: Delete a transaction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID of the transaction to delete
 *     responses:
 *       204:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
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
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         typeId:
 *           type: integer
 *         amount:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         for:
 *           type: string
 *
 *     TransactionPatch:
 *       type: object
 *       required:
 *         - amount
 *         - createdAt
 *         - typeId
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
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
