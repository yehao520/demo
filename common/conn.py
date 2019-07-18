import pymongo

HOST = 'localhost'
PORT = 27017
DB = 'test'
COL = 'data_layer'


def conn2mongo(col=COL):
    """连接数据库"""
    client = pymongo.MongoClient(HOST, PORT)
    db = client[DB]
    col = db[col]
    return col


def insert_one_col(col, data):
    col.insert_one(data)


def insert_many_cols(col, data):
    col.insert_many(data)


def find(col):
    return col.find({})


def update(col, condition, content):
    return col.update_one(condition, content)
