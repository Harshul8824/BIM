import sqlite3
import threading
import time
import logging
import random
from datetime import datetime

# -------------------- Logging Setup --------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.FileHandler("app.log"), logging.StreamHandler()]
)

# -------------------- Database Manager --------------------
class DatabaseManager:
    def __init__(self, db_name="app.db"):
        self.db_name = db_name
        self.conn = sqlite3.connect(self.db_name, check_same_thread=False)
        self.cursor = self.conn.cursor()
        self._create_table()

    def _create_table(self):
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                age INTEGER,
                created_at TEXT
            )
        """)
        self.conn.commit()

    def add_user(self, name, age):
        self.cursor.execute(
            "INSERT INTO users (name, age, created_at) VALUES (?, ?, ?)",
            (name, age, datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        )
        self.conn.commit()
        logging.info(f"Added user: {name}, Age: {age}")

    def get_users(self):
        self.cursor.execute("SELECT * FROM users")
        return self.cursor.fetchall()


# -------------------- Mock API --------------------
class MockAPI:
    @staticmethod
    def fetch_random_user():
        names = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"]
        return {
            "name": random.choice(names),
            "age": random.randint(18, 50)
        }


# -------------------- Worker Thread --------------------
class UserFetcher(threading.Thread):
    def __init__(self, db, interval=2):
        super().__init__()
        self.db = db
        self.interval = interval
        self.running = True

    def run(self):
        while self.running:
            user = MockAPI.fetch_random_user()
            self.db.add_user(user["name"], user["age"])
            time.sleep(self.interval)

    def stop(self):
        self.running = False


# -------------------- Main App --------------------
class Application:
    def __init__(self):
        self.db = DatabaseManager()
        self.worker = UserFetcher(self.db)

    def start(self):
        logging.info("Starting application...")
        self.worker.start()

    def stop(self):
        logging.info("Stopping application...")
        self.worker.stop()
        self.worker.join()
        logging.info("Application stopped.")

    def show_users(self):
        users = self.db.get_users()
        for user in users:
            print(user)


# -------------------- Run --------------------
if __name__ == "__main__":
    app = Application()
    try:
        app.start()
        time.sleep(10)  # Run for 10 seconds
    finally:
        app.stop()
        app.show_users()
