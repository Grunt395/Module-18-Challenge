const router = require('express').Router();
const {User, Thought} = require('../../models');

// api/thoughts

router.get("/", async (req, res) => {
    try {
        const dbThoughtData = await Thought.find().sort({createdAt: -1});
        res.status(200).json(dbThoughtData);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.post("/", async (req, res) => {
    try {
        const dbThoughtData = await Thought.create(req.body);
        const dbUserData = await User.findOneAndUpdate({
            _id: req.body.userId
        }, {
            $push: {
                thoughts: dbThoughtData._id
            }
        }, {new: true});
        if (! dbUserData) {
            return res.status(404).json({message: "Thought created but no user with this ID!"})
        }
        res.status(200).json({
            ... dbThoughtData,
            message: `Thought successfully created!`
        });
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;
