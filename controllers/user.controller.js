const UserModel = require('../models/user.model');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res, next) => {  
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
} 

module.exports.userInfo = async (req, res) => { 
    console.log(req.params);
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id)
    }
    UserModel.findById(req.params.id, (err, docs) => {
        if (!err) {
            res.send(docs)
        } else {
            console.log('ID unknown :' + err);
        }
    }).select('-password');
}

module.exports.updateUser = (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('ID unknown :' + req.params.id)
    }

    try {
         UserModel.findOneAndUpdate(
            {_id: req.params.id},
            //req.params.id,
            {
                $set : {
                    bio: req.body.bio
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if (!err) {
                return res.send(docs);
                } else {
                return res.status(500).json({ message: err });
                }
            }
        )
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

module.exports.deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) 
        return res.status(400).send('ID unknown :' + req.params.id)
    
    try {
        await UserModel.remove({_id: req.params.id}).exec();
        res.status(200).json({message: "Successfully deleted."});
    } catch (err) {
        return res.status(500).json({message: err});
    }

}

module.exports.follow = (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToFollow)) 
        return res.status(400).send('ID unknown')

    try {
        //Add to the followers list
        UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        //Add to the following list
        UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: {followers: req.params.id} },
            { new: true, upsert: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
            }
        )
    } catch (err) {
        return res.status(500).json({message: err});
    }
}

module.exports.unfollow = async (req, res) => {
    if (!ObjectId.isValid(req.params.id) || !ObjectId.isValid(req.body.idToUnFollow)) 
        return res.status(400).send('ID unknown')

    try {
        //remove to the followers list
        UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnFollow } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        //remove to the following list
        UserModel.findByIdAndUpdate(
            req.body.idToUnFollow,
            { $pull: {followers: req.params.id} },
            { new: true, upsert: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
            }
        )
    } catch (err) {
        return res.status(500).json({message: err});
    }
}