const { likesQuerySchema } = require("../schemas/likesSchemas");
const handleError = require("./utils/handleError");

// GET /
async function getUserLikes(req, res, next, database) {
    let [err, params] = await validateQueryParams(req.query);
    if (err) return handleError(err, res, next);

    params = formatParams(params);

    try {
        const userLikedPosts = await database.getUserLikes({
            userId: req.user._id,
            ...params,
        });

        return res.json(userLikedPosts);
    } catch (err) {
        return next(err);
    }
}

async function validateQueryParams(queryParams) {
    let params = {
        page: queryParams.page || 1,
        limit: queryParams.limit || 20,
    };

    try {
        params = await likesQuerySchema.validateAsync(params);
    } catch (err) {
        const knownError = {
            known: true,
            status: 403,
            message: err.message,
        };

        return [knownError, null];
    }

    return [null, params];
}

function formatParams(params) {
    const fParams = { ...params };

    fParams.skip = (fParams.page - 1) * fParams.limit;
    delete fParams.page;

    return fParams;
}

module.exports = getUserLikes;
