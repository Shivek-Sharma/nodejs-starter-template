import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";

import userModel from "../models/user.schema.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Retrieve a user by ID
 *     description: Fetch a user's details using their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The details of the user.
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "63d10f3b5f5e4c001f3a1e56"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     profilePictureUrl:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["ROLE_USER"]
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user or retrieve an existing user
 *     description: Checks if a user with the given email exists. If not, creates a new user with a randomly generated hashed password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 description: The display name of the user.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: "john.doe@example.com"
 *               photoUrl:
 *                 type: string
 *                 description: The URL of the user's profile picture.
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: A successful response indicating whether the user is new or existing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isNewUser:
 *                   type: boolean
 *                   description: Indicates whether the user is newly created or existing.
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Details of the user.
 */
router.post("/", async (req, res) => {
    try {
        const { displayName, email, photoUrl } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ success: true, isNewUser: false, data: existingUser });
        }

        const randomString = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await bcrypt.hash(randomString, 0);

        const newUser = await userModel.create({ email, firstName: displayName, password: hashedPassword, profilePictureUrl: photoUrl, roles: ['ROLE_USER'] });
        res.status(200).json({ success: true, isNewUser: true, data: newUser });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user by ID
 *     description: This endpoint allows you to update an existing user's information by providing their unique ID in the URL.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: The data to update the user with.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 description: The display name of the user.
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: "john.doe@example.com"
 *               photoUrl:
 *                 type: string
 *                 description: The URL of the user's profile picture.
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The updated user object.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user by ID
 *     description: This endpoint allows you to delete an existing user by providing their unique ID in the URL.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The deleted user object.
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await userModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: deletedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;