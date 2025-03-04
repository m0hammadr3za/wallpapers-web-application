const express = require("express");
// const authenticateUser = require("../middleware/authenticateUser");
// const createWallpaper = require("../usecases/wallpapers/createWallpaper");
const getWallpapersCount = require("../usecases/wallpapers/getWallpapersCount");
const queryWallpapers = require("../usecases/wallpapers/queryWallpapers");
const findSingleWallpaper = require("../usecases/wallpapers/findSingleWallpaper");
// const updateWallpaper = require("../usecases/wallpapers/updateWallpaper");
// const deleteWallpaper = require("../usecases/wallpapers/deleteWallpaper");

const router = express.Router();

// router.post("/", authenticateUser, async (req, res, next) => {
//     const wallpaper = req.body;
//     const userId = req.user._id;
//     const db = req.database;

//     const err = await createWallpaper(wallpaper, userId, db);
//     if (err) return next(err);

//     return res.send({ success: true });
// });

router.get("/count", async (req, res, next) => {
  const query = req.query;
  const db = req.database;

  const [err, wallpapersCount] = await getWallpapersCount(query, db);
  if (err) return next(err);

  return res.json({ count: wallpapersCount });
});

router.get("/", async (req, res, next) => {
  const query = req.query;
  const userId = req.user ? req.user._id : null;
  const db = req.database;

  const [err, wallpapers] = await queryWallpapers(query, userId, db);
  if (err) return next(err);

  return res.json(wallpapers);
});

router.get("/:id", async (req, res, next) => {
  const wallpaperId = req.params.id;
  const userId = req.user ? req.user._id : null;
  const db = req.database;

  const [err, wallpaper] = await findSingleWallpaper(wallpaperId, userId, db);
  if (err) return next(err);

  return res.json(wallpaper);
});

// router.put("/:id", authenticateUser, async (req, res, next) => {
//     const wallpaperId = req.params.id;
//     const wallpaperUpdate = req.body;
//     const userId = req.user._id;
//     const db = req.database;

//     const err = await updateWallpaper(wallpaperId, wallpaperUpdate, userId, db);
//     if (err) return next(err);

//     return res.json({ success: true });
// });

// router.delete("/:id", authenticateUser, async (req, res, next) => {
//     const wallpaperId = req.params.id;
//     const userId = req.user._id;
//     const db = req.database;

//     const err = await deleteWallpaper(wallpaperId, userId, db);
//     if (err) return next(err);

//     return res.json({ success: true });
// });

module.exports = router;
