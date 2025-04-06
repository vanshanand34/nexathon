'use client';
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { LANGUAGES, DEFAULT_CODE_SNIPPETS } from "@/components/constants";

function App() {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(DEFAULT_CODE_SNIPPETS["javascript"]);
    const [output, setOutput] = useState("");
    const [stdin, setStdin] = useState("");

    useEffect(() => {
        setCode(DEFAULT_CODE_SNIPPETS[language] || "");
    }, [language]);

    const handleRun = async () => {
        try {
            const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
                language,
                files: [{ content: code }],
                stdin,
                version: LANGUAGES[language],
            });
            setOutput(res.data?.run?.output || "");
        } catch (err) {
            setOutput("Error running code");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 space-y-4">
            <header className="text-3xl font-bold text-center py-4 flex items-center justify-center">
                <div className="bg-white p-4 rounded-md text-gray-700">
                    Code Editor
                </div>
            </header>

            <div className="flex justify-center gap-4">
                <select
                    className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    {Object.keys(LANGUAGES).map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={handleRun}
                >
                    Run Code
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4" style={{ height: "calc(100vh - 160px)" }}>
                {/* Editor */}
                <div className="w-full md:w-1/2 h-full border border-gray-300 rounded-md overflow-hidden">
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value || "")}
                    />
                </div>

                {/* Input + Output */}
                <div className="w-full md:w-1/2 flex flex-col gap-4 h-full">
                    {/* Stdin */}
                    <div className="flex-1 flex flex-col p-4 border border-gray-300 rounded-md bg-white dark:bg-gray-800 min-h-0">
                        <h2 className="font-semibold mb-2">Input (stdin)</h2>
                        <textarea
                            className="flex-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-900 dark:text-white resize-none overflow-auto min-h-0"
                            placeholder="Enter input data here..."
                            value={stdin}
                            onChange={(e) => setStdin(e.target.value)}
                        />
                    </div>

                    {/* Output */}
                    <div className="flex-1 p-4 border border-gray-300 rounded-md bg-white dark:bg-gray-800 overflow-auto min-h-0">
                        <h2 className="font-semibold mb-2">Output</h2>
                        <pre className="whitespace-pre-wrap">{output}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
