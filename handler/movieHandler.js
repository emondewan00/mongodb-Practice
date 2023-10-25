const express = require("express");
const Movie = require("../model/movieModel");
const ApiFeatures = require("../utils/ApiFeatures");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        newMovie,
      },
    });
  } catch (error) {
    res.send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    // const { _order, _sort, fields, page, limit, ...otherQuery } = req.query;
    const movieCount = await Movie.countDocuments();
    let features = new ApiFeatures(Movie.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .pagination(movieCount);
    //find with document field
    // if (otherQuery) {
    //   let queryStr = JSON.stringify(otherQuery);
    //   queryStr = queryStr.replace(
    //     /\b(gte|gt|lte|lt)\b/g,
    //     (match) => `$${match}`
    //   );
    //   const queryObj = JSON.parse(queryStr);
    //   query = query.find(queryObj);
    // }
    //select fields
    // if (fields) {
    //   const fieldsArray = fields.split(",");
    //   query = query.select(fieldsArray);
    // }
    //pagination
    // if ((limit, page)) {
    //   const skipDoc = limit * page;
    //   const movieCount = await Movie.countDocuments();
    //   if (skipDoc >= movieCount) {
    //     return next("This page is not found! error massage");
    //   }
    //   query = query.skip(skipDoc).limit(limit);
    // }
    //sort logic
    // if (req.query._sort) {
    //   const sort = req.query._sort.split(",");
    //   const sortValue = req.query._order === "desc" ? -1 : 1;
    //   const sortObj = {};
    //   for (let x of sort) {
    //     sortObj[x] = sortValue;
    //   }
    //   query = query.sort(sortObj);
    // }
    const movies = await features.query;

    if (movies.length === 0) {
      return res.status(404).json({ error: "No movies found." });
    }
    res.status(200).json({
      status: "success",
      length: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    res.send(error);
  }
});

router.get("/movies-stats", async (req, res) => {
  try {
    const stats = await Movie.aggregate([
      { $match: { price: { $gte: 55 } } },
      {
        $group: {
          _id: "$releaseYear",
          totalPrice: { $sum: "$price" },
          movieCount: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      length: stats.length,
      data: {
        stats,
      },
    });
  } catch (error) {}
});

router.get("/movies-by-genres/:genre", async (req, res) => {
  try {
    const moviesByGenres = await Movie.aggregate([
      { $unwind: { path: "$genres" } },
      {
        $group: {
          _id: "$genres",
          movieName: { $push: "$name" },
          movieCount: { $sum: 1 },
          avgRating: { $avg: "$ratings" },
          totalPrice: { $sum: "$price" },
        },
      },
      // { $sortByCount: "$avgRating" },
      { $match: { _id: req.params.genre } },
    ]);
    console.log();
    res.status(200).json({
      status: "success",
      length: moviesByGenres.length,
      data: {
        moviesByGenres,
      },
    });
  } catch (error) {}
});

module.exports = router;
