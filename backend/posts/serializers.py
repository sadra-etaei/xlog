from posts.models import Post, likedPost, savedPost
from rest_framework import serializers
from django.contrib.auth import get_user_model
from accounts.models import Profile
from django.utils import timezone

User = get_user_model()


class PostSerializer(serializers.ModelSerializer):
    likes = serializers.StringRelatedField(many=True, read_only=True)

    def create(self, data):
        post = Post.objects.create(title=data["title"], text=data["text"],
                                   author=data["author"],
                                   profile=data["profile"]
                                   )
        post.save()
        return post

    def update(self, validated_data):
        post = Post.objects.get(pk=validated_data["pk"])
        post.update(title=validated_data["title"], text=validated_data["text"])
        return post

    class Meta:
        model = Post
        fields = ["author", "title", "text", "pk", 'publicationDate', 'publicationShortDate', 'profile', 'likes']


class SavedPostSerializer(serializers.ModelSerializer):
    post = PostSerializer(many=False, read_only=True)

    class Meta:
        model = savedPost
        fields = ['userSaving', 'post']
