const { Request, Response } = require('express');
const Organization = require('../models/organizations');
const nodemailer = require('nodemailer');
const User = require('../models/users');
const { signToken } = require('../utils/token');
const { validationResult } = require('express-validator');
const OrganizationModel = require('../models/organizations');
// const { errorLogger, appLogger } = require('../logger');

async function sendEmail(
  to,
  subject,
  text,
  attachments
) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.ADMIN_GMAIL,
      pass: process.env.ADMIN_GMAIL_PASSWORD,
    },
  });

  // Define email data
  const mailOptions = {
    from: process.env.ADMIN_GMAIL,
    to,
    subject: subject || 'Default Subject',
    text: text || 'Default Email Text',
    attachments: attachments || [],
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    // console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

async function createOrganization(req, res) {
  let success = false;

  // If there are validation errors, return a bad request with the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { orgi_name, orgi_email} = req.body;

    const generatedCodes = new Set();
    const organizations = await Organization.find({});

    organizations.forEach((org) => {
      generatedCodes.add(org.org_code);
    });
    const charset = '0123456789';

    let orgi_code = '';
    do {
      orgi_code = '';
      for (let j = 0; j < 4; j++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        orgi_code += charset.charAt(randomIndex);
      }
    } while (generatedCodes.has(orgi_code));

    generatedCodes.add(orgi_code);

    let org = await Organization.findOne({ org_name: orgi_name});
    if (org) {
      return res.status(404).json({ success, error: "organization configuration already exists" });
    }

    const Org = new Organization({
      org_name: orgi_name,
      org_email: orgi_email,
      org_code: orgi_code,
    });
    await Org.save();

    success = true;
    res.status(201).json({ success });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}

async function getAllOrg(req, res) {
  let success = false;
  try {
    const orgs = await Organization.find();
    success = true;
    res.status(201).json({ success, orgs });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}

async function getUsersOrg(req, res) {
  try {
    const { org_name, org_code } = req.body;

    const usersPerOrg = await User.find({  org_code: org_code });
    const Org = await Organization.findOne({ org_name: org_name, org_code: org_code });

    if (!usersPerOrg) {
      res.status(404).send('No users found');
      return;
    }

    const totalUsers = usersPerOrg.length;

    res.status(200).json({ Org, usersPerOrg, totalUsers });
  } catch (error) {
    errorLogger.error(`Error getting the orgUsers:`, error instanceof Error ? error.message : error);
    console.error('Error finding users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteOrgAlongWithUsers(req, res) {
  try {
    const { org_name, org_email,org_code } = req.body;

    const usersPerOrg = await User.find({ org_code: org_code });

    if (usersPerOrg.length > 0) {
      usersPerOrg.forEach(async user => {
        await User.findOneAndDelete({
          username: user.username,
          email: user.email
        });

      });
    }

    const org = await OrganizationModel.findOneAndDelete({
      org_name: org_name,
      org_email: org_email,
      org_code: org_code
    });

    appLogger.info(`Organization DELETED: ${org?.org_name}`);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error finding users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function getUserInfo(req, res) {
  try {
    const { username, email } = req.body;

    const user = await User.find({
      username: username,
      email: email
    }).select('-_id -password');

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteUser(req, res) {
  try {
    const { username, email } = req.body;

    const existinguser = await User.findOneAndDelete({
      username: username,
      email: email
    })
     
      res.status(400).json({ success: true, message: 'User found' });
    }
    catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function getOrganization(req, res) {
  let success = false;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { orgi_name, orgi_code } = req.body;

    const Orgi = await Organization.findOne({
      org_name: orgi_name,
      org_code: orgi_code,
    })

    if (!Orgi) {
      return res.status(400).json({ success, error: 'Please try with correct stuff' });
    }

    success = true;
    res.status(201).json({ success, Orgi });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}

const adminDashboard = (req, res) => {
  res.status(200).json('Chillaxxx admin');
};

async function sendCodetoEmail(req, res) {
  try {
    console.log(req.body)
    const org = await Organization.findOne({
      org_name: req.body.org_name,
      org_email: req.body.org_email,
    }).select('-_id');

    if (!org) {
      res.status(404).json({ message: 'organization not found' });
      return;
    }
    console.log(org)
    const disCode = org.org_code;

    const email = org.org_email;
    const subject = "Roomx Organizational Code";
    const text = `Dear Sir/Ma’am from ${org.org_name},\n\nWe are delighted to announce that we are fully prepared to commence the implementation of the RoomX system at your prestigious institution.\n\nAs part of this process, we are sharing with you a unique organizational code: ${disCode}.\nThe candidates must input this code in order to gain access to System.\n\nPlease note that this code is strictly meant for those who have successfully completed their registration. It is of utmost importance that this code remains confidential and not to be shared with anyone else.\n\nIf you have any queries, please feel free to reach out to us.\n\nWarm regards,\n\nDr. Antony Augusthy`;

    await sendEmail(email, subject, text);

    res.status(200).json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};


module.exports = {
  createOrganization,
  getAllOrg,
  getUsersOrg,
  deleteOrgAlongWithUsers,
  getUserInfo,
  deleteUser,
  getOrganization,
  adminDashboard,
  sendCodetoEmail,
};