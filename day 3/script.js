// Starting data set
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" }
];

// 1. Search notes case-insensitively
function searchNotes(word) {
  const query = word.toLowerCase();
  return notes.filter(n => n.text.toLowerCase().includes(query));
}

// 2. Find longest note using array reduce
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((max, current) => 
    current.text.length > max.text.length ? current : max
  );
}

// 3. Count categories using forEach
function countByCategory() {
  const tally = {};
  notes.forEach(item => {
    if (item.category) {
      tally[item.category] = (tally[item.category] || 0) + 1;
    }
  });
  return tally;
}

// 4. Format summary with Object.entries and template literals
function getSummary() {
  const tally = countByCategory();
  const total = notes.length;
  const label = total === 1 ? "note" : "notes";
  
  const categoryList = Object.entries(tally)
    .map(([cat, qty]) => `${qty} ${cat}`)
    .join(', ');
    
  return `${total} ${label}: ${categoryList}.`;
}

// 5. Check for existing notes regardless of whitespace or casing
function isDuplicate(text) {
  const cleaned = text.trim().toLowerCase();
  return notes.some(n => n.text.trim().toLowerCase() === cleaned);
}

// 6. Validate and insert a new note
function addNote(text, category) {
  const allowedCategories = ['personal', 'work', 'study'];

  if (text.length < 1 || text.length > 200) {
    console.log("Rejected: Note length must be 1-200 characters.");
    return false;
  }
  
  if (isDuplicate(text)) {
    console.log("Rejected: Note already exists.");
    return false;
  }
  
  if (!allowedCategories.includes(category)) {
    console.log("Rejected: Invalid category provided.");
    return false;
  }

  const nextId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) + 1 : 1;
  notes.push({ id: nextId, text: text, category: category });
  return true;
}

// --- CONSOLE TESTS ---

console.log("1. Testing searchNotes:");
console.log(searchNotes("javascript")); // Expected: Matches array with item id 4
console.log(searchNotes("nonexistent")); // Expected: []

console.log("2. Testing longestNote:");
console.log(longestNote()); // Expected: Item id 2
const backup = notes;
notes = [];
console.log(longestNote()); // Expected: null
notes = backup;

console.log("3. Testing countByCategory:");
console.log(countByCategory()); // Expected: { personal: 2, study: 2, work: 1 }
notes.push({ id: 10, text: "Temp", category: "work" });
console.log(countByCategory()); // Expected: { personal: 2, study: 2, work: 2 }
notes.pop();

console.log("4. Testing getSummary:");
console.log(getSummary()); // Expected: "5 notes: 2 personal, 2 study, 1 work."
const tempNotes = notes;
notes = [{ id: 1, text: "Solo note", category: "personal" }];
console.log(getSummary()); // Expected: "1 note: 1 personal."
notes = tempNotes;

console.log("5. Testing isDuplicate:");
console.log(isDuplicate("BUY MILK AND BREAD  ")); // Expected: true
console.log(isDuplicate("Do laundry"));          // Expected: false

console.log("6. Testing addNote:");
console.log(addNote("Submit homework", "study")); // Expected: true
console.log(addNote("Call mum", "personal"));      // Expected: false (duplicate)
console.log(addNote("Play football", "sports"));   // Expected: false (invalid category)
