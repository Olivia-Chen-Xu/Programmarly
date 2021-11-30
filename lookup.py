import torch
​
from torch.nn.modules.sparse import Embedding
from codegen_sources.model.src.data.dictionary import Dictionary
from codegen_sources.preprocessing.lang_processors.lang_processor import LangProcessor
from codegen_sources.preprocessing.bpe_modes.bpe_mode import BPEMode
​
from codegen_sources.model.src.utils import TREE_SITTER_ROOT
​
SUPPORTED_LANGUAGES = ["cpp", "java", "python"]
​
class LookUp():
    def __init__(self, 
            dico : Dictionary , 
            embeddings : Embedding, 
            language : str, 
            bpe_model : BPEMode
        ):
        super().__init__()
        
        self.dico = dico
        self.embeddings = embeddings
        
        assert language in SUPPORTED_LANGUAGES
        
        processor = LangProcessor.processors[language](
            root_folder=TREE_SITTER_ROOT
        )
        self.tokenizer = processor.tokenize_code
        
        self.bpe_model = bpe_model
        
    def tokenize(self, code_string : str):
        tokens = [t for t in self.tokenizer(code_string)]
        return self.bpe_model.apply_bpe(" ".join(tokens)).split()
        
    def code2embeddings(self, code_string : str):
        """
        code string has n terms
        embeddings have size d
        output will be a tensor of size [n, d]
        """
        tokens = self.tokenize(code_string)
        idxs = torch.LongTensor([self.dico.index(w) for w in tokens])
        return self.embeddings(idxs).data
    
    def __getitem__(self, word : str):
        """
        given a string, output the corresponding embedding
        if it exists in the dictionary
        """
        try:
            index = self.dico.word2id[word]
        except KeyError:
            raise ValueError(f'{word} is not a valid keyword')
            
        return self.embeddings(torch.LongTensor([index])).squeeze().data
​
​
​
if __name__ == '__main__':
    language = 'python'
    dico, bpe_model = torch.load('metadata.pth')
    embeddings = torch.load('embeddings.pth')
​
    test_code = "def add2(x): return x + 2"
​
    lookup = LookUp(
        dico=dico, embeddings=embeddings, 
        language=language, bpe_model=bpe_model
    )
​
    print(lookup.code2embeddings(test_code))
​
    print('def')
    print(lookup['def'])
​
    print('static')
    print(lookup['static'])