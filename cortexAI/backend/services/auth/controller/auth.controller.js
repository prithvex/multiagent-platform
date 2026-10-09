// Login controller 

import { getAuth } from "firebase-admin/auth";
import app from "../config/firebase.js"
import User from '../models/user_model.js'
import crypto from "crypto";
import redis from '../../../shared/redis/redis.js';

export const login = async (req, res) => {
    try {
        const { token } = req.body
        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({ // we are changing the user so cant be constant
            firebaseUid: decoded.uid
        });
        // creating new user if not existed
        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture,
            });
        }

        // auto login without authentication in recent 7 days 
        // store the session id in cookie and cookie can expire in 7 days

        const sessionId = crypto.randomUUID()
        await redis.set(`session: ${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }), "EX", 7 * 24 * 60 * 60) // expiry in 7 days  



        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days 
        })

        return res.status(200).json(user)

    }
    catch (error) {
        console.error("Login error:", error);

        return res.status(401).json({
            message: "Invalid authentication token",
        });
    }
};

export const logOut = async (req, res) => {
    try {
        // remove from redis 
        const sessionId = req.cookies?.session || req.cookie?.session
        if (sessionId) {
            await redis.del(`session: ${sessionId}`)
        }

        //remove from cookie 
        res.clearCookie("session")
        console.log("Logout successfully");
        return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
        return res.status(500).json({
            message: "Logout error",
        });
    }
}

// upateuser controller

export const updateUserPayment = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"]
        const { plan, credits, totalCredits, planExpiresAt } = req.body
        const user = await User.findByIdAndUpdate(userId, {
            plan,
            credits,
            totalCredits,
            planExpiresAt
        }, { new: true })

        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        user.plan = plan
        user.credits += credits
        user.totalCredits += credits
        user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        await user.save()

        //find the session_id with cookie
        const session_id = req.cookie?.session
        //store the session id into redis
        await redis.set(`session -${session_id}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)

        return res.status(200).json({ message: "user updated successfully" })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update user",
            error
        })
    }
}

export const deductCredits = async (req, res) => {
    try {
        const { userId, credits } = req.body
        //cost id per agent
        const COST = {
            chat: 1,
            search: 5,
            coding: 10,
            pdf: 10,
            ppt: 10,
            image: 10,
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }

        const requiredCredits = COST[agent]
        if (!requiredCredits) {
            return res.status(400).json({ message: "agent not found" })
        }
        if (user.credits < requiredCredits) {
            return res.status(400).json({ message: "Insufficient credits" })
        }
        user.credits -= requiredCredits
        await user.save()

        //update the session 
        const session_id = req.cookie?.session
        await redis.set(`session -${session_id}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)

        return res.status(200).json({ message: "Credits deducted successfully", credits: user.credits })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to deduct credits",
            error
        })
    }
}