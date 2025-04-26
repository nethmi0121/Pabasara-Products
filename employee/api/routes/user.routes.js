import express from 'express'
import { test, updateUser,deleteUser,LeavedeleteItem,updateItem,getItem ,deleteItem} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router=express.Router();

router.get('/',test)
router.post("/update/:id",verifyToken,updateUser)
router.delete("/delete/:id",verifyToken,deleteUser)




//items

router.get('/getitem/:id', getItem);//for update fetch data
router.delete("/user_delete/:id",deleteItem)
router.delete("/Leave_delete/:id",LeavedeleteItem)

router.put("/updateitem",verifyToken,updateItem)







export default router