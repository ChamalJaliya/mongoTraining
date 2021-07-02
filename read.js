/** In mongo DB shell we access to the database by the command "db"
 * and access the collection by the db."collectionName"
 * and  then we execute the methods
 * finally we have data to the method ( method parameters)
 */

// i) mongo
// ii) use movieData
// iii) db.movies.inserMany([{},{}..........{}])

// Find
// 1st arg -> Document which we look for which has the form of field name and value
// field name -> name value->"super natural" collectively they called "filter"
db.movies.find({ name: "super natural" });
// multi value filter -> Range Filter
// $gt -> operator
db.movies.find({ price: { $gt: 300 } });

// Operator

// 1) Query and Projection
// Query Operators - Local Data eg:- $eq
// Projection Operators - Modify data presentation eg:- $

// 2) Query Selectors
// Comparison
// Logical
// Element
// Evaluation
// Array
// Comments
// Geospatial

// 3) Projection Operators
// $
// $elemMatch
// $meta
// $slice

// 4) Aggregation

// getting count
db.movies.find({}).pretty().count();

// findOne -> return the first doc which matches the filter
// first doc
db.movies.findOne({});
// matching 1st
db.movies.findOne({ name: "Glee" });

// find -> return all giving cursor some case it doesn't retrieve all
//  1st 20 doc
db.movies.find().pretty();
// equality
db.movies.find({ runtime: 60 });
-(
  // comparison
  //   lte -> lower than or equal
  db.movies.find({ runtime: { $lt: 40 } })
);

// embedded querying

// {
//     "_id" : ObjectId("60dd68bc3895173b2c06df46"),
//     "id" : 1,
//     "url" : "http://www.tvmaze.com/shows/1/under-the-dome",
//     "name" : "Under the Dome",
//     "type" : "Scripted",
//     "language" : "English",
//     "genres" : [
//             "Drama",
//             "Science-Fiction",
//             "Thriller"
//     ],
//     "status" : "Ended",
//     "runtime" : 60,
//     "premiered" : "2013-06-24",
//     "officialSite" : "http://www.cbs.com/shows/under-the-dome/",
//     "schedule" : {
//             "time" : "22:00",
//             "days" : [
//                     "Thursday"
//             ]
//     },
//     "rating" : {
//             "average" : 6.5
//     },
//     "weight" : 91,
//     "network" : {
//             "id" : 2,
//             "name" : "CBS",
//             "country" : {
//                     "name" : "United States",
//                     "code" : "US",
//                     "timezone" : "America/New_York"
//             }
//     },
//     "webChannel" : null,
//     "externals" : {
//             "tvrage" : 25988,
//             "thetvdb" : 264492,
//             "imdb" : "tt1553656"
//     },
//     "image" : {
//             "medium" : "http://static.tvmaze.com/uploads/images/medium_portrait/0/1.jpg",
//             "original" : "http://static.tvmaze.com/uploads/images/original_untouched/0/1.jpg"
//     },
//     "summary" : "<p><b>Under the Dome</b> is the story of a small town that is suddenly and inexplicably sealed off from the rest of the world by an enormous transparent dome. The town's inhabitants must deal with surviving the post-apocalyptic conditions while searching for answers about the dome, where it came from and if and when it will go away.</p>",
//     "updated" : 1529612668,
//     "_links" : {
//             "self" : {
//                     "href" : "http://api.tvmaze.com/shows/1"
//             },
//             "previousepisode" : {
//                     "href" : "http://api.tvmaze.com/episodes/185054"
//             }
//     }
// }

// movies with rating average over 7.5
db.movies.find({ "rating.average": { $gt: 7.5 } }).pretty();

// movies in drama genre -> array
// exactly drama
db.movies.find({ genres: ["Drama"] }).pretty();
// containing drama
db.movies.find({ genres: "Drama" }).pretty();

// comparison $in  ($nin is the opposite)
// runtime in 30 and 40 only
db.movies.find({ runtime: { $in: [30, 40] } });

// Logical
// $or ($nor ->opposite to or)
// $and work same way ()
// rating lower than 3 or greater than 9
db.movies
  .find({
    $or: [{ "rating.average": { $lt: 3 } }, { "rating.average": { $gt: 9 } }],
  })
  .pretty();

// movies where rating.avg gt 7 and genre of drama
db.movies
  .find({
    $and: [{ "rating.average": { $gt: 7 } }, { genres: ["Drama"] }],
  })
  .pretty();

// alternative
db.movies.find({ "rating.average": { $gt: 9 }, genres: ["Drama"] });

// $not -> ne

// Elements
// movies which have a image
db.movies.find({ image: { $exists: true } }).pretty();
// we can pass multiple condition
db.movies.find({ "ratings.average": { $exists: true, $gt: 7 } }).pretty();
// movies which have a image and not null
db.movies.find({ image: { $exists: true, $ne: null } }).pretty();

// $type works like $exists it checks for data type

// Expression
// Regex -> Pattern
db.movies.find({ summary: { $regex: /musical/ } }).pretty();

// $expr
// volume greater than sales
db.sales.find({ $expr: { $gt: ["$volume", "$target"] } });

// movies fit into 3 genres -> genre array contain 3 categories
db.movies.find({ genres: { $size: 3 } }).pretty();

// action and thriller order doesn't matter
// if we don't add all if the order of the genre change it only retrieve the matching elements only
db.movies.find({ genres: { $all: ["action", "thriller"] } }).pretty();

// Sorting
// 1 -> ascending
// -1 -> descending

db.movies.find().sort({ "rating.average": 1, runtime: -1 }).pretty();

// Projection
// 1 -> include
// 0 -> exclude

db.movies.find({}, { name: 1, genres: 1, rating: 1, _id: 0 });
