from django.contrib import admin
from accounts.models import Profile, followedUser

# Register your models here.

admin.site.register(Profile)
admin.site.register(followedUser)

