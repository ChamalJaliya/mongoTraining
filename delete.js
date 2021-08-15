// Delete

// deleteOne
db.users.deleteOne({ name: "Chris" });

// deleteMany
db.users.deleteMany({ age: { $gt: 20 }, isSporty: true });

// deleteALL
db.users.deleteMany({});
// drop Collection
db.users.drop();
// drop DB
db.dropDatabase();
