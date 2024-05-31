from typing import Any
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View, TemplateView
from django.core.serializers import serialize
from .models import County, Accident

class IndexView(TemplateView):
    template_name = "accidents/index.html"

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        # return super().get_context_data(**kwargs)
        return kwargs
    
class countyGeoJSON(View):
    def get(self, reqeust):
        geojson = serialize('geojson', County.objects.all(), geometry_field="geom", fields=('name',))
        return HttpResponse(geojson)
    
class AccidentsGeoJSON(View):
    def get(self, request):
        # get counry from county name in request
        county = County.objects.filter(name=request.GET.get('county')).first()
        # if no geom fields exist, create them from accident
        no_accidents_exists = Accident.objects.filter(geom__isnull=False).exists()
        if no_accidents_exists:
            Accident.objects.raw('UPDATE accidents.accident SET geom=ST_GeomFromText(\'POINT(\' || location_easting_osgr || \' \' || location_northing_osgr || \')\',27700);')
        geojson = {}
        if county:
            geojson = serialize('geojson', Accident.objects.filter(geom__within=county.geom),
                                geometry_field='geom',
                                fields=('accident_index','accident_severity','number_of_vehicles','number_of_casualties'))
        return HttpResponse(geojson)

# class AccidentsStatistics(View):
#     def get(self,request):
#         """
#         Retrieve accidents statistics based on a selected county.
#         """
#         # get counry from county name in request
#         county = County.objects.filter(name=request.GET.get('county')).first()
#         if county:
#             geojson = serialize('geojson', Accident.objects.filter)