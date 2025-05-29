from threading import Thread
from database import db, get_all_books
from model import train_model

def watch_new_books():
    print("📡 Watching for new book inserts...")
    with db["books"].watch([{"$match": {"operationType": "insert"}}]) as stream:
        for change in stream:
            print("📘 New book inserted. Retraining...")
            books = get_all_books()
            train_model(books)

def start_watcher():
    Thread(target=watch_new_books, daemon=True).start()
