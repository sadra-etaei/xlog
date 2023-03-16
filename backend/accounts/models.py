from django.db import models
from django.contrib.auth import models as auth
from django.contrib.auth import get_user_model
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token


@receiver(post_save, sender=auth.User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)



class User(auth.User, auth.PermissionsMixin):

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(auth.User, related_name="profile", on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='media/profiles', blank=True, null=True)
    bio = models.TextField(blank=True)

    def update(self, bio, img):
        self.bio = bio
        self.profile_image = img
        self.save()

    def __str__(self):
        return self.user.username


class followedUser(models.Model):
    userFollowing = models.ForeignKey(get_user_model(), related_name="following", on_delete=models.CASCADE)
    userFollowed = models.ForeignKey(get_user_model(), related_name="followed", on_delete=models.CASCADE)

    class Meta:
        unique_together = ('userFollowing', 'userFollowed')

    def __str__(self):
        return str(self.userFollowed.pk)


@receiver(post_save, sender=auth.User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=auth.User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
