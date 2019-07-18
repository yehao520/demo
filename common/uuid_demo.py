from hashlib import md5


def get_ip(request):
    if 'HTTP_X_FORWARDED_FOR' in request.META:
        ip = request.META.get('HTTP_X_FORWARDED_FOR', None)
    else:
        ip = request.META.get('REMOTE_ADDR', None)
    return ip



def sort_dict_by_key(dic):
    """字典排序a-z"""
    dic = sorted(dic.items(), key=lambda x: x[0], reverse=False)
    return dic


def to_digest(dic):
    """获取md5摘要"""
    if isinstance(dic, dict):
        dic = str(dic)
    if isinstance(dic, str):
        dic = dic.encode("utf-8")
    m = md5().copy()
    m.update(dic)
    return m.hexdigest()


if __name__ == "__main__":
    parameter = {
        "ip": "192.168.1.1",
        "browserName": "Chrome",
        "broserVersion": "73.0.3683.86",
        "resolution": "1440*900"  # 通过screen.width + '*' + screen.height得到
    }
    p = str(sort_dict_by_key(parameter))
    print(p)
    print(to_digest(p))
