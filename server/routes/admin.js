const express = require('express');

const { body } = require('express-validator');
const {
  createOrganization,
  adminDashboard,
  getOrganization,
  getAllOrg,
  getUserInfo,
  getUsersOrg,
  sendCodetoEmail,
  deleteUser,
  deleteOrgAlongWithUsers,
} = require('../controllers/adminController.js');
// const fetchUser = require('../middlewares/fetchUser');

const router = express.Router();

router.post('/createorg',createOrganization);

router.get('/getallorgs', getAllOrg);

// router.post('/getorg', getOrganization);

router.post('/getusersorg', getUsersOrg);

router.post('/getuserinfo', getUserInfo);

router.post('/deleteorg', deleteOrgAlongWithUsers);

router.post('/deleteuser', deleteUser);

router.get('/dashboard', adminDashboard);

router.post('/sendcodetoemail', sendCodetoEmail);

module.exports = router;
