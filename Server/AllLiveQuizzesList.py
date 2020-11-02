from MAMKLearn.LiveQuiz import LiveQuiz

class AllQuizzesList:
    quizList = {}
    def addQuiz(self,liveQuiz):
        self.quizList[liveQuiz.joinCode]=liveQuiz
