const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("uuid/v4");
const bcrypt = require("bcrypt-nodejs");

let exportedMethods = {
    async getAllUsers() {
        let userCollection = await users();
        return await userCollection.find({}).toArray();
    },
    async getUserById(id) {
        let userCollection = await users();
        let user = await userCollection.findOne({ _id: id });
        if (!user) throw new Error("User not found");
        return user;
    },
    async getUserByEmail(email){
        let userCollection = await users();
        let user = await userCollection.findOne({"profile.email": email});
        if (!user) throw new Error("Email not found");
        return user;
    },
    async addUser(name, phoneNumber, email, password) {
        let userCollection = await users();
        let newUser = {
            hashedPassword: bcrypt.hashSync(password),
            profile: {
                name: name,
                phoneNumber: phoneNumber,
                email: email
            },
            _id: uuid()
        };

        let newInsertInformation = await userCollection.insertOne(newUser);
        return await this.getUserById(newInsertInformation.insertedId);
    },
    async removeUser(id) {
        let userCollection = await users();
        let deletionInfo = await userCollection.removeOne({ _id: id });
        if (deletionInfo.deletedCount === 0) {
            throw new Error(`Could not delete user with id of ${id}`);
        }
    },
    async updateUser(id, userObj) {
        let updatedUser = {};
        if (userObj.hashedPassword) updatedUser.hashedPassword = userObj.hashedPassword;
        if (userObj.profile) updatedUser.profile = userObj.profile;

        let userCollection = await users();
        await userCollection.updateOne({ _id: id }, {"$set": updatedUser});
        return await this.getUserById(id);
    }
};

module.exports = exportedMethods;