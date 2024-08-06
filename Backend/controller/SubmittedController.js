const Submitted = require("../models/Submitted");

exports.createSubmitted = async (req, res) => {
  console.log("first request", req.body)
  try {
    await Submitted.create(req.body)
    res.status(201).json(Submitted);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getAll = async (req, res) => {
  console.log("ok")
  try {
    const submissions = await Submitted.findAll();
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};