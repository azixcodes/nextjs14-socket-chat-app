import Users from "../models/Users.js";
import Chat from "../models/Chat.js";
const db = "test";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await Users.find();

    res.send(users);
  } catch (err) {
    res.send({ message: "Connection to the server error, please try again" });
  }
};

export const saveUser = async (req, res) => {
  const { email, username, tagline, password, avatar } = req.body;
  const findUser = Users.findOne({ email });
  if (!findUser) {
    const user = new Users({
      email,
      username,
      avatar,
      tagline,
      password,
    });
    try {
      await user.save();
      res.json({ message: "User Saved", status: 200 });
    } catch (err) {
      res.send({ message: err });
    }
  } else {
    res.send({ message: `${email} has been already used` });
  }
};

export const handleSignIn = async (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.send({ message: "username and password are required" });
    } else {
      const user = await Users.findOne({ username, password });
      if (user) {
        await Users.updateOne(
          { username: user.username },
          { $set: { loggedin: true } }
        );
        let userEmail = user.email;
        const token = jwt.sign({ userEmail }, secretKey, {
          expiresIn: "5m",
        });

        return res.json({ status: true, token, user: user });
      } else {
        return res.send({ message: "invallid username or password" });
      }
    }
  } catch (err) {
    res.send({ message: err.message });
  }
};

export const handleEmailLogin = async (req, res) => {
  const secretKey = process.env.SECRET_KEY;
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      await Users.updateOne(
        { email: user.email },
        { $set: { loggedin: true } }
      );
      const token = jwt.sign({ email }, secretKey, {
        expiresIn: "5m",
      });
      return res.json({ status: true, token, user: user });
    } else {
      return res.send({ message: "Sorry this email doesn't exist" });
    }
  } catch (err) {
    res.send({ error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    const sender = await Users.findById(senderId);
    const receiver = await Users.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    const newMessage = new Chat({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await newMessage.save();
    res.json({ status: "Sent" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getUserChats = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const messages = await Chat.find({
      $or: [{ sender: id }, { receiver: id }],
    })
      .populate("sender")
      .populate("receiver");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      res.send({ error: "No such user found" });
    } else {
      res.send({ user });
    }
  } catch (err) {
    res.send({ error: err.message });
  }
};
// // yaAyvvXPo7PQOH8T
// // mongodb+srv://rest-api:<password>@cluster0.7yo8ti1.mongodb.net/
