import json
from pymongo import MongoClient
from bson import ObjectId
import os
from ilo import preprocess
import sys
from datetime import datetime, UTC

def preprocess_story(story, summarize=False):
    """
    Preprocess a story by tokenizing content and generating summary if needed
    
    Args:
        story: Dictionary containing story data
        summarize: Boolean to force summary generation
    
    Returns:
        Processed story dictionary
    """
    story["tokenised"] = preprocess(story["content"])
    
    if summarize or "summary" not in story or len(story.get('summary', '')) == 0:
        summary = [t['content'] for t in story["tokenised"] if t['type'] != 'markdown']
        summary = [t['name'] if isinstance(t, dict) and 'name' in t else t for t in summary]
        summary = " ".join(summary)[:100] + "..."
        story["summary"] = summary
    
    # Handle the date field - use current time if date is null or missing
    if not story.get("date"):
        story["date"] = datetime.now(UTC)
    # If it's a string, convert to datetime
    elif isinstance(story["date"], str):
        story["date"] = datetime.fromisoformat(story["date"].replace('Z', '+00:00'))
    
    return story

async def import_story(story_data, db, delete=False, summarize=False):
    # Convert single story dict to list for processing
    story = story_data[0] if isinstance(story_data, list) else story_data
    
    print("Preprocessing story")
    story = preprocess_story(story, summarize)

    # Insert single story and return the complete document
    result = await db.insert_one(story)
    inserted_story = await db.find_one({"_id": result.inserted_id})
    return inserted_story

def import_stories(stories_data, db, delete=False, summarize=False):
    if delete:
        print("Deleting existing stories")
        db.drop()

    # Preprocess all stories
    for story in stories_data:
        print("Preprocessing story")
        story = preprocess_story(story, summarize)

    # Insert all stories at once
    return db.insert_many(stories_data)

    # print(f"Imported {len(stories_data)} stories into the database.")

def import_file(file_path, delete=False, summarize=False, instance="stories"):
    db = MongoClient(os.getenv("MONGO_URI"))["stories"]
    with open(file_path, "r", encoding="utf-8") as file:
        stories_data = json.load(file)
    import_stories(stories_data, db[instance], delete=delete, summarize=summarize)

if __name__ == "__main__":
    delete = False
    if "-i" in sys.argv:
        instance = sys.argv[sys.argv.index("-i") + 1]
        sys.argv.remove("-i")
        sys.argv.remove(instance)
    if "-d" in sys.argv:
        delete = True
        sys.argv.remove("-d")
    summarize = False
    if "-s" in sys.argv:
        summarize = True
        sys.argv.remove("-s")
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        import_file(input_file, delete=delete, summarize=summarize, instance=instance)
