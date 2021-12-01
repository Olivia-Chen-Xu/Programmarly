from pygments import highlight
from pygments import lexers
from pygments.formatters import HtmlFormatter


code = open("a3_oliviaxu.txt", "r").read()
formatter = HtmlFormatter()
lex = lexers.get_lexer_by_name("python")

with open("out.html", "w") as f:
    highlight(code, lex, formatter, outfile=f)

print(HtmlFormatter().get_style_defs(".highlight"))
