'use client';
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { LANGUAGES, DEFAULT_CODE_SNIPPETS } from "@/components/constants";

function App() {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState(DEFAULT_CODE_SNIPPETS["javascript"]);
    const [output, setOutput] = useState("");

    useEffect(() => {
        setCode(DEFAULT_CODE_SNIPPETS[language] || "");
    }, [language]);

    const handleRun = async () => {
        try {
            const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
                language,
                files: [
                    { content: code, }
                ],
                version: LANGUAGES[language],
            });
            setOutput(res.data?.run?.output);
        } catch (err) {
            setOutput("Error running code");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 space-y-4">
            <header className="text-3xl font-bold text-center py-4 flex items-center justify-center">
                <div className="bg-white p-4 rounded-md text-gray-700">
                    Code Editor
                </div></header>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-[400px] border border-gray-300 rounded-md overflow-hidden">
                    <Editor
                        height="100%"
                        theme="vs-dark"
                        language={language}
                        value={code}
                        onChange={(value) => setCode(value || "")}
                    />
                </div>
                <div className="p-4 border border-gray-300 rounded-md bg-white dark:bg-gray-800">
                    <h2 className="font-semibold mb-2">Output</h2>
                    <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
            </div>
        </div>
    );
}

export default App;
