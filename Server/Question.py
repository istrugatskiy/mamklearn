import random


class Question:
    question = ''
    questionAns = ''
    wrongResponce1 = ''
    wrongResponce2 = ''
    wrongResponce3 = ''
    isMultChoice = False

    def __int__(self, question, questionAns, wrongResponce1, wrongResponce2, wrongResponce3):
        self.isMultChoice = True
        self.question = question
        self.questionAns = questionAns
        self.wrongResponce1 = wrongResponce1
        self.wrongResponce2 = wrongResponce2
        self.wrongResponce3 = wrongResponce3

    def __int__(self, question, questionAns):
        self.isMultChoice = False
        self.questionAns = questionAns
        self.question = question

    def isCorrect(self, answer):
        if (answer == self.questionAns):
            return True
        return False

    def display(self):
        if (self.isMultChoice):
            return
        return random.shuffle([])

    def getAnswer(self):
        return self.questionAns

    def getQuestion(self):
        return self.question
