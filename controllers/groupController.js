const Group=require("../model/group")
const GroupMember=require("../model/groupmember")
const Message=require("../model/message")
const User=require("../model/user")
const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    console.log(req.body)
    const UserId=req.user.id

    if (!name) return res.status(400).json({ success: false, message: "Group name required" });

    const group = await Group.create({ name, createdBy: UserId });

    
    const groupmember=await GroupMember.create({
      groupId: group.id,
      UserId:UserId,
      role:"admin"
    });
    
    console.log(groupmember)

    res.status(201).json({ success: true, group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create group" });
  }
};



// POST /groups/:groupId/add
const addUserToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userIdToAdd } = req.body;
    const currentUserId = req.user.id;

   
    const isAdmin = await GroupMember.findOne({
      where: { UserId: currentUserId, groupId, role:"admin" }
    });

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Only admins can add users" });
    }

   
    const newMember = await GroupMember.create({
      UserId: userIdToAdd,
      groupId,
      role:"member"
    });

    res.status(201).json({ success: true, member: newMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message||"Failed to add user" });
  }
};



// GET /groups/my
const getMyGroups = async (req, res) => {
  try {
    const UserId = req.user.id;

    const groups = await Group.findAll({
      include: [{
        model: GroupMember,
        where: { UserId },
        attributes: [] // don’t fetch GroupMember fields
      }],
      attributes: ["id", "name"]
    });
    

    res.status(200).json({ success: true, groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch groups" });
  }
};



// POST /groups/:groupId/messages
const sendMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { message } = req.body;
    const UserId = req.user.id;

    // check if user is member
    const member = await GroupMember.findOne({ where: { UserId, groupId } });
    if (!member) {
      return res.status(403).json({ success: false, message: "Not a member of this group" });
    }

    const newMessage = await Message.create({
      message,
      UserId,
      groupId
    });

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};



// GET /groups/:groupId/messages
const getGroupMessages = async (req, res) => {
  try {
    const groupId  = req.params.groupId;
    const UserId = req.user.id;

    // check if user is member
    const member = await GroupMember.findOne({ where: { UserId, groupId } });
    if (!member) {
      return res.status(403).json({ success: false, message: "Not a member of this group" });
    }

    const messages = await Message.findAll({
      where: { groupId },
      include: [{ model: User, attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]],
      limit: 50 // lightweight API
    });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};



// GET /groups/:groupId/users
const getGroupUsers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const UserId = req.user.id;

    // check if requesting user is member of this group
    const member = await GroupMember.findOne({ where: { UserId, groupId } });
    if (!member) {
      return res.status(403).json({ success: false, message: "Not a member of this group" });
    }

    // fetch group members with user details
    const members = await GroupMember.findAll({
      where: { groupId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"] // show what you want
        }
      ],
      attributes: ["role"] // so you also know if they’re admin/member
    });

    res.status(200).json({ success: true, members });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch group users" });
  }
};

const { Op } = require("sequelize");


const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;  // frontend will send ?query=manthan or email/phone

    if (!query) return res.status(400).json({ message: "Search query required" });

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },  
          { email: { [Op.like]: `%${query}%` } },
          { phonenumber: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ["id", "name", "email", "phonenumber"] // don’t return password
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// controllers/groupController.js
const makeAdmin = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userIdToPromote } = req.body;
    const currentUserId = req.user.id;

    // ✅ Check if the current user is an admin
    const isAdmin = await GroupMember.findOne({
      where: { UserId: currentUserId, groupId, role: "admin" }
    });

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Only admins can promote members" });
    }

    // ✅ Check if the user is already a member of the group
    const member = await GroupMember.findOne({
      where: { UserId: userIdToPromote, groupId }
    });

    if (!member) {
      return res.status(404).json({ success: false, message: "User not found in the group" });
    }

    // ✅ Update their role to admin
    member.role = "admin";
    await member.save();

    res.json({ success: true, message: "User promoted to admin successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





// controllers/groupController.js
const removeUserFromGroup = async (req, res) => {
  try {
    const { groupId, userIdToRemove } = req.params;
    console.log("request body is ",req.params)
    const currentUserId = req.user.id;

    // ✅ Check if current user is an admin
    const isAdmin = await GroupMember.findOne({
      where: { UserId: currentUserId, groupId, role: "admin" }
    });

    if (!isAdmin) {
      return res.status(403).json({ success: false, message: "Only admins can remove users" });
    }

    // ✅ Check if user exists in group
    const member = await GroupMember.findOne({
      where: { UserId: userIdToRemove, groupId }
    });

    if (!member) {
      return res.status(404).json({ success: false, message: "User not found in this group" });
    }

    // ✅ Prevent removing self if the admin is the only admin
    if (userIdToRemove == currentUserId && isAdmin.role === "admin") {
      const adminCount = await GroupMember.count({
        where: { groupId, role: "admin" }
      });

      if (adminCount === 1) {
        return res.status(400).json({ success: false, message: "Cannot remove the only admin" });
      }
    }

    // ✅ Remove user
    await member.destroy();

    res.status(200).json({ success: true, message: "User removed from group" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




module.exports={
    createGroup,addUserToGroup,sendMessage,getMyGroups,getGroupMessages,getGroupUsers,searchUsers,makeAdmin,removeUserFromGroup
}