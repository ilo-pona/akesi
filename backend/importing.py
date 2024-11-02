import json
from pymongo import MongoClient
from bson import ObjectId
import os
from ilo import preprocess
import sys

def import_file(file_path, delete=False, summarize=False):
    # Load data from stories.json
    with open(file_path, "r", encoding="utf-8") as file:
        stories_data = json.load(file)
    client = MongoClient(os.getenv("MONGO_URI"))
    print(os.getenv("MONGO_URI"))
    db = client["stories"]
    import_stories(stories_data, db, delete=delete, summarize=summarize)

async def import_story(story_data, db, delete=False, summarize=False):
    import_stories([story_data], db, delete=delete, summarize=summarize)

def import_stories(stories_data, db, delete=False, summarize=False):
    # Connect to MongoDB

    if delete:
        print("Deleting existing stories")
        db.stories.drop()

    # Insert data into MongoDB
    for story in stories_data:
        print("Preprocessing story")
        # Convert date string to datetime object
        # story["date"] = datetime.fromisoformat(story["date"])

        # Add _id field with ObjectId
        story["_id"] = ObjectId()
        story["tokenised"] = preprocess(story["content"])
        if summarize or "summary" not in story or len(story['summary']) == 0:
            summary = [t['content'] for t in story["tokenised"] if t['type'] != 'markdown']
            summary = [t['name'] if isinstance(t, dict) and 'name' in t else t for t in summary]
            summary = " ".join(summary)[:100] + "..."
            story["summary"] = summary

    # Insert all stories at once
    return db.stories.insert_many(stories_data)

    # print(f"Imported {len(stories_data)} stories into the database.")

if __name__ == "__main__":
    delete = False
    if "-d" in sys.argv:
        delete = True
        sys.argv.remove("-d")
    summarize = False
    if "-s" in sys.argv:
        summarize = True
        sys.argv.remove("-s")
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        import_file(input_file, delete=delete, summarize=summarize)
