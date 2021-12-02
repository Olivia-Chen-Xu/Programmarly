import torch
from torch.nn.modules.sparse import Embedding
from codegen_sources.model.src.data.dictionary import Dictionary
from codegen_sources.preprocessing.lang_processors.lang_processor import LangProcessor
from codegen_sources.preprocessing.bpe_modes.bpe_mode import BPEMode
from codegen_sources.model.src.utils import TREE_SITTER_ROOT
from codegen_sources.model.translate import Translator

SUPPORTED_LANGUAGES = ["cpp", "java", "python"]
MODELPATH = 'translator_transcoder_size_from_DOBF.pth'
BPEPATH = 'data/bpe/cpp-java-python/codes'

translator = Translator(MODELPATH, BPEPATH)

torch.save((translator.dico, translator.bpe_model), 'metadata.pth')
torch.save(translator.encoder.embeddings.cpu(), 'embeddings.pth')

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

if __name__ == '__main__':
    dico, bpe_model = torch.load('metadata.pth')
    embeddings = torch.load('embeddings.pth')

    lookup_python = LookUp(
        dico=dico, embeddings=embeddings, 
        language='python', bpe_model=bpe_model
    )
    
    lookup_java = LookUp(
        dico=dico, embeddings=embeddings, 
        language='java', bpe_model=bpe_model
    )
    python_keywords = ['await', 'else', 'for', 'if', 'lambda',
                'yield', 'True', 'False', 'None', 'assert', 'async', 'await', 'break', 'continue', 'del', 'elif',
                'else', 'except', 'finally', 'for', 'global', 'if',
                'pass', 'raise', 'return', 'try', 'while', 'yield',
                 'as', 'with', 'import', 'abs', 'all', 'any', 'bin', 'bool', 'bytearray',
                'bytes', 'chr', 'classmethod', 'compile', 'complex',
                'dict', 'dir', 'divmod', 'enumerate', 'eval', 'filter',
                'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr',
                'hash', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass',
                'iter', 'len', 'list', 'locals', 'map', 'max', 'memoryview',
                'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print',
                'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr',
                'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple',
                'type', 'vars', 'zip', 'self']

    java_keywords = ['abstract','const','continue','for','switch','try','finally','super','instanceof','enum','extends','final','implements','native','private','protected','public','static','super','synchronized','throws','transient','volatile','boolean','byte','char','double','float','int','long','short','void','package','true','false','null','class','interface', 'import','String', 'do','static','else', 'this']

    cos = torch.nn.CosineSimilarity(dim=0, eps=1e-6)

    for k in python_keywords:
        print(k, "  ", lookup_python[k])

    print('\n')

    for k in java_keywords:
        print(k, "  ", lookup_java[k])
    
    pairs=[]
    for k1 in java_keywords:
        sim=[]
        for k2 in python_keywords:
            sim.append(abs(cos(lookup_java[k1], lookup_python[k2]).item()))
        max_dis = max(sim)
        print('Java: ', k1, '       Python: ', python_keywords[sim.index(max_dis)], '       Cosine Similarity: ', max_dis )
        pairs.append({'java':k1, 'python':python_keywords[sim.index(max_dis)]  })
    print(pairs)


    