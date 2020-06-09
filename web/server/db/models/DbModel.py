
class DbModel():
    def __init__(self, db):
        print("Db model constructor")
        self.cursor = db.get_cursor()

    
    def serialize(self):
        pass