import json

from django.shortcuts import render, HttpResponse

from common import conn
from common.uuid_demo import sort_dict_by_key, to_digest, get_ip
# Create your views here.


def home(request):
    if request.method == 'GET':
        return render(request, '../templates/home.html')


def vh(request):
    if request.method == 'GET':
        return render(request, '../templates/view.html')


def track(request):
    if request.method == 'POST':
        # ck = request.COOKIES.get('aid', None)
        ip = get_ip(request)
        dd1 = json.loads(request.POST.get('dd', None))
        dd1['ip'] = ip
        dd2 = sort_dict_by_key(dd1)
        abs = to_digest(str(dd2))
        col = conn.conn2mongo()
        keys = conn.find(col)

        data = json.loads(request.POST.get('ud', None))
        for key in keys:
            if key['uuid'] == abs:

                key['event'].append(data['event'][0])
                # 更新数据
                res = conn.update(col, {'uuid': abs}, {'$set': key})
                print(res)

        data['uuid'] = abs
        conn.insert_one_col(col, data)
        return HttpResponse(data)
