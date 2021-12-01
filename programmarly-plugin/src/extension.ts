// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  subscribeToDocumentChanges,
  EXTENSION_MENTION,
  PAIRS,
} from "./diagnostics";

const COMMAND = "code-actions-sample.command";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "Programmarly" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "Programmarly.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from Programmarly!");
    }
  );

  context.subscriptions.push(disposable);

  const syntaxDiagnostics =
    vscode.languages.createDiagnosticCollection("syntax");
  context.subscriptions.push(syntaxDiagnostics);

  subscribeToDocumentChanges(context, syntaxDiagnostics);

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider("python", new SyntaxInfo(), {
      providedCodeActionKinds: SyntaxInfo.providedCodeActionKinds,
    })
  );
}

/**
 * Provides code actions corresponding to diagnostic problems.
 */
export class SyntaxInfo implements vscode.CodeActionProvider {
  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix,
  ];

  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.CodeAction[] {
    // for each diagnostic entry that has the matching `code`, create a code action command
    const start = range.start;
    const line = document.lineAt(start.line);
    const error = line.text.substring(
      range.start.character,
      range.end.character
    );
    const pair = PAIRS.find((pair) => pair.bad === error);
    return context.diagnostics
      .filter((diagnostic) => diagnostic.code === EXTENSION_MENTION)
      .map((diagnostic) =>
        this.createFix(document, range, pair?.good, error.length)
      );
  }

  private createFix(
    document: vscode.TextDocument,
    range: vscode.Range,
    correction: string | undefined,
    length: number
  ): vscode.CodeAction {
    const fix = new vscode.CodeAction(
      `Convert to ${correction}`,
      vscode.CodeActionKind.QuickFix
    );
    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.replace(
      document.uri,
      new vscode.Range(range.start, range.start.translate(0, length)),
      correction ? correction : ""
    );
    return fix;
  }
}
// this method is called when your extension is deactivated
export function deactivate() {}
