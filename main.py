import time
import threading
import json
import redis
import Adafruit_BMP.BMP085 as BMP085
from bottle import Bottle, run, response, static_file, redirect

app = Bottle()
sensor = BMP085.BMP085()
r = redis.StrictRedis(host='127.0.0.1', port=6379, db=1, password='xxxxxx')


def bmp085_task():
    while True:
        '''
        save temprature data to redis every 5 minutes
        '''
        timestamp, temp = int(time.time()), sensor.read_temperature()
        pipe = r.pipeline()
        # sex expire time to 1 day puls 5 minutes
        pipe.setex(timestamp, 86400 + 300, temp)
        pipe.lpush("temp_history", timestamp)
        # drop old data
        pipe.ltrim("temp_history", 0, 287)
        pipe.execute()
        time.sleep(300)


@app.get('/api/temp')
def temp_list():
    '''
    return history temperature data in the past 24 hours
    '''
    response.content_type = 'application/json'
    timestamps = r.lrange("temp_history", 0, -1)
    tempdata = r.mget(timestamps)
    return json.dumps(zip(timestamps, tempdata)[::-1], indent=2)


@app.route('/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./')


@app.route('/')
def index():
    redirect('./index.html')

if __name__ == '__main__':
    threading.Thread(target=bmp085_task, name="bmp085_task").start()
    run(app, host='0.0.0.0', port=8080)
