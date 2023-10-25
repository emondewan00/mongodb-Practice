const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required field"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required field"],
    },
    ratings: {
      type: Number,
      default: 1.0,
      // validate: {
      //   validator: function (v) {
      //     console.log(v);
      //   },
      // },
      validate: {
        validator: function (value) {
          return value >= 1 && value <= 10;
        },
        message: "Ratings should be above 1 and below 10",
      },
    },
    duration: {
      type: Number,
      required: [true, "Duration is required field"],
    },
    totalRatings: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "Release Year is required field"],
    },
    releaseDate: {
      type: Date,
    },
    genres: {
      type: [String],
      required: [true, "Genres is required field"],
    },
    directors: {
      type: [String],
      required: [true, "Directors is required field"],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required field "],
    },
    actors: {
      type: [String],
      required: [true, "Actors is required field"],
    },
    price: {
      type: Number,
      required: [true, "Price is required field"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

movieSchema.virtual("durationInHours").get(function () {
  return +(this.duration / 60).toFixed(2);
});

movieSchema.post("aggregate", function (doc) {
  console.log(doc);
});

const Movie = mongoose.model("Movies", movieSchema);

module.exports = Movie;
