import json
from pymongo import MongoClient
from bson import ObjectId
import os
from ilo import preprocess

# Connect to MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
print(os.getenv("MONGO_URI"))
db = client["stories"]

# Drop existing collections
db.stories.drop()

# Load data from stories.json
with open("../content/nanpa-jan/stories_tenpo.json", "r", encoding="utf-8") as file:
    stories_data = json.load(file)

# Insert data into MongoDB
for story in stories_data:
    print("Preprocessing story")
    # Convert date string to datetime object
    # story["date"] = datetime.fromisoformat(story["date"])

    # Add _id field with ObjectId
    story["_id"] = ObjectId()
    story["tokenised"] = preprocess(story["content"])

# Insert all stories at once
db.stories.insert_many(stories_data)

print(f"Imported {len(stories_data)} stories into the database.")
