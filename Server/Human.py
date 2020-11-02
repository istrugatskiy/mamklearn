class Human:
    quizList = {}
    name = ''
    token = ''
    avatar = -1

    def __int__(self,token, avatar, name):
        self.quizList = {}
        self.token = token
        self.name = name
        self.avatar = avatar

    def changeLook(self, avatar):
        self.avatar = avatar

    def addQuiz(self, name, quiz):
        self.quizList[name] = quiz

    def deleteQuiz(self, name):
        del self.quizList[name]

    def getName(self):
        return self.name
