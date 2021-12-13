const { ObjectId } = require("mongodb");
const { getDatabase } = require("../configs/mongodb");

const getPostsCollection = () => getDatabase().collection("posts");

async function searchPostsList(search, categoryId, sort, duration, skip, limit) {
    const query = {};
    if (search !== "") query.$text = { $search: search };
    if (categoryId !== "") query.categoryId = new ObjectId(categoryId);
    if (duration !== "") query.createdAt = { $gt: duration };

    const cursor = await getPostsCollection().aggregate([
        { $match: query },
        {
            $lookup: {
                from: "users",
                let: { id: "$publisherId" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
                    { $project: { username: 1, _json: { name: 1 } } },
                ],
                as: "publisher",
            },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                imageUrl: { thumbnail: 1 },
                title: 1,
                likeCount: 1,
                createdAt: 1,
                publisher: { $arrayElemAt: ["$publisher", 0] },
            },
        },
    ]);

    const result = await cursor.toArray();
    return result;
}

async function findPostById(id) {
    const cursor = await getPostsCollection().aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
            $lookup: {
                from: "users",
                let: { id: "$publisherId" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
                    { $project: { username: 1, _json: { name: 1 } } },
                ],
                as: "publisher",
            },
        },
        {
            $project: {
                imageUrl: 1,
                title: 1,
                likeCount: 1,
                createdAt: 1,
                publisher: { $arrayElemAt: ["$publisher", 0] },
            },
        },
    ]);

    const result = await cursor.toArray();
    return result[0];
}

async function addNewPost(newPost) {
    await getPostsCollection().insertOne({
        ...newPost,
        publisherId: new ObjectId(newPost.categoryId),
        categoryId: new ObjectId(newPost.categoryId),
    });
}

async function findAndUpdatePostById(id, updatedPost) {
    const result = await getPostsCollection().updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                ...updatedPost,
                categoryId: new ObjectId(updatedPost.categoryId),
            },
        }
    );

    if (result.matchedCount !== 1) return null;
    return result;
}

async function findAndDeletePostById(id) {
    const result = await getPostsCollection().deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount !== 1) return null;
    return result;
}

async function incrementLikeCount(postId) {
    await getPostsCollection().updateOne(
        { _id: new ObjectId(postId) },
        { $inc: { likeCount: 1 } }
    );
}

async function decrementLikeCount(postId) {
    await getPostsCollection().updateOne(
        { _id: new ObjectId(postId) },
        { $inc: { likeCount: -1 } }
    );
}

module.exports = {
    searchPostsList,
    findPostById,
    addNewPost,
    findAndUpdatePostById,
    findAndDeletePostById,
    incrementLikeCount,
    decrementLikeCount,
};
