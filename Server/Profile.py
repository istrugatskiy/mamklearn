class PlayerProfile:
    hair = ''
    pants = ''
    eyes = ''
    shirt = ''
    mouth = ''

    def __int__(self, hair, pants, eyes, shirt, mouth):
        self.hair = self.validateNumber(hair)
        self.eyes = self.validateNumber(eyes)
        self.mouth = self.validateNumber(mouth)
        self.pants = self.validateNumber(pants)
        self.shirt = self.validateNumber(shirt)

    def validateNumber(self, profile_attribute):
        # TODO write function which ensures that profile inputs are valid number
        return profile_attribute

    def getProfile(self):
        return {'hair': self.hair, 'eyes': self.eyes, 'mouth': self.mouth, 'shirt': self.shirt, 'pants': self.pants}
