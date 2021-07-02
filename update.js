// Update
// use userData -> db.users.insertMany([])

// {
//     "_id" : ObjectId("60df29ddb031e6e20ac37d73"),
//     "name" : "Max",
//     "hobbies" : [
//             {
//                     "title" : "Sports",
//                     "frequency" : 3
//             },
//             {
//                     "title" : "Cooking",
//                     "frequency" : 6
//             }
//     ],
//     "phone" : 131782734
// }

// To update a document
// i) identify the document
// ii) define how it should change

// upadateOne
// $set -> simply takes a document you describe some fields that should be changed
// or added to the existing document (doesn't override the existing values)
db.users.updateOne(
  { _id: ObjectId("60df29ddb031e6e20ac37d73") },
  {
    $set: {
      hobbies: [
        { title: "Sports", frequency: 5 },
        { title: "Cooking", frequency: 3 },
        { title: "Hiking", frequency: 1 },
      ],
    },
  }
);

// updateMany ( add a new field )
db.users.updateMany(
  { "hobbies.title": "Sports" },
  {
    $set: {
      isSporty: true,
      isHealthy: true,
    },
  }
);

// incrementing a number
// + inc - decrement
db.users.updateOne(
  { name: "Manuel" },
  {
    $inc: {
      age: 1,
    },
    // $set:{} -> can use like this too
  }
);

// $min - new value is lower than the existing value
//  $max - new value is higher than old value
// $mul - multiply the existing with given fraction
db.users.updateOne(
  { name: "Chris" },
  {
    $min: {
      age: 35,
    },
    // $set:{} -> can use like this too
  }
);

// Get rid of fields
db.users.updateMany(
  { isSporty: true },
  {
    $unset: {
      phone: "",
    },
  }
);

// Renaming
db.users.updateMany(
  {},
  {
    $rename: {
      hobbies: "interests",
    },
  }
);

// upsert - Add if not there update if existing
db.users.updateMany(
  { name: "Maria" },
  {
    $set: {
      age: 28,
      hobbies: [{ title: "Cooking" }, { frequency: 4 }],
    },
  },
  //   combination of update and insert
  { upsert: true }
);

// update all where hobbies.title -> sports and hobbies.frequency -> gte 3
db.users
  .find({
    $and: [{ "hobbies.title": "Sports" }, { "hobbies.frequency": { $gte: 3 } }],
  })
  .pretty();

//   correct approach
db.users
  .find({
    hobbies: { $elemMatch: { title: "Sports", frequency: { $gte: 3 } } },
  })
  .pretty();

//   "hobbies.$" -> automatically refer to the element matched in the filter
//  case : add new field / update  highFrequency and set it to true where Sports frequency is gte 3
db.users.updateMany(
  {
    hobbies: { $elemMatch: { title: "Sports", frequency: { $gte: 3 } } },
  },
  {
    $set: {
      "hobbies.$.highFrequency": true,
    },
  }
);

// update all array elements
// $[] -> update all array elements
//  case :  decrease the frequency of his all hobbies of the users where age gt 30
db.users.updateMany(
  { age: { $gt: 30 } },
  {
    $inc: {
      "hobbies.$[].frequency": -1,
    },
  }
);

// find and update
db.users
  .find({
    age: { $lt: 30 },
  })
  .pretty();

// case : add field goodFrequency : true to users where age lt 30 and each hobby frequency is gt 3

// "age" : 28
// "hobbies" : [
//             {
//                     "title" : "Sports",
//                     "frequency" : 2
// no good frequency added
//             },
//             {
//                     "title" : "Cooking",
//                      "frequency" : 6,
//                      "goodFrequency" : true
//
//             }
//     ],
db.users.updateMany(
  {
    age: { $lt: 30 },
  },
  {
    $set: {
      "hobbies.$[el].goodFrequency": true,
    },
  },
  { arrayFilters: [{ "el.frequency": { $gt: 3 } }] }
);

//  Adding new element to an array
// $each is used to add more elements
// $addToSet -> add unique values only works like push but UNIQUE
db.users.updateOne(
  { name: "Maria" },
  {
    $push: {
      hobbies: { title: "New hobby", frequency: 4 },
      //   hobbies: {
      //     $each: [
      //       { title: "New hobby", frequency: 4 },
      //       { title: "Fishing", frequency: 2 },
      //     ],
      //   },
    },
  }
);

// Removing $pop -> last element
db.users.updateOne(
  { name: "Maria" },
  {
    $pull: {
      hobbies: { title: "New hobby" },
    },
    // $pop: {
    //   hobbies: 1,
    // },
  }
);
