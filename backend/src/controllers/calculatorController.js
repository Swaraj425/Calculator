import { evaluate } from "mathjs";
import Calculation from "../models/Calculation.js"; // Import the Calculation model

const calculateExpression = async (req, res) => {
  try {
    let { expression } = req.body;

    if (!expression) {
      console.log("No expression received!");
      return res.status(400).json({ error: "No expression provided" });
    }

    console.log("Received Expression:", expression);

    // Check for division by zero
    if (/\/\s*0(\D|$)/.test(expression)) {
      console.log("❌ Division by Zero Detected!");
      return res.json({ result: "Cannot divide by zero" });
    }

    // Convert percentage expressions
    expression = expression.replace(
      /(\d+(\.\d+)?)%(\d+(\.\d+)?)/g,
      "($1/100)*$3"
    );

    // Convert standalone percentages
    expression = expression.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

    // Convert degrees to radians for trigonometric functions
    expression = expression.replace(/sin\(([^)]+)\)/g, "sin($1 * pi / 180)");
    expression = expression.replace(/cos\(([^)]+)\)/g, "cos($1 * pi / 180)");
    expression = expression.replace(/tan\(([^)]+)\)/g, "tan($1 * pi / 180)");

    // Convert log and ln functions
    expression = expression.replace(/log\(([^)]+)\)/g, "log10($1)");
    expression = expression.replace(/ln\(([^)]+)\)/g, "log($1)"); // ln(x) is log(x) in mathjs

    // Evaluate the expression
    let result = evaluate(expression);

    // Round the result to 10 decimal places to avoid floating-point errors
    result = Number(result.toFixed(10));

    console.log("Calculation Successful:", result);

    // Save the calculation to the database
    const newCalculation = new Calculation({ expression, result });
    await newCalculation.save();

    res.json({ result });
  } catch (error) {
    console.error("Calculation Error:", error.message);
    res
      .status(400)
      .json({ error: "Invalid Calculation", details: error.message });
  }
};

export { calculateExpression };
