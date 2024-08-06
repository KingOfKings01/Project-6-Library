const Submitted = require("../models/Submitted");

exports.createSubmitted = async (req, res) => {
  try {
    const Submitted = new Submitted(req.body);
    Submitted.save();
    res.status(201).json(Submitted);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const Submitted = await Submitted.findAll();
    res.json(Submitted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
