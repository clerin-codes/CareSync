require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});