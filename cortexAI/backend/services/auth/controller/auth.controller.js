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
        const sessionId = req.cookie?.session
        await redis.del(`session: ${sessionId}`)

        //remove from cookie 
        res.clearCookie("session")
        console.log("Logout successfully");
    } catch (error) {
        return res.status(500).json({
            message: "Logout error",
        });
    }
}