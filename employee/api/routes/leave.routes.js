import express from 'express'
import { google,LeavegetOrdersByCustomerId,Leavellitems,google1, Leavestore } from '../controllers/leave.controller.js';


const router=express.Router();


router.post("/google",google)
router.post("/google1",google1)


router.post("/leave_store",Leavestore)
router.get("/leave_user/:id",LeavegetOrdersByCustomerId)

router.get("/leave_users/items",Leavellitems)

export default router