from django.urls import path

from track import views

urlpatterns = [
    path('home/', views.home),
    path('track/', views.track),
    path('vh/', views.vh),
]
