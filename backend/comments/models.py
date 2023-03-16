from django.db import models
from django.contrib.auth import get_user_model
from posts.models import Post
from django.utils import timezone
# Create your models here.

class Comment(models.Model):
    user = models.ForeignKey(get_user_model(),on_delete=models.CASCADE, related_name="user_comments")
    text = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    writtenDate = models.DateTimeField()

    def __str__(self) :
        return self.user.username