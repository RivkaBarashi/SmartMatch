const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res)=> {
  try{
    const { name, id, password } = req.body;
    if (!name || !id || ! password)
    {
      return res.status(400).json({message: "All fields are required"})
    }
    const existingUser = await User.findOne({id});{
        if (existingUser)
        return res.status(400).json({message: "User already exists"})
    }
    const user = await User.create({
        name,
        id, 
        password
    })
   res.status(201).json({
       message: "User created successfully",
       user: {
          _id: user._id,
          name: user.name,
          id: user.id,
          role: user.role
       }
   })
  }catch(error){
    res.status(500).json({message: error.message})
  }

       }
     
const login = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(400).json({ message: "Id and password are required" });
    }
    const user = await User.findOne({ id });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        id: user.id,
        role: user.role,
      },
    });
  }
    catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      message: "Protected route works",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe };