from django.shortcuts import render

from comments.models import Comment
from rest_framework.generics import ListAPIView , CreateAPIView, GenericAPIView
from comments.serializers import CommentSerializer
from rest_framework import permissions
from django.contrib.auth import get_user_model
from posts.models import Post
from rest_framework.mixins import CreateModelMixin
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.mixins import CreateModelMixin


class CommentsList(ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        postid = self.kwargs["pk"]
        post = Post.objects.get(id=postid)
        comments = post.comments.all()

        return comments
    
class CommentCreate( GenericAPIView , CreateModelMixin):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def post(self, request, *args, **kwargs):
         return self.create(request, *args, **kwargs)


