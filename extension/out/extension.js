"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.SyntaxInfo = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const diagnostics_1 = require("./diagnostics");
const COMMAND = "code-actions-sample.command";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "Programmarly" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("programmarly--extension-.helloWorld", () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage("Programmarly is running!");
    });
    context.subscriptions.push(disposable);
    const syntaxDiagnostics = vscode.languages.createDiagnosticCollection("syntax");
    context.subscriptions.push(syntaxDiagnostics);
    (0, diagnostics_1.subscribeToDocumentChanges)(context, syntaxDiagnostics);
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider("python", new SyntaxInfo(), {
        providedCodeActionKinds: SyntaxInfo.providedCodeActionKinds,
    }));
}
exports.activate = activate;
/**
 * Provides code actions corresponding to diagnostic problems.
 */
class SyntaxInfo {
    provideCodeActions(document, range, context, token) {
        // for each diagnostic entry that has the matching `code`, create a code action command
        const start = range.start;
        const line = document.lineAt(start.line);
        const error = line.text.substring(range.start.character, range.end.character);
        const pair = diagnostics_1.PAIRS.find((pair) => pair["java"] === error);
        return context.diagnostics
            .filter((diagnostic) => diagnostic.code === diagnostics_1.EXTENSION_MENTION)
            .map((diagnostic) => this.createFix(document, range, pair?.python, error.length));
    }
    createFix(document, range, correction, length) {
        const fix = new vscode.CodeAction(`Convert to "${correction}"`, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        fix.edit.replace(document.uri, new vscode.Range(range.start, range.start.translate(0, length)), correction ? correction : "");
        return fix;
    }
}
exports.SyntaxInfo = SyntaxInfo;
SyntaxInfo.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
];
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map