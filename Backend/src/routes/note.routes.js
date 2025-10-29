import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {isNoteOwnerOrAdmin} from "../middleware/isNoteOwnerOrAdmin.js"
import {
  createNote,
  getNote,
  getUserNotes,
  updateNote,
  deleteNote,
  getAllAvailableNotes,
}
  from "../controller/note.controller.js";


const router = Router();

router.route("/").post(verifyJWT, createNote);

router.route("/all-notes").get(verifyJWT, getAllAvailableNotes);

router.route("/:noteId").get(verifyJWT, getNote);

router.route("/get-user-notes/:userId").get(verifyJWT, getUserNotes);

router.route("/:noteId").patch(verifyJWT, isNoteOwnerOrAdmin, updateNote);

router.route("/:noteId").delete(verifyJWT, isNoteOwnerOrAdmin, deleteNote);


export default router;