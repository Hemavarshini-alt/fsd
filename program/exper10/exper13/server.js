const express = require("express");
const app = express();
app.use(express.json());
let users = [
{ id: 1, name: "John" },
{ id: 2, name: "Alice" }
];
app.get("/", (req, res) => {
res.status(200).send("<h2>🚀 User API is running</h2>");
});
function validateUser(req, res, next) {
if (!req.body.name || req.body.name.trim() === "") {
return res.status(400).json({ error: "Name is required" });
}
next();
}
app.get("/users", (req, res) => {
const { name } = req.query;
// 🔍 Search functionality
if (name) {
const filteredUsers = users.filter(user =>
user.name.toLowerCase().includes(name.toLowerCase())
);
return res.status(200).json(filteredUsers);
}
res.status(200).json(users);
});
app.get("/users/:id", (req, res) => {
const id = parseInt(req.params.id);
const user = users.find(u => u.id === id);
if (!user) {
return res.status(404).json({ error: "User not found" });
}
res.status(200).json(user);
});
app.post("/users", validateUser, (req, res) => {
const newUser = {
id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
name: req.body.name
};
users.push(newUser);
res.status(201).json(newUser);
});
app.put("/users/:id", validateUser, (req, res) => {
const id = parseInt(req.params.id);
const user = users.find(u => u.id === id);
if (!user) {
return res.status(404).json({ error: "User not found" });
}
user.name = req.body.name;
res.status(200).json({
message: "User updated successfully",
user: user
});
});
app.delete("/users/:id", (req, res) => {
const id = parseInt(req.params.id);
const userExists = users.some(u => u.id === id);
if (!userExists) {
return res.status(404).json({ error: "User not found" });
}
users = users.filter(u => u.id !== id);
res.status(200).json({ message: "User deleted successfully" });
});
app.use((err, req, res, next) => {
console.error("❌ Server Error:", err.stack);
res.status(500).json({ error: "Internal Server Error" });
});
app.use((req, res) => {
res.status(404).json({ error: "Route not found" });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`🚀 Server running on http://localhost:${PORT}`);
});
