import psycopg2

class Database:

    def __init__(self, database_uri):
        self.connection = psycopg2.connect(database_uri)
        self.cursor = self.connection.cursor()
        print("Connected to database")

    def get_cursor(self):
        return self.cursor

    def __del__(self):
        self.cursor.close()
        self.connection.close()
