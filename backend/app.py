from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from pydantic import BaseModel
from typing import List
import os
import uuid
from ilo import preprocess
from importing import import_story

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

# Add these constants at the top of the file, after the imports
IMAGE_UPLOAD_DIR = os.getenv("IMAGE_UPLOAD_DIR", "./images")
os.makedirs(IMAGE_UPLOAD_DIR, exist_ok=True)


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


class TokiName(BaseModel):
    name: str
    toki_name: str | None = None


class TokenizedText(BaseModel):
    type: str
    content: str | TokiName

class Story(BaseModel):
    id: str
    title: str
    summary: str
    content: str
    imageUrl: str
    author: str
    date: str
    originalLink: str
    tokenised: List[TokenizedText]

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}



app.get("/")
async def root():
    return {"message": "See /stories for all stories"}


@app.get("/stories", response_model=List[Story])
async def get_stories(
    skip: int = Query(0, ge=0, description="Number of stories to skip"),
    limit: int = Query(100, ge=1, le=100, description="Number of stories to return"),
):
    stories = await stories_collection.find().skip(skip).limit(limit).to_list(limit)
    return [
        Story(id=str(story["_id"]), **{k: v for k, v in story.items() if k != "_id"})
        for story in stories
    ]


@app.get("/stories/{story_id}", response_model=Story)
async def get_story(story_id: str):
    story = await stories_collection.find_one({"_id": ObjectId(story_id)})
    if story:
        return Story(
            id=str(story["_id"]), **{k: v for k, v in story.items() if k != "_id"}
        )
    raise HTTPException(status_code=404, detail="Story not found")


@app.post("/stories/tokenise", response_model=Story)
async def tokenise_story(story: Story):
    story_dict = story.dict(exclude={"id"})
    story_dict["tokenised"] = preprocess(story_dict["content"])
    new_story = await stories_collection.insert_one(story_dict)
    created_story = await stories_collection.find_one({"_id": new_story.inserted_id})
    return Story(
        id=str(created_story["_id"]),
        **{k: v for k, v in created_story.items() if k != "_id"},
    )


@app.post("/stories", response_model=Story)
async def create_story(story: Story):
    story_dict = story.dict(exclude={"id"})
    created_story = await import_story([story_dict], stories_collection, summarize=True), 

    # new_story = await stories_collection.insert_one(story_dict)
    # created_story = await stories_collection.find_one({"_id": new_story.inserted_id})
    return Story(
        id=str(created_story["_id"]),
        **{k: v for k, v in created_story.items() if k != "_id"},
    )


@app.put("/stories/{story_id}", response_model=Story)
async def update_story(story_id: str, story: Story):
    updated_story = await stories_collection.find_one_and_update(
        {"_id": ObjectId(story_id)},
        {"$set": story.dict(exclude={"id"}, exclude_unset=True)},
        return_document=True,
    )
    if updated_story:
        return Story(
            id=str(updated_story["_id"]),
            **{k: v for k, v in updated_story.items() if k != "_id"},
        )
    raise HTTPException(status_code=404, detail="Story not found")


@app.delete("/stories/{story_id}")
async def delete_story(story_id: str):
    delete_result = await stories_collection.delete_one({"_id": ObjectId(story_id)})
    if delete_result.deleted_count == 1:
        return {"message": "Story deleted successfully"}
    raise HTTPException(status_code=404, detail="Story not found")


@app.put("/images", response_model=dict)
async def upload_image(file: UploadFile = File(...)):
    file_extension = os.path.splitext(file.filename)[1]
    new_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(IMAGE_UPLOAD_DIR, new_filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {"image_id": new_filename}


@app.get("/images/{image_id}")
async def get_image(image_id: str):
    file_path = os.path.join(IMAGE_UPLOAD_DIR, image_id)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Image not found")
