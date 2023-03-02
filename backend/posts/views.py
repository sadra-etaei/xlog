# from django.shortcuts import render
from posts.models import Post, likedPost, savedPost
# from django.views.generic import ListView, DetailView, CreateView
from posts.serializers import PostSerializer, SavedPostSerializer
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, \
    DestroyModelMixin
from django.utils import timezone
from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()


class PostList(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    # queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        userid = self.kwargs["pk"]
        user = get_user_model().objects.get(pk=userid)
        pks = [i.userFollowed.pk for i in user.following.all()]
        pks.append(userid)
        query = Post.objects.filter(author_id__in=pks, publicationDate__isnull=False).order_by('-publicationDate')
        return query


class PersonalPosts(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PostSerializer

    def get_queryset(self):
        userid = self.kwargs['pk']
        posts = Post.objects.filter(author_id=userid, publicationDate__isnull=False)
        return posts

class TrendingPosts(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        posts = Post.objects.order_by("-likes")[:3]

        return posts

class PostCreate(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        data = {
            'author': request.data.get('author'),
            'title': request.data.get('title'),
            'text': request.data.get("text"),
            'profile': request.data.get("authorAvatar")

        }
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetail(GenericAPIView, UpdateModelMixin, RetrieveModelMixin, DestroyModelMixin):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class PostPublish(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        post = Post.objects.get(pk=request.data.get('pk'))
        post.publish()
        post.save()
        return Response("post published")


class PostLike(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        post = Post.objects.get(pk=request.data.get('pk'))
        userLiking = get_user_model().objects.get(pk=request.data.get('user'))
        userLiked = get_user_model().objects.get(pk=post.author.pk)
        like = likedPost.objects.create(post=post, userLiked=userLiked, userLiking=userLiking)

        return Response({"post liked", like.pk})

    def put(self, request, *args, **kwargs):
        like = likedPost.objects.get(post=request.data.get('pk'), userLiking=request.data.get('user'))
        like.delete(using=None)
        return Response({"post unliked"})


class PostUpdate(APIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Post.objects.all()

    def post(self, request, *args, **kwargs):
        data = {
            'pk': request.data.get('pk'),
            'title': request.data.get('title'),
            'text': request.data.get('text')
        }
        post = PostSerializer().update(validated_data=data)
        if post.author is not None:
            return Response(
                data={'pk': post.pk, 'title': post.title, 'text': post.text, 'author': post.author.username},
                status=status.HTTP_201_CREATED)

        return Response(post.pk, status=status.HTTP_400_BAD_REQUEST)


class DraftsList(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PostSerializer

    def get_queryset(self):
        pk = self.kwargs['pk']

        return Post.objects.filter(publicationDate__isnull=True, author_id=pk)


class PostSave(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        post = Post.objects.get(pk=request.data.get('post'))
        user = get_user_model().objects.get(pk=request.data.get('user'))
        savedPost.objects.create(post=post, userSaving=user)

        return Response("post saved")

    def put(self, request, *args, **kwargs):
        save = savedPost.objects.get(post=request.data.get('pk'), userSaving=request.data.get('user'))
        save.delete(using=None)
        return Response("post unsaved")


class SavedPosts(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = SavedPostSerializer

    def get_queryset(self):
        userid = self.kwargs["pk"]
        posts = savedPost.objects.filter(userSaving_id=userid)
        return posts
