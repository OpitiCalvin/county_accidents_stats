# Generated by Django 5.0.6 on 2024-05-31 09:21

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Accident',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accident_index', models.CharField(max_length=20)),
                ('location_easting_osgr', models.IntegerField()),
                ('location_northing_osgr', models.IntegerField()),
                ('longitude', models.FloatField()),
                ('latitude', models.FloatField()),
                ('police_force', models.IntegerField()),
                ('accident_severity', models.IntegerField()),
                ('number_of_vehicles', models.IntegerField()),
                ('number_of_casualties', models.IntegerField()),
                ('date', models.DateField()),
                ('day_of_week', models.IntegerField()),
                ('time', models.TimeField()),
                ('geom', django.contrib.gis.db.models.fields.PointField(null=True, srid=27700)),
            ],
        ),
        migrations.CreateModel(
            name='County',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60)),
                ('area_code', models.CharField(max_length=3)),
                ('description', models.CharField(max_length=50)),
                ('file_name', models.CharField(max_length=50)),
                ('number', models.FloatField()),
                ('number0', models.FloatField()),
                ('polygon_id', models.IntegerField()),
                ('unit_id', models.IntegerField()),
                ('code', models.CharField(max_length=9)),
                ('hectares', models.FloatField()),
                ('area', models.FloatField()),
                ('type_code', models.CharField(max_length=2)),
                ('description0', models.CharField(max_length=25)),
                ('type_code0', models.CharField(max_length=3, null=True)),
                ('description1', models.CharField(max_length=25, null=True)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=27700)),
            ],
        ),
    ]
