from django.urls import path
from .views import IndexView,countyGeoJSON,AccidentsGeoJSON

urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("countyGeoJSON/", countyGeoJSON.as_view(), name="countyGeoJSON"),
    path("accidentGeoJSON/", AccidentsGeoJSON.as_view(), name="accidentsGeoJSON"),
]