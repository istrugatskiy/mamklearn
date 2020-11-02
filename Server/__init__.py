from flask import Flask, request, render_template

from MAMKLearn.AllLiveQuizzesList import AllQuizzesList
from MAMKLearn.AllPlayerList import AllPlayerList
from MAMKLearn.Profile import PlayerProfile

playerList = AllPlayerList()
quizList = AllQuizzesList()
app = Flask(__name__)
app.debug = True


@app.route("/", methods=['GET', 'editProfile','loginVerify','joinQuiz'])
def index():
    if request.method == "editProfile":
        try:
            username = getUserName(request)

            hair = request.form["hair"]
            pants = request.form["pants"]
            eyes = request.form["eyes"]
            shirt = request.form["shirt"]
            mouth = request.form["mouth"]

            playerList.playerList[username].avatar = PlayerProfile(hair, pants, eyes, shirt, mouth)
            return "{ \"code\": 1}"
        except:
            return "{ \"code\": 0}"
    if request.method == "loginVerify":
        try:
            username = getUserName(request)
            player = playerList.playerList.get(username)
            if(player is not None):
                avatar = player.avatar
                return f"{{ \"code\": 2, \"UserName\": {username}, \"hair\": {avatar.hair}, \"eyes\": {avatar.eyes}, \"mouth\": {avatar.mouth}, \"shirt\": {avatar.shirt}, \"pants\": {avatar.pants}, \"inMatch\": false }}"
            else:
                return "{ \"code\": 1, \"UserName\": 0, \"hair\": 0, \"eyes\": 0, \"mouth\": 0, \"shirt\": 0, \"pants\": 0, \"inMatch\": false }"
        except:
            return "{ \"code\": 0, \"UserName\": null, \"hair\": null, \"eyes\": null, \"mouth\": null, \"shirt\": null, \"pants\": null, \"inMatch\": null }"
    if request.method == "joinQuiz":
        try:
            username = getUserName(request)
            quizId = request.insertNameOfRequestHere["quizID"]
            quiz = quizList.quizList.get(quizId)
            if quiz is not None:
                quiz.join(username, quizId)
                #you did not explain at all how this would work so I left wss connect as null
                return "{ \"code\": 0, \"error\": \"null\", \"wssConnect\": null}"
            else:
                return "{ \"code\": 1, \"error\": \"The quiz ID is invalid\", \"wssConnect\": null}"
        except:
            return "{ \"code\": 0, \"error\": \"A communication error occurred\", \"wssConnect\": null}"


def getUserName(request):
    # TODO implement the method which gets the username from the token
    pass


if __name__ == "__main__":
    app.run()
