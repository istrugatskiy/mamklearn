class Player:
    name = ''
    questionsAnswered = 0
    questionsRight = 0
    human = -1
    score = -1

    def __int__(self, human, score):
        self.name = human.getName()
        self.score = 0
        self.questionsRight = 0
        self.questionsAnswered = 0

    def getName(self):
        return self.name

    def add(self, isCorrect):
        self.questionsAnswered += 1
        if (isCorrect):
            self.questionsRight += 1

    def getQuestionsAnswered(self):
        return self.questionsAnswered
