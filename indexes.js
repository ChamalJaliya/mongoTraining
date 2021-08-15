/**
 * mongosh
 * mongoimport persons.js -d contactData -c contacts --jsonArray --drop
 */

// *INDEXES
//Index can speed up  find update and delete queries

// contactData>
// db.contacts.findOne()
// {
//   _id: ObjectId("6118ae8cf82b8779a7a2b950"),
//   gender: 'male',
//   name: { title: 'mr', first: 'harvey', last: 'chambers' },
//   location: {
//     street: '3287 high street',
//     city: 'carlow',
//     state: 'wexford',
//     postcode: 47671,
//     coordinates: { latitude: '-22.5329', longitude: '168.9462' },
//     timezone: {
//       offset: '+5:00',
//       description: 'Ekaterinburg, Islamabad, Karachi, Tashkent'
//     }
//   },
//   email: 'harvey.chambers@example.com',
//   login: {
//     uuid: '8f583f57-c999-4a5d-a8c1-d913b574c082',
//     username: 'greenrabbit148',
//     password: 'june',
//     salt: 'dAsaXJGK',
//     md5: 'e3759db2391b798ffea2cc168e1280fd',
//     sha1: 'a3e77fd5fdd75e3b173ceec6c3c1bbe5e83540cc',
//     sha256: '7564eac1899234d5902fadfb995303a58370232f54bee6adb26e25394e2ffddd'
//   },
//   dob: { date: '1988-05-27T00:14:03Z', age: 30 },
//   registered: { date: '2007-03-11T06:20:19Z', age: 11 },
//   phone: '061-265-5188',
//   cell: '081-146-8382',
//   id: { name: 'PPS', value: '5608572T' },
//   picture: {
//     large: 'https://randomuser.me/api/portraits/men/82.jpg',
//     medium: 'https://randomuser.me/api/portraits/med/men/82.jpg',
//     thumbnail: 'https://randomuser.me/api/portraits/thumb/men/82.jpg'
//   },
//   nat: 'IE'
// }

//* CASE 1 -> finding the 60+ years
db.contacts.find({ "dob.age": { $gt: 60 } }).pretty();

// By default if we don't have a index for age mongoDB
// scans whole collection to retrieve the results "COLLECTIONSCAN"
// but if we set an index to age it scan only "INDEXSCAN" and fetch
// results from there (value are sorted by key)

// ****** Note ******
// Indexes are pointers to the documents to prompt the result
// getting the indexes aren't enough then , we need to fetch
// quickly narrows the subset from the whole collection

// ****** Disclaimer ******
// ! Indexes will slow down insert and update performance
// ! Indexes don't comes free
// ! Indexes great for queries which output 30% below the threshold.
// otherwise it is better not to use indexes ( eg :- full collection scan)

// * Checking the execution time of the query - COLLECTIONSCAN

// contactData>
db.contacts
  .explain("executionStats")
  .find({ "dob.age": { $gt: 60 } })
  .pretty();

// {
//   explainVersion: '1',
//   queryPlanner: {
//     namespace: 'contactData.contacts',
//     indexFilterSet: false,
//     parsedQuery: { 'dob.age': { '$gt': 60 } },
//     maxIndexedOrSolutionsReached: false,
//     maxIndexedAndSolutionsReached: false,
//     maxScansToExplodeReached: false,
//     winningPlan: {
// !      stage: 'COLLSCAN',
//       filter: { 'dob.age': { '$gt': 60 } },
//       direction: 'forward'
//     },
//     rejectedPlans: []
//   },
//   executionStats: {
//     executionSuccess: true,
// !   nReturned: 1222,
// !    executionTimeMillis: 712,
//     totalKeysExamined: 0,
// !    totalDocsExamined: 5000,
//     executionStages: {
// !      stage: 'COLLSCAN',
//       filter: { 'dob.age': { '$gt': 60 } },
//       nReturned: 1222,
//       executionTimeMillisEstimate: 626,
//       works: 5002,
//       advanced: 1222,
//       needTime: 3779,
//       needYield: 0,
//       saveState: 28,
//       restoreState: 28,
//       isEOF: 1,
//       direction: 'forward',
//       docsExamined: 5000
//     }
//   },
//   command: {
//     find: 'contacts',
//     filter: { 'dob.age': { '$gt': 60 } },
//     '$db': 'contactData'
//   },
//   serverInfo: {
//     host: 'DESKTOP-FKCGO26',
//     port: 27017,
//     version: '5.0.2',
//     gitVersion: '6d9ec525e78465dcecadcff99cce953d380fedc8'
//   },
//   serverParameters: {
//     internalQueryFacetBufferSizeBytes: 104857600,
//     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
//     internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
//     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
//     internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
//     internalQueryProhibitBlockingMergeOnMongoS: 0,
//     internalQueryMaxAddToSetBytes: 104857600,
//     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600
//   },
//   ok: 1
// }

//* Creating index for age field
db.contacts.createIndex({ "dob.age": 1 });

// * now there are two execution stages
// i) Finding Indexes
// ii) Fetching Document

// contactData> db.contacts.explain("executionStats").find({"dob.age":{$gt:60}}).pretty()
// {
//   explainVersion: '1',
//   queryPlanner: {
//     namespace: 'contactData.contacts',
//     indexFilterSet: false,
//     parsedQuery: { 'dob.age': { '$gt': 60 } },
//     maxIndexedOrSolutionsReached: false,
//     maxIndexedAndSolutionsReached: false,
//     maxScansToExplodeReached: false,
//     winningPlan: {
//       stage: 'FETCH',
//       inputStage: {
// !        stage: 'IXSCAN',
//         keyPattern: { 'dob.age': 1 },
//         indexName: 'dob.age_1',
//         isMultiKey: false,
//         multiKeyPaths: { 'dob.age': [] },
//         isUnique: false,
//         isSparse: false,
//         isPartial: false,
//         indexVersion: 2,
//         direction: 'forward',
//         indexBounds: { 'dob.age': [ '(60, inf.0]' ] }
//       }
//     },
//     rejectedPlans: []
//   },
//   executionStats: {
//     executionSuccess: true,
// !    nReturned: 1222,
// !    executionTimeMillis: 333,
// !    totalKeysExamined: 1222,
//     totalDocsExamined: 1222,
//     executionStages: {
// !      stage: 'FETCH',
//       nReturned: 1222,
//       executionTimeMillisEstimate: 250,
//       works: 1223,
//       advanced: 1222,
//       needTime: 0,
//       needYield: 0,
//       saveState: 3,
//       restoreState: 3,
//       isEOF: 1,
//       docsExamined: 1222,
//       alreadyHasObj: 0,
//       inputStage: {
//         stage: 'IXSCAN',
//         nReturned: 1222,
//         executionTimeMillisEstimate: 215,
//         works: 1223,
//         advanced: 1222,
//         needTime: 0,
//         needYield: 0,
//         saveState: 3,
//         restoreState: 3,
//         isEOF: 1,
//         keyPattern: { 'dob.age': 1 },
//         indexName: 'dob.age_1',
//         isMultiKey: false,
//         multiKeyPaths: { 'dob.age': [] },
//         isUnique: false,
//         isSparse: false,
//         isPartial: false,
//         indexVersion: 2,
//         direction: 'forward',
//         indexBounds: { 'dob.age': [ '(60, inf.0]' ] },
//         keysExamined: 1222,
//         seeks: 1,
//         dupsTested: 0,
//         dupsDropped: 0
//       }
//     }
//   },
//   command: {
//     find: 'contacts',
//     filter: { 'dob.age': { '$gt': 60 } },
//     '$db': 'contactData'
//   },
//   serverInfo: {
//     host: 'DESKTOP-FKCGO26',
//     port: 27017,
//     version: '5.0.2',
//     gitVersion: '6d9ec525e78465dcecadcff99cce953d380fedc8'
//   },
//   serverParameters: {
//     internalQueryFacetBufferSizeBytes: 104857600,
//     internalQueryFacetMaxOutputDocSizeBytes: 104857600,
//     internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
//     internalDocumentSourceGroupMaxMemoryBytes: 104857600,
//     internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
//     internalQueryProhibitBlockingMergeOnMongoS: 0,
//     internalQueryMaxAddToSetBytes: 104857600,
//     internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600
//   },
//   ok: 1
// }

//* Dropping Index
db.contacts.dropIndex({ "dob.age": 1 });

//*Compound Indexes
// Indexes for texts etc...
//  CASE -> 30+ years and male

db.contacts.createIndex({ "dob.age": 1, gender: 1 });

// Indexes also helps in sorting
db.contacts.find({ "dob.age": 35 }).sort({ gender: 1 });

//* Getting all available indexes
db.contacts.getIndexes();

// Create Unique indexes
db.contacts.createIndex({ email: 1 }, { unique: true });

// Partial Indexes
db.contacts.createIndex(
  { "dob.age": 1 },
  { partialFilterExpression: { "dob.age": { $gt: 60 } } }
);

// Special
//  we want a unique index for email at the same time some
//  some don't have a email address when insert it will not allow
// us to enter any user without an email unless we do following
db.contacts.createIndex(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $exists: true } } }
);

// by turning the partialFilterExpression flag with $exists we can
// avoid null value clashes in the future Indexes

//* TTL INDEX (Time To Live)
// Only works with simple date indexes
db.session.createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 });
//  Here all the documents delete after 10 seconds

// Coupon in online shop , SALE ... This will be helpful

// Explain() options

// i) "queryPlanner"
// ii) "executionStats"
// iii) "allPlansExecution"

// * Key Areas for look for efficiency
//  IXSCAN beats COLLSCAN
//  # of keys examined
//  # of Docs examined
//  # of Docs Returned

//*MultiKey Indexes
// Text -> Powerful than regex
// create an index to get all person live in karachi
// ! "text" and "$text" $search is a must
// Create the index
db.contacts.createIndex({ "location.timezone.description": "text" });
// Query
db.contacts.find({ $text: { $search: "Karachi" } }).count();

// Multiple Phrases
db.contacts.find({ $text: { $search: '"Karachi, Tashkent"' } });

// Sorting to get highest presidencies first
db.contacts
  .find(
    { $text: { $search: '"Karachi, Tashkent"' } },
    { score: { $meta: "textScore" } }
  )
  .sort({ score: { $meta: "textScore" } })
  .pretty();
 
  // Excluding
  // CASE -> Karachi but not Tashkent
  db.contacts.find({ $text: { $search: '"Karachi, -Tashkent"' } });
