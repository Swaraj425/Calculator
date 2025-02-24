/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBars } from "react-icons/fa";
import { url } from "../App";

const Calculator = () => {
    const [shownav, setShownav] = useState(false);
    const [expression, setExpression] = useState("");
    const [result, setResult] = useState("");
    const [mode, setMode] = useState("Standard"); // Toggle between Standard & Scientific
    const [memory, setMemory] = useState(0); // Memory storage 
    const [showHistory, setShowHistory] = useState(false)
    const [history, setHistory] = useState([]);

    const navbar = () => {
        setShownav(!shownav);
    };

    const toggleMode = (newMode) => {
        setMode(newMode);
        setShownav(false);
        setExpression("");
        setResult("");
        setShowHistory(newMode === "History");
    };

    // Function to convert degrees to radians
    const degreesToRadians = (deg) => (deg * Math.PI) / 180;

    // Standard Mode Buttons
    const standardButtons = [
        "MC", "MR", "M+", "M-",
        "%", "1/x", "C", "⌫",
        "(", ")", "x²", "√",
        "7", "8", "9", "×",
        "4", "5", "6", "-",
        "1", "2", "3", "+",
        ".", "0", "=", "/"
    ];

    // Scientific Mode Buttons
    const scientificButtons = [
        "MC", "MR", "M+", "M-",
        "sin", "cos", "tan", "log",
        "e", "π", "ln", "^",
        "!", "1/x", "C", "⌫",
        "(", ")", "x²", "√",
        "7", "8", "9", "×",
        "4", "5", "6", "-",
        "1", "2", "3", "+",
        ".", "0", "=", "/"
    ];

    const buttons = mode === "Scientific" ? scientificButtons : standardButtons;

    useEffect(() => {
        const handleKeyPress = (event) => {
            const keyMap = {
                "Enter": "=",
                "Backspace": "⌫",
                "Delete": "C",
                "*": "×",
                "/": "/",
                "-": "-",
                "+": "+",
                "(": "(",
                ")": ")",
                ".": ".",
                "^": "^",
                "%": "%",
                "!": "!",
                "1": "1",
                "2": "2",
                "3": "3",
                "4": "4",
                "5": "5",
                "6": "6",
                "7": "7",
                "8": "8",
                "9": "9",
                "0": "0",
                "s": "sin",
                "c": "cos",
                "t": "tan",
                "l": "log",
                "e": "e",
                "p": "π",
                "n": "ln",



            };

            if (keyMap[event.key]) {
                handleButtonClick(keyMap[event.key]);
            } else if (!isNaN(event.key)) {
                handleButtonClick(event.key);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [expression]);


    const handleButtonClick = (value) => {

        // Clear the expression and result
        if (value === "C") {
            setExpression("");
            setResult("");
            return;
        }

        // Handle backspace
        if (value === "⌫") {
            setExpression(expression.slice(0, -1));
            return;
        }

        // Evaluate the expression
        if (value === "=") {
            evaluateExpression();
            return;
        }

        // Handle numbers and operators
        if (value === "1/x" && expression) {
            setExpression(`1/(${expression})`);
            return;
        }

        // Handle Square, Factorial, Pi, e
        if (value === "x²") {
            setExpression(`(${expression})^2`);
            return;
        }

        // Handle Square Root
        if (value === "√") {
            setExpression(`sqrt(${expression})`);
            return;
        }

        // Handle exponentiation 
        if (value === "^") {
            setExpression(expression + "^");
            return;
        }

        // Handle Factorial
        if (value === "!") {
            setExpression(`factorial(${expression})`);
            return;
        }

        // Handle Pi
        if (value === "π") {
            setExpression(expression + "3.1415926535");
            return;
        }

        // Handle e
        if (value === "e") {
            setExpression(expression + "2.7182818284");
            return;
        }

        // Memory Functions

        // Handle Memory Addition
        if (value === "M+") {
            setMemory(memory + (parseFloat(result) || 0));
            return;
        }

        // Handle Memory Subtraction 
        if (value === "M-") {
            setMemory(memory - (parseFloat(result) || 0));
            return;
        }

        // Handle Memory Recall
        if (value === "MR") {
            setExpression(memory.toString());
            return;
        }

        // Handle Memory Clear
        if (value === "MC") {
            setMemory(0);
            return;
        }

        // Handling trigonometric functions (sin, cos & tan)
        if (["sin", "cos", "tan"].includes(value)) {
            setExpression(expression + `${value}(`);
            return;
        }

        // If a number is entered after a function (sin(, cos(, etc.), close the parentheses automatically
        if (!isNaN(value) || value === ".") {
            let lastChar = expression.slice(-1);
            if (lastChar === "(") {
                setExpression(expression + value);
            } else if (expression.match(/(sin|cos|tan)\(\d*$/)) {
                setExpression(expression + value + ")");
            } else {
                setExpression(expression + value);
            }
            return;
        }

        // When clicking an operator, close the parenthesis automatically if it's open
        if (["+", "-", "×", "/", "^", ")", "="].includes(value)) {
            if (expression.includes("(") && !expression.includes(")")) {
                setExpression(expression + `)${value}`);
            } else {
                setExpression(expression + value);
            }
            return;
        }

        setExpression(expression + value);
    };


    const evaluateExpression = async () => {
        try {
            let formattedExpression = expression.replace(/×/g, "*"); // Convert '×' to '*'

            // Check for division by zero (including 1/0)
            if (/\/0(\D|$)/.test(formattedExpression) || /1\/\(0\)/.test(formattedExpression)) {
                setResult("Cannot divide by Zero");
                setHistory([...history, { expression, result: "Cannot divide by Zero" }]); // Add to history
                return;
            }

            console.log("Sending expression:", formattedExpression);

            const response = await axios.post(`${url}/api/calculate`,
                { expression: formattedExpression }, // Send formatted expression
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Response from backend:", response.data);
            setResult(response.data.result);
            setHistory([...history, { expression, result: response.data.result }]);
        } catch (error) {
            console.error("Backend Error:", error.response?.data || error.message);
            setResult("Error");
        }
    };

    return (
        <div className="flex w-full h-full bg-gray-900 text-white">
            {shownav && (
                <div className=" w-[70%] md:w-[40%] xl:w-[20%] absolute left-0 bg-gray-900 h-screen rounded-lg">
                    <div className="flex gap-5 mt-10 ml-5 justify-start items-center mx-5">
                        <FaBars onClick={navbar} className="text-2xl text-white cursor-pointer" />
                        <h1 className="text-3xl text-white">Calculator</h1>
                    </div>
                    <ul className="flex flex-col w-full px-2 justify-start mt-10 gap-10 items-start h-full">
                        <li className={`px-4 py-2 rounded w-full cursor-pointer ${mode === "Standard" ? "bg-gray-950 border" : "border"}`} onClick={() => toggleMode("Standard")}>
                            Standard
                        </li>
                        <li className={`px-4 py-2 rounded w-full cursor-pointer ${mode === "Scientific" ? "bg-gray-950 border" : "border"}`} onClick={() => toggleMode("Scientific")}>
                            Scientific
                        </li>
                        <li className={`px-4 py-2 rounded w-full cursor-pointer ${mode === "History" ? "bg-gray-950 border" : "border"}`} onClick={() => toggleMode("History")}>
                            History
                        </li>
                    </ul>
                </div>
            )}

            <div className="flex flex-col w-full bg-gray-800 rounded-lg shadow-lg">
                <div className="flex justify-start gap-5 items-center px-5 py-3 mt-5 rounded-t-lg">
                    <FaBars onClick={navbar} className="text-2xl cursor-pointer" />
                    <h1 className="text-2xl font-bold">{mode} Calculator</h1>
                </div>

                {showHistory ? (
                    <div className="p-4 h-full overflow-y-auto">
                        <h2 className="text-xl font-bold mb-3">Calculation History</h2>
                        {history.length === 0 ? <p>No history yet.</p> : history.map((entry, index) => (
                            <div key={index} className="border-b py-2">
                                <p>{entry.expression} = <span className="text-green-400">{entry.result}</span></p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col w-full h-full bg-gray-800 mt-2 rounded-lg">
                        {/*Display */}
                        <div className="flex flex-col items-end text-right px-6 py-4">
                            <div className=" text-4xl md:text-5xl bg-gray-900 w-full py-4 px-4 rounded font-mono">{expression || "0"}</div>
                            {result && <div className=" text-4xl md:text-4xl mr-5 text-green-400 mt-2 h-full">{result}</div>}
                        </div>

                        {/* Buttons */}
                        <div className="grid grid-cols-4 gap-2 p-4 h-full">
                            {buttons.map((btn) => (
                                <button
                                    key={btn}
                                    className={`p-4 text-xl font-bold rounded bg-gray-700 hover:bg-gray-600 active:bg-gray-800 transition-all 
                                    ${btn === "C" || btn === "⌫" ? "bg-red-500 hover:bg-red-400" : ""} 
                                    ${btn === "=" ? "bg-blue-500 hover:bg-blue-400 col-span-1" : ""}`}
                                    onClick={() => handleButtonClick(btn)}
                                >
                                    {btn}
                                </button>   
                            ))}
                        </div>
                    </div>
                )}

            </div>





        </div>
    );
};

export default Calculator;


