# Generated by Django 4.1.3 on 2023-01-17 06:30

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0006_followeduser'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='followeduser',
            unique_together={('userFollowing', 'userFollowed')},
        ),
    ]
