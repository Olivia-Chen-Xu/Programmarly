"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToDocumentChanges = exports.refreshDiagnostics = exports.PAIRS = exports.EXTENSION_MENTION = void 0;
const vscode = require("vscode");
/** Code that is used to associate diagnostic entries with code actions. */
exports.EXTENSION_MENTION = "Programmarly";
/** String to detect in the text document. */
exports.PAIRS = [
    { good: "def", bad: "public void" },
    { good: "self.", bad: "this." },
    { good: "False", bad: "false" },
    { good: "True", bad: "true" },
];
/**
 * Analyzes the text document for problems.
 * This demo diagnostic problem provider finds all mentions of 'PAIRS.bad'.
 * @param doc text document to analyze
 * @param emojiDiagnostics diagnostic collection
 */
function refreshDiagnostics(doc, emojiDiagnostics) {
    const diagnostics = [];
    function hasError(line) {
        for (let pair of exports.PAIRS) {
            if (line.includes(pair.bad)) {
                return [true, pair];
            }
        }
        return [false, null];
    }
    for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
        const lineOfText = doc.lineAt(lineIndex);
        const [foundError, pair] = hasError(lineOfText.text);
        if (foundError) {
            diagnostics.push(createDiagnostic(doc, lineOfText, lineIndex, pair));
        }
    }
    emojiDiagnostics.set(doc.uri, diagnostics);
}
exports.refreshDiagnostics = refreshDiagnostics;
function createDiagnostic(doc, lineOfText, lineIndex, pair) {
    // find where in the line of thet the 'emoji' is mentioned
    const index = lineOfText.text.indexOf(pair.bad);
    // create range that represents, where in the document the word is
    const range = new vscode.Range(lineIndex, index, lineIndex, index + pair.bad.length);
    const diagnostic = new vscode.Diagnostic(range, "Do you mean: " + pair.good, vscode.DiagnosticSeverity.Information);
    diagnostic.code = exports.EXTENSION_MENTION;
    return diagnostic;
}
function subscribeToDocumentChanges(context, syntaxDiagnostics) {
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, syntaxDiagnostics);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            refreshDiagnostics(editor.document, syntaxDiagnostics);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) => refreshDiagnostics(e.document, syntaxDiagnostics)));
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument((doc) => syntaxDiagnostics.delete(doc.uri)));
}
exports.subscribeToDocumentChanges = subscribeToDocumentChanges;
//# sourceMappingURL=diagnostics.js.map