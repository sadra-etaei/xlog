# Generated by Django 4.1.3 on 2023-01-11 03:57

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('posts', '0027_alter_likedposts_userliking_alter_post_creationdate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='likedposts',
            name='userLiking',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='postsIliked', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='post',
            name='creationDate',
            field=models.DateTimeField(default=datetime.datetime(2023, 1, 11, 3, 57, 18, 647288, tzinfo=datetime.timezone.utc)),
        ),
        migrations.AlterUniqueTogether(
            name='likedposts',
            unique_together={('post', 'userLiking')},
        ),
    ]
