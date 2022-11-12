const router = require('express').Router();
const {User, Thought} = require('../../models');
const { findOneAndDelete } = require('../../models/User');

// api/users
// get all users
router.get("/", async (req, res) => {
    try {
        const dbUserData = await User.find().select("-__v");
        res.status(200).json(dbUserData);
    } catch (err) {
        res.status(500).json(err)
    }
});

// creates a new user
router.post("/", async (req, res) => {
    try {
        const dbUserData = await User.create(req.body);
        res.status(200).json(dbUserData);

    } catch (err) {
        res.status(500).json(err)
    }
});

// api/users/:userID
router.get("/:userId", async (req, res) => {
    try {
        const dbUserData = await User.findOne({_id: req.params.userId}).select("-__v").populate("friends").populate("thoughts");
        if (! dbUserData) {
            return res.status(404).json({message: "No user with this ID!"})
        }
        res.status(200).json(dbUserData);

    } catch (err) {
        res.status(500).json(err)
    }
});

router.put("/:userId", async(req, res) => {
    try {
        const dbUserData = await User.findOneAndUpdate(
            {
                _id: req.params.userId,
            },
            {
                $set: req.body,
            },
            {
                runValidators: true,
                new: true
            }
        );

        if (!dbUserData) {
            return res.status(404).json({ message: "No user with this ID"})
        }    
        res.status(200).json(dbUserData);

    } catch(err) {
        res.status(500).json(err);
    }
})

router.delete("/:userId", async(req, res) => {
    try {
        const dbUserData = await User.findOneAndDelete({ _id: req.params.userId})
        if (!dbUserData) {
            return res.status(404).json({ message: "No user with this ID"})
        }  
        await Thought.deleteMany({ _id: { $in: dbUserData.thoughts }});

        res.status(200).json({message: "User and all associated thoughts deleted."})

    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;
