from rest_framework import serializers
from comments.models import Comment
from django.contrib.auth import get_user_model
from posts.models import Post
from django.utils import timezone

class CommentSerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField(many=False, read_only = False)
     
    class Meta:
        fields = ('user','post','text', 'writtenDate')
        model = Comment