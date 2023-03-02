from django.contrib import admin
from posts.models import Post, likedPost, savedPost

# Register your models here.
admin.site.register(Post)
admin.site.register(likedPost)
admin.site.register(savedPost)

