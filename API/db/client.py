### MongoDB client ###

from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# local DB MongoDB
#db_client = MongoClient().local

# Remote MongoDB Atlas (https://mongodb.com)
db_client = MongoClient(os.getenv("DATABASE_URL"))#.algo // but i think that is enought with this
