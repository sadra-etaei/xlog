# Generated by Django 4.1.3 on 2022-12-21 06:23

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0014_alter_post_creationdate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='creationDate',
            field=models.DateTimeField(default=datetime.datetime(2022, 12, 21, 6, 23, 3, 814572, tzinfo=datetime.timezone.utc)),
        ),
    ]
