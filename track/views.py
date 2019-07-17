from django.shortcuts import render, HttpResponse

# Create your views here.


def home(request):
    if request.method == 'GET':
        return render(request, '../templates/home.html')


def vh(request):
    if request.method == 'GET':
        return render(request, '../templates/view.html')


def track(request):
    if request.method == 'POST':
        if request.POST.get('event', None):
            pass
        if request.POST.get('user', None):
            pass
        if request.POST.get('page', None):
            pass
        print(request.POST)
        return HttpResponse('ABCD')
    if request.method == 'GET':
        pass
