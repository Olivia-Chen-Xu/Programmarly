import * as vscode from "vscode";

/** Code that is used to associate diagnostic entries with code actions. */
export const EXTENSION_MENTION = "Programmarly";

/** String to detect in the text document. */
export const PAIRS = [
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
export function refreshDiagnostics(
  doc: vscode.TextDocument,
  emojiDiagnostics: vscode.DiagnosticCollection
): void {
  const diagnostics: vscode.Diagnostic[] = [];

  function hasError(line: string) {
    for (let pair of PAIRS) {
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

function createDiagnostic(
  doc: vscode.TextDocument,
  lineOfText: vscode.TextLine,
  lineIndex: number,
  pair: any
): vscode.Diagnostic {
  // find where in the line of thet the 'emoji' is mentioned
  const index = lineOfText.text.indexOf(pair.bad);

  // create range that represents, where in the document the word is
  const range = new vscode.Range(
    lineIndex,
    index,
    lineIndex,
    index + pair.bad.length
  );

  const diagnostic = new vscode.Diagnostic(
    range,
    "Do you mean: " + pair.good,
    vscode.DiagnosticSeverity.Information
  );
  diagnostic.code = EXTENSION_MENTION;

  return diagnostic;
}

export function subscribeToDocumentChanges(
  context: vscode.ExtensionContext,
  syntaxDiagnostics: vscode.DiagnosticCollection
): void {
  if (vscode.window.activeTextEditor) {
    refreshDiagnostics(
      vscode.window.activeTextEditor.document,
      syntaxDiagnostics
    );
  }
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        refreshDiagnostics(editor.document, syntaxDiagnostics);
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) =>
      refreshDiagnostics(e.document, syntaxDiagnostics)
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((doc) =>
      syntaxDiagnostics.delete(doc.uri)
    )
  );
}
