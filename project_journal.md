# Meeting notes and project log 

<details>
<summary> Meeting #3 - Oct. 20th </summary>
<br>

## Discussion items : 
- **Olivia contacted Baptiste**, one of the authors of the Facebook AI paper. He replied : "[...] it may be difficult to reliably find errors in sentences in code (or natural languages) without any supervised data. You may try to use a language model to evaluate the log-likelihood of the code and flag unlikely snippets or try to generate some supervised data automatically [...] You could also learn to reproduce the output of a linter or compiler but you probably wouldn’t manage to do better than the rule-based method you used to create data. [...] we actually didn’t scrap the data from github ourselves, we got it from google BigQuery. They already collected most files from github public repositories and put them in a database you can query with SQL. [...] you may find the rest of the repo useful to preprocess the data or to train a model if you’re planning on using a transformer architecture. You can also use the pile dataset, which contains a lot of source code."
 
 ## To-do list:
 1) To-do
 2) To-do
</details>

<details>
<summary> Meeting #4 - Oct. 27th </summary>
<br>

## Discussion items : 
- **Facebook AI wrote a [paper](https://ai.facebook.com/blog/deep-learning-to-translate-between-programming-languages/)** on a code translator they created ([repo](https://github.com/facebookresearch/TransCoder)). To get their data, they [used GitHub and Google Big Query](https://github.com/facebookresearch/CodeGen/blob/main/docs/googlebigquery.md). In the visual representation showed in the paper, if things are "semantically similar", they are grouped close together. We can download and use their model since it is open-source.
 
 ## To-do list:
 1) Download the Facebook models from GitHub and run some test data on them 
 2) Go through the [TransCode/data folder](https://github.com/facebookresearch/TransCoder/tree/main/data) to pick out the data we will use (we are going to use their *evaluation* data as our *training* data since we are doing a smaller project)

 3) Run pygment extraction (= syntax highlighting script) on all of the code to get the html version and relevant attributes 
 4) Run BeautifulSoup on the html output by pygments to get labels (this defines **Y**)

 5) Use models to learn representations for the words in the github code
 6) Collect representations, and add additional data (ex: categorical variables to describe the source language) to build the training inputs (this defines **X**)

 7) Begin benchmarking models to map X to Y
 8) For testing, we will need bad code samples

 ## What was done this week:
 - Olivia wrote the web scraper to extract our Y labels from the pygments html output
</details>

<details>
<summary> Meeting #5 - Nov. 3rd </summary>
<br>

## Discussion items : 
- We need a list of attributes/keywords for each language
- We might make this a VSCode plugin (or not, we will see later)
- The main goal is we will have some kind of matrix/map/list that shows how each keyword maps to another keyword in every language, so the matrix would be size=n*n (for n languages)
- This is the first step, a very simple correction algorithm that only corrects keywords
- The next step IF this straightforward translation isnt good enough (for example going from a modern language to a primitive language you might need to change what's "inside" of a keyword and not just the keyword itself), we need to find another kind of model/algorithm 
 
 ## To-do list:
 1) Install [mini conda](https://docs.conda.io/en/latest/miniconda.html) 
 2) Figure out how to use the [Borealis infrastructure](https://www.notion.so/On-boarding-to-Borealis-Infrastructure-a43b0a9512054b52882e1d5b446f0ec6) so we can run all our stuff on the Borealis servers (instead of our own computers)
 3) Complete the tasks from last week
 4) We might want to use [github boards](https://docs.github.com/en/issues/organizing-your-work-with-project-boards/managing-project-boards/about-project-boards) to organize our project

 ## What was done this week:
 - Olivia, Nadia, Maisha : tried and failed to run the FB model :) waited for mentor's help

 ## Additional notes:
 - **How to test the CodeGen model:** download the entire [CodeGen](https://github.com/facebookresearch/CodeGen) repository, download [Anaconda](https://www.anaconda.com/products/individual#Downloads), launch the *Anaconda Prompt* terminal (NOT the regular terminal cmd.exe that is on your computer by default), run `cd C:\insert_path_to_the_installenv_file` to navigate to the correct directory on your machine, then run the command `install_env.sh` to install necessary packages and dependencies. When prompted, enter `y` to continue installing. And then we get errors ! Clearer instructions coming soon.
</details>

<details>
<summary> Meeting #6 - Nov. 10th </summary>
<br>

## Discussion items : 
- CodeGen scripts are buggy/deprecated/basically not working, so we might have to scrap it and build our own model from scratch.
- We can use the help documentation of programming languages, which gives a description of what each function does, and then the model would find functions that have similar descriptions.
- Giuseppe gave a quick overview of word embedding and NLP. Nice video about it [here](https://www.youtube.com/watch?v=oUpuABKoElw).
- Libraries to do word embedding : the industry standard is **Gensim**, combined with **Spacy**, another example of a word embedding algorithm is **Word2vec** (does a bunch of additional optimizations). 
- Giuseppe will try to get the CodeGen working tonight, and if it doesn't work he will send us further instructions + tutorials on the above libraries.

 ## To-do list:
 1) We need to obtain a dataset of built-in functions for each language + their description. If we can't find available online, we can build it using a web scraper on the online documentation for each language (ex: [Python](https://docs.python.org/3/library/functions.html)). **What should this dataset look like?**  
 2) We can then use Word2Vec on it.
 
 ## What was done this week:
 - Nadia : looked into Gensim + Word2Vec, followed a tutorial, and added new tasks.  

 ## Additional notes:
 - 
 </details>