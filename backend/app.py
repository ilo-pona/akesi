from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGO_URI", "mongodb://localhost:27019"))
db = client.stories
stories_collection = db.stories


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")


class Story(BaseModel):
    id: str
    title: str
    summary: str
    content: str
    imageUrl: str
    date: str
    originalLink: str

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}


@app.get("/")
async def root():
    return {"message": "See /stories for all stories"}


@app.get("/stories", response_model=List[Story])
async def get_stories():
    stories = await stories_collection.find().to_list(10)
    return [Story(id=str(story["_id"]), **{k: v for k, v in story.items() if k != "_id"}) for story in stories]


@app.get("/stories/{story_id}", response_model=Story)
async def get_story(story_id: str):
    story = await stories_collection.find_one({"_id": ObjectId(story_id)})
    if story:
        return Story(id=str(story["_id"]), **{k: v for k, v in story.items() if k != "_id"})
    raise HTTPException(status_code=404, detail="Story not found")


@app.post("/stories", response_model=Story)
async def create_story(story: Story):
    story_dict = story.dict(exclude={"id"})
    new_story = await stories_collection.insert_one(story_dict)
    created_story = await stories_collection.find_one({"_id": new_story.inserted_id})
    return Story(id=str(created_story["_id"]), **{k: v for k, v in created_story.items() if k != "_id"})


@app.put("/stories/{story_id}", response_model=Story)
async def update_story(story_id: str, story: Story):
    updated_story = await stories_collection.find_one_and_update(
        {"_id": ObjectId(story_id)},
        {"$set": story.dict(exclude={"id"}, exclude_unset=True)},
        return_document=True,
    )
    if updated_story:
        return Story(id=str(updated_story["_id"]), **{k: v for k, v in updated_story.items() if k != "_id"})
    raise HTTPException(status_code=404, detail="Story not found")


@app.delete("/stories/{story_id}")
async def delete_story(story_id: str):
    delete_result = await stories_collection.delete_one({"_id": ObjectId(story_id)})
    if delete_result.deleted_count == 1:
        return {"message": "Story deleted successfully"}
    raise HTTPException(status_code=404, detail="Story not found")
