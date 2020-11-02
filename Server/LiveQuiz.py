import random
from datetime import time


class LiveQuiz:
    quiz = -1
    joinCode = -1
    personList = {}
    gameMaster = ''
    start = False

    def __int__(self, quiz, gameMaster, joinCode):
        self.joinCode = int(time.time() * random(200))
        self.gameMaster = gameMaster
        self.quiz = quiz
        self.start = False

    def join(self, person, code):
        if (code == self.joinCode):
            self.personList[person.getName] = (person)

    def kick(self, personKicked, admin):
        if (self.gameMaster == admin):
            del self.personList[personKicked]

    def start(self):
        self.start = True

    def answerQuestion(self, name, answer):
        if self.start:
            person = self.personList[name]
            if answer == self.quiz.getAns(person.getQuestionsAnswered()):
                person.add(True)
        person.add(False)
