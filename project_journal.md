## Table of contents :
1. Meeting #1
2. Meeting #2
3. [Meeting #3](https://github.com/Olivia-Chen-Xu/Programmarly/blob/main/project_journal.md#meeting-3---oct-20th)
4. [Meeting #4](https://github.com/Olivia-Chen-Xu/Programmarly/blob/main/project_journal.md#meeting-4---oct-27th)
5. [Meeting #5](https://github.com/Olivia-Chen-Xu/Programmarly/blob/main/project_journal.md#meeting-5---nov-3rd)

## Meeting #3 - Oct. 20th

### Thoughts : 
- **Olivia contacted Baptiste**, one of the authors of the Facebook AI paper. He replied : "[...] it may be difficult to reliably find errors in sentences in code (or natural languages) without any supervised data. You may try to use a language model to evaluate the log-likelihood of the code and flag unlikely snippets or try to generate some supervised data automatically [...] You could also learn to reproduce the output of a linter or compiler but you probably wouldn’t manage to do better than the rule-based method you used to create data. [...] we actually didn’t scrap the data from github ourselves, we got it from google BigQuery. They already collected most files from github public repositories and put them in a database you can query with SQL. [...] you may find the rest of the repo useful to preprocess the data or to train a model if you’re planning on using a transformer architecture. You can also use the pile dataset, which contains a lot of source code."
 
 ### To-do list:
 1) To-do
 2) To-do

## Meeting #4 - Oct. 27th

### Thoughts : 
- **Facebook AI wrote a [paper](https://ai.facebook.com/blog/deep-learning-to-translate-between-programming-languages/)** on a code translator they created ([repo](https://github.com/facebookresearch/TransCoder)). To get their data, they [used GitHub and Google Big Query](https://github.com/facebookresearch/CodeGen/blob/main/docs/googlebigquery.md). In the visual representation showed in the paper, if things are "semantically similar", they are grouped close together. We can download and use their model since it is open-source.
 
 ### To-do list:
 1) Download the Facebook models from GitHub and run some test data on them 
 2) Go through the [TransCode/data folder](https://github.com/facebookresearch/TransCoder/tree/main/data) to pick out the data we will use (we are going to use their *evaluation* data as our *training* data since we are doing a smaller project)

 3) Run pygment extraction (= syntax highlighting script) on all of the code to get the html version and relevant attributes 
 4) Run BeautifulSoup on the html output by pygments to get labels (this defines **Y**)

 5) Use models to learn representations for the words in the github code
 6) Collect representations, and add additional data (ex: categorical variables to describe the source language) to build the training inputs (this defines **X**)

 7) Begin benchmarking models to map X to Y
 8) For testing, we will need bad code samples

 ### What was done this week:
 - Olivia wrote the web scraper to extract our Y labels from the pygments html output

## Meeting #5 - Nov. 3rd

### Thoughts : 
- We need a list of attributes/keywords for each language
- We might make this a VSCode plugin (or not, we will see later)
- The main goal is we will have some kind of matrix/map/list that shows how each keyword maps to another keyword in every language, so the matrix would be size=n*n (for n languages)
- This is the first step, a very simple correction algorithm that only corrects keywords
- The next step IF this straightforward translation isnt good enough (for example going from a modern language to a primitive language you might need to change what's "inside" of a keyword and not just the keyword itself), we need to find another kind of model/algorithm 
 
 ### To-do list:
 1) Install [mini conda](https://docs.conda.io/en/latest/miniconda.html) 
 2) Figure out how to use the [Borealis infrastructure](https://www.notion.so/On-boarding-to-Borealis-Infrastructure-a43b0a9512054b52882e1d5b446f0ec6) so we can run all our stuff on the Borealis servers (instead of our own computers)
 3) Complete the tasks from last week

 ### What was done this week:
 - 

 ### Additional notes:
 -
