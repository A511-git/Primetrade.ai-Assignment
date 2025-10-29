import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {isAdmin} from "../middleware/isAdmin.middleware.js"
import {
    updateRole,
    deleteAccount,
    deleteAllNotes
} from "../controller/admin.controller.js";

const router = Router();

router.route("/update-role/:userId").patch(verifyJWT, isAdmin, updateRole);

router.route("/delete-account/:userId").delete(verifyJWT, isAdmin, deleteAccount);

router.route("/delete-all-notes").delete(verifyJWT, isAdmin, deleteAllNotes);

export default router;