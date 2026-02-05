from django.urls import path
from .views import InstagramConnectView, InstagramCallbackView

urlpatterns = [
    path('instagram/connect/', InstagramConnectView.as_view(), name='instagram-connect'),
    path('instagram/callback/', InstagramCallbackView.as_view(), name='instagram-callback'),
]
