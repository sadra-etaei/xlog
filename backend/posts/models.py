from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from accounts.models import Profile


# Create your models here.
User = get_user_model()
class Post(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, null=True)
    author = models.ForeignKey(get_user_model(), related_name="posts", on_delete=models.CASCADE, unique=False)
    title = models.CharField(max_length=500, unique=True)
    text = models.TextField(blank=True)
    creationDate = models.DateTimeField(default=timezone.now())
    publicationDate = models.DateTimeField(blank=True, null=True)
    publicationShortDate = models.CharField(blank=True, null=True, max_length=100)

    class Meta:
        unique_together = ('author','title')

    def publish(self):
        self.publicationDate = timezone.now()
        self.publicationShortDate = f"{timezone.now().strftime('%b')} {timezone.now().strftime('%d')}"
        self.save()

    def update(self, title, text):
        self.title = title
        self.text = text
        self.save()

    def __str__(self):
        return self.title


class likedPost(models.Model):
    userLiking = models.ForeignKey(get_user_model(), related_name="postsIliked", on_delete=models.CASCADE)
    userLiked = models.ForeignKey(get_user_model(), related_name="poststheyliked", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="likes", on_delete=models.CASCADE)

    class Meta:
        unique_together = ('post', 'userLiking')

    def __str__(self):
        return str(self.userLiking_id)


class savedPost(models.Model):
    userSaving = models.ForeignKey(get_user_model(), related_name="postsSaved", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="saves", on_delete=models.CASCADE)

    class Meta:
        unique_together = ('post', 'userSaving')

    def __str__(self):
        return str(self.post.pk)
