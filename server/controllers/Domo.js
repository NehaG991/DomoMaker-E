const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.strength) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    strength: req.body.strength,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({
      name: newDomo.name,
      age: newDomo.age,
      strength: newDomo.strength,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const getDomos = (req, res) => {
  Domo.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error has occurred!' });
    }

    return res.json({ domos: docs });
  });
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
