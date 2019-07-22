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
        dt = json.loads(request.POST.get('dt', None))
        dd = dt['dd']
        dd['ip'] = ip
        sorted_dd = sort_dict_by_key(dd)
        abs = to_digest(str(sorted_dd))
        col = conn.conn2mongo()
        keys = conn.find(col)

        data = dt['ud']
        update = 0
        for key in keys:
            if key['uuid'] == abs:
                key['event'].append(data['event'][0])
                _id = key.pop('_id')
                # 更新数据
                res = conn.update(col, {'uuid': abs}, {'$set': key})
                update = 1
                print(res)
        if not update:
            data['uuid'] = abs
            conn.insert_one_col(col, data)
        return HttpResponse(data)
