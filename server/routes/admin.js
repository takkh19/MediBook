import { Router } from "express";
import db from "../database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { z } from "zod";
const router=Router();
router.use(requireAuth, requireRole("admin"));
router.get("/stats", (req,res)=>{
 const patients=db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'patient'").get().count;
 const doctors=db.prepare("SELECT COUNT(*) AS count FROM doctors").get().count;
 const appointments=db.prepare("SELECT COUNT(*) AS count FROM appointments").get().count;
 res.json({patients,doctors,appointments});
});
router.get("/patients",(req,res)=>{
 const patients=db.prepare("SELECT id,name,email,created_at FROM users WHERE role = 'patient' ORDER BY id DESC").all();
 res.json({patients});
});
router.get("/doctor-accounts",(req,res)=>{
 const doctors=db.prepare(`SELECT d.id,d.name,d.specialty,d.user_id,u.email AS account_email FROM doctors d LEFT JOIN users u ON u.id=d.user_id ORDER BY d.id DESC`).all();
 res.json({doctors});
});
router.post("/link-doctor",(req,res)=>{
 const parsed=z.object({doctorId:z.number().int().positive(),email:z.email()}).safeParse(req.body);
 if(!parsed.success)return res.status(400).json({message:"Invalid doctor account data"});
 const {doctorId,email}=parsed.data;
 const doctor=db.prepare("SELECT id,user_id FROM doctors WHERE id=?").get(doctorId);
 const user=db.prepare("SELECT id,role FROM users WHERE email=?").get(email.trim().toLowerCase());
 if(!doctor || !user)return res.status(404).json({message:"Doctor or registered user not found"});
 if(user.role === "admin")return res.status(400).json({message:"Cannot convert an admin account"});
 if(doctor.user_id && doctor.user_id !== user.id)return res.status(409).json({message:"Doctor already linked to another account"});
 const existing=db.prepare("SELECT id FROM doctors WHERE user_id=? AND id!=?").get(user.id,doctorId);
 if(existing)return res.status(409).json({message:"User already linked to another doctor"});
 db.transaction(()=>{db.prepare("UPDATE doctors SET user_id=? WHERE id=?").run(user.id,doctorId);db.prepare("UPDATE users SET role='doctor' WHERE id=?").run(user.id);})();
 res.json({message:"Doctor account linked",doctorId,email});
});
export default router;
