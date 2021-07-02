// i) mongod -> as administrator
// ii) mongo
// iii) show dbs
// iv) use contactData

// insertOne
db.persons.insertOne({
  name: "max",
  age: 30,
  hobbies: ["sports", "cooking"],
});

// insertMany
db.persons.insertMany([
  {
    name: "max",
    age: 30,
    hobbies: ["sports", "cooking"],
  },
  {
    name: "manu",
    age: 29,
    hobbies: ["sports", "yoga"],
  },
]);

// insert
db.persons.insert({
  name: "phill",
  age: 26,
});

// Ordered Insert (if one fails it cancel entire insert but doesn't fallback)

// custom ID
db.hobbies.insertMany([
  { _id: "sports", name: "Sports" },
  { _id: "cooking", name: "Cooking" },
]);

// ****** "_id " ****** ordered:true -> Default
db.hobbies.insertMany(
  [
    { _id: "sports", name: "Sports" }, // sports duplicate
    { _id: "hiking", name: "Hiking" },
  ],
  //   if we add this flag only duplication will  prompt error but other records inserted
  { ordered: false }
  //   if we don't provide this flag hiking wasn't insert to db
);

// Write Concern
// { w:1 , wtimeout:200 ,j:undefined} -> w write # how many instances should ACK (acknowledged)
// j journal -> todo (operation not completed yet)  / backup

db.persons.insertOne(
  {
    name: "percy",
    age: 30,
    hobbies: ["sports", "cooking"],
  },
  { writeConcern: { w: 1, j: true } }
);

// Atomicity -> Transaction succeed as a whole or failed no in between
// when fail it rollback per document level
// while document in process server has issues

// Importing the Data
// i) navigate into the folder which contain json file -> cd /users/....
// ii) mongodimport <JSON FileName>.json -d <DataBase Name> -c <Collection Name> --jsonArray --drop
