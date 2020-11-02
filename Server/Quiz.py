class quiz:
    questions=[]
    owner=''
    name=''
    def __int__(self,owner,name, questions):
        self.owner=owner
        self.name=name
        self.questions=questions
    def get(self, index):
        return self.questions[index]