const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const verifyJWT = require("../middleware/verifyJWT")

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.post("/confirm-account", userController.confirmAccount);
router.post("/forgot-password", userController.forgotPassword);

router.post("/users/paginated", verifyJWT, userController.paginateUsers);
router.post("/users/:id/history/paginated", verifyJWT, userController.paginateHistory);

router.post("/users/delete-user", verifyJWT, userController.deleteUser);

module.exports = router