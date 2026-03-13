require('dotenv').config();
const connectDB = require('./src/config/database');
const app = require('./src/app');
// const { resume, selfDescription , jobDescription} = require("./src/services/temp");
// const generateInterviewReport = require("./src/services/ai.service")
connectDB();



// async function testAI() {
//   try {
//     const result = await generateInterviewReport({
//       resume,
//       selfDescription,
//       jobDescription
//     });

//     console.log("AI RESULT:", result);
//   } catch (err) {
//     console.error("AI TEST ERROR:", err);
//   }
// }

// testAI();
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});
