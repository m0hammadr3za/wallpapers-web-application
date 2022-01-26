const { collectionPostSchema } = require("../schemas/collectionsPostsSchemas");
const handleError = require("../utils/handleError");

// POST /
// req.body => collectionId, postId
async function createNewCollectionPost(req, res, next, database) {
    let [err, collectionPost] = await validateCollectionPost(req.body);
    if (err) return handleError(err);

    err = await validatePost(collectionPost.postId, database);
    if (!err) return handleError(err);

    err = await validateCollection(
        {
            collectionId: collectionPost.collectionId,
            userId: req.user._id,
        },
        database
    );

    if (!err) return handleErrorerr(err);

    try {
        await database.addNewCollectionPost({
            ...collectionPost,
            createdAt: Date.now(),
        });

        await database.incrementCollectionPostCount(
            collectionPost.collectionId
        );

        return res.json({ newCollectionPostAdded: true });
    } catch (err) {
        next(err);
    }
}

async function validateCollectionPost(collectionPost) {
    let validCollectionPost = { ...collection };

    try {
        validCollectionPost = await collectionPostSchema.validateAsync(
            collectionPost
        );
    } catch (err) {
        const knownError = {
            known: true,
            status: 403,
            message: err.message,
        };

        return [knownError, null];
    }

    return [null, validCollectionPost];
}

async function validatePost(postId, database) {
    const isValidId = validateId(postId);
    if (!isValidId) {
        const knownError = {
            known: true,
            status: 403,
            message: "invalid post id!",
        };

        return knownError;
    }

    try {
        const post = await database.findPostById(postId);
        if (!post) {
            const knownError = {
                known: true,
                status: 404,
                message: "no post with this id was found!",
            };

            return knownError;
        }
    } catch (err) {
        return err;
    }

    return null;
}

async function validateCollection({ collectionId, userId }, database) {
    const isValidId = validateId(collectionId);
    if (!isValidId) {
        const knownError = {
            known: true,
            status: 403,
            message: "invalid collection id!",
        };

        return knownError;
    }

    try {
        const collection = await database.findUserCollectionById({
            collectionId,
            userId,
        });

        if (!collection) {
            const knownError = {
                known: true,
                status: 404,
                message:
                    "no collection with this id, for this user, was found!",
            };

            return knownError;
        }
    } catch (err) {
        return err;
    }

    return null;
}

module.exports = createNewCollectionPost;
