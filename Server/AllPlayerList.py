import pickle


class AllPlayerList:
    playerList = {}

    def __init__(self):
        try:
            self.loadPlayerList()
        except:
            pass

    def loadPlayerList(self):
        with open('filename.pickle', 'rb') as handle:
            self.playerList = pickle.load(handle)

    def savePlayerList(self):
        with open('filename.pickle', 'wb') as handle:
            pickle.dump(self.playerList, handle, protocol=pickle.HIGHEST_PROTOCOL)
