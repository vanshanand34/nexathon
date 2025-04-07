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
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCode(DEFAULT_CODE_SNIPPETS[language] || "");
    }, [language]);

    const handleRun = async () => {
        try {
            setLoading(true);
            const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
                language,
                files: [{ content: code }],
                stdin,
                version: LANGUAGES[language],
            });
            setOutput(res.data?.run?.output || "");
        } catch (err) {
            setOutput("Error running code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24  text-gray-900 dark:text-white p-4 space-y-4">
            <header className="text-3xl font-bold text-center py-4 flex items-center justify-center">
                <div className="bg-white dark:bg-inherit dark:outline dark:outline-white p-4 rounded-md text-gray-700 dark:text-white">
                    Code Compiler
                </div>
            </header>

            <div className="flex justify-center gap-4 py-4">
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer flex items-center justify-center gap-2 min-w-[120px]"
                    onClick={handleRun}
                    disabled={loading}
                >
                    {loading && (
                        <svg className="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4">
                            </circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    <span>{loading ? 'Running...' : 'Run Code'}</span>
                </button>


            </div>

            <div className="flex flex-col px-4 md:px-1 md:flex-row gap-4" style={{ height: "calc(100vh - 160px)" }}>
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
