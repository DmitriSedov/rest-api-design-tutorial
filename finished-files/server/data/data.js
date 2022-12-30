/**
 * This is the database for our API.
 * We store two types of data: `notes` and `users`.
 * A user can author many notes but a note is always owned by a single user.
 * 
 * I've decided to directly store this data in the form of JS objects rather than storing it as JSON.
 * This is to minimize implementation details and keep the focus on REST API design.
 * Otherwise, we'd have to read those JSON files and parse the JSON into the same JS objects that we're using below.
 */

 let notes = [
  { 
    id: "1",
    text: "New Year Resolutions for 2023",
    createdAt: 1671494400000,
    updatedAt: 1671926400000 
  },
  { 
    id: "2",
    text: "Notes on meeting with investor",
    createdAt: 1671580800000,
    updatedAt: 1672012800000 
  },
  { 
    id: "3",
    text: "Vacation itinerary",
    createdAt: 1671667200000,
    updatedAt: 1672099200000 
  },
  { 
    id: "4",
    text: "Notes on Atomic Habits by James Clear",
    createdAt: 1671753600000,
    updatedAt: 1672185600000 
  },
  { 
    id: "5",
    text: "Parenting Tips",
    createdAt: 1671840000000,
    updatedAt: 1672272000000
  }
];

// Passwords should always be hashed before storing in the database. 
// But I am storing them directly for the same reason as mentioned above, for minimizing implementation details.
// And also for convenience while testing :)
let users = [
  { 
    id: "1",
    name: "Saurabh",
    email: "saurabh@example.com",
    password: "abcd1234",
    notes: [ "1", "2", "3" ],
    createdAt: 1671494400000,
    updatedAt: 1671494400000 
  },
  { 
    id: "2",
    name: "Arpita",
    email: "arpita@example.com",
    password: "abcd1234",
    notes: [ "4", "5" ],
    createdAt: 1671494400000,
    updatedAt: 1671494400000 
  }
]

let data = {
  users,
  notes
};

module.exports = data;