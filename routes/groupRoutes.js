

const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const Authorization=require("../middlewares/authorization")


router.post("/create", Authorization,groupController.createGroup);


router.post("/:groupId/add-member", Authorization,groupController.addUserToGroup);

router.get("/my-groups", Authorization,groupController.getMyGroups);
router.post("/:groupId/send-messages",Authorization, groupController.sendMessage);


router.get("/:groupId/messages", Authorization,groupController.getGroupMessages)
router.get("/:groupId/users", Authorization, groupController.getGroupUsers);

router.get("/search-users", Authorization, groupController.searchUsers);
// routes/groupRoutes.js
router.post("/:groupId/make-admin", Authorization, groupController.makeAdmin);
// routes/groupRoutes.js
router.delete("/:groupId/remove-member/:userIdToRemove", Authorization, groupController.removeUserFromGroup);





module.exports = router;
