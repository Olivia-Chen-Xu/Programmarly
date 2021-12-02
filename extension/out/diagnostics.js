"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToDocumentChanges = exports.refreshDiagnostics = exports.PAIRS = exports.EXTENSION_MENTION = void 0;
const vscode = require("vscode");
/** Code that is used to associate diagnostic entries with code actions. */
exports.EXTENSION_MENTION = "Programmarly";
/** String to detect in the text document. */
exports.PAIRS = [
    { python: "abs", java: "abstract" },
    { python: "bool", java: "const" },
    { python: "continue", java: "continue" },
    { python: "if", java: "switch" },
    { python: "finally", java: "finally" },
    { python: "super", java: "super" },
    { python: "isinstance", java: "instanceof" },
    { python: "set", java: "enum" },
    { python: "import", java: "extends" },
    { python: "int", java: "final" },
    { python: "import", java: "implements" },
    { python: "bytes", java: "native" },
    { python: "return", java: "private" },
    { python: "finally", java: "protected" },
    { python: "return", java: "public" },
    { python: "return", java: "static" },
    { python: "global", java: "synchronized" },
    { python: "raise", java: "throws" },
    { python: "finally", java: "transient" },
    { python: "global", java: "volatile" },
    { python: "int", java: "boolean" },
    { python: "int", java: "byte" },
    { python: "int", java: "char" },
    { python: "float", java: "double" },
    { python: "float", java: "float" },
    { python: "int", java: "long" },
    { python: "float", java: "short" },
    { python: "int", java: "void" },
    { python: "object", java: "package" },
    { python: "True", java: "true" },
    { python: "False", java: "false" },
    { python: "None", java: "null" },
    { python: "type", java: "class" },
    { python: "object", java: "interface" },
    { python: "import", java: "import" },
    { python: "int", java: "String" },
    { python: "try", java: "do" },
    { python: "return", java: "static" },
    { python: "else", java: "else" },
    { python: "self", java: "this" },
];
/**
 * Analyzes the text document for problems.
 * This demo diagnostic problem provider finds all mentions of PAIRS['java'].
 * @param doc text document to analyze
 * @param syntaxDiagnostics diagnostic collection
 */
function refreshDiagnostics(doc, syntaxDiagnostics) {
    const diagnostics = [];
    function hasError(line) {
        for (let pair of exports.PAIRS) {
            if (line.includes(pair["java"])) {
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
    syntaxDiagnostics.set(doc.uri, diagnostics);
}
exports.refreshDiagnostics = refreshDiagnostics;
function createDiagnostic(doc, lineOfText, lineIndex, pair) {
    // find where in the line of thet the pair["java"] is mentioned
    const index = lineOfText.text.indexOf(pair["java"]);
    // create range that represents, where in the document the word is
    const range = new vscode.Range(lineIndex, index, lineIndex, index + pair["java"].length);
    const diagnostic = new vscode.Diagnostic(range, "Did you mean: " + pair["python"], vscode.DiagnosticSeverity.Information);
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