from .views import GetRoom, RoomView, CreateRoomView
from django.urls import path

urlpatterns = [
    path('rooms', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view())
]
