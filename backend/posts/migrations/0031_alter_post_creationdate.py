# Generated by Django 4.1.3 on 2023-01-14 04:23

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0030_rename_likedposts_likedpost_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='creationDate',
            field=models.DateTimeField(default=datetime.datetime(2023, 1, 14, 4, 23, 24, 326779, tzinfo=datetime.timezone.utc)),
        ),
    ]