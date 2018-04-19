const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const uuid = require("uuid/v4");
const bcrypt = require("bcrypt-nodejs");

let exportedMethods = {
    async getAllPosts() {
        let postCollection = await posts();
        return await postCollection.find({}).toArray();
    },
    async getPostById(id) {
        let postCollection = await posts();
        let post = await postCollection.findOne({ _id: id });
        if (!post) throw new Error("Post not found");
        return post;
    },
    async getPostsByUserId(uid){
        let postCollection = await posts();
        let post = await postCollection.find({"uid": uid}).toArray();
        return post;
    },
    async addPost(uid, title, content) {
        let postCollection = await posts();
        let newPost = {
            uid: uid,
            title: title,
            content: content,
            _id: uuid()
        };

        let newInsertInformation = await postCollection.insertOne(newPost);
        return await this.getPostById(newInsertInformation.insertedId);
    }
};

module.exports = exportedMethods;