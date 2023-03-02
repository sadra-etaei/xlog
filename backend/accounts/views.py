from django.shortcuts import render
from rest_framework import viewsets, status
from django.contrib.auth import get_user_model, login, logout
from accounts.serializers import UserSerializer, LoginSerializer, ProfileSerializer
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin, \
    DestroyModelMixin
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from accounts.models import Profile, followedUser


# Create your views here.


class UserList(GenericAPIView, ListModelMixin, CreateModelMixin):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = get_user_model().objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

class UserFollowings(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
    def get_queryset(self):
        userid = self.kwargs["pk"]
        user = get_user_model().objects.get(id=userid)
        query = user.following.all()

        users = [ ]

        for user in query:
            users.append(get_user_model().objects.get(id=user.userFollowed.pk))

        return users

class UserFollowers(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
    def get_queryset(self):
        userid = self.kwargs["pk"]
        user = get_user_model().objects.get(id=userid)
        query = user.followed.all()
        followers = []
        for user in query:
            followers.append(get_user_model().objects.get(id=user.userFollowing.pk))
        return followers

        



class UserDetail(GenericAPIView, RetrieveModelMixin, DestroyModelMixin):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
    queryset = get_user_model().objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.delete(request, *args, **kwargs)


class UserPost(GenericAPIView, CreateModelMixin):
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer
    queryset = get_user_model().objects.all()

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class LoginView(ObtainAuthToken):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = Token.objects.get_or_create(user=user)[0]
        return Response({
            'token': token.key,
            'id': user.pk,
            'username': user.username,
            'email': user.email,
            "authentication status": user.is_authenticated,
            "profile": user.profile.pk

        })


class LogoutView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        token = Token.objects.get(user_id=request.user.pk)
        token.delete()
        logout(request)
        return Response("logged out")


class ProfileView(GenericAPIView, RetrieveModelMixin):
    parser_classes = (MultiPartParser, FormParser)

    permission_classes = (permissions.AllowAny,)
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, pk):
        data = {
            "id": request.user.pk,
            "bio": request.data.get("bio"),
            "profile_img": request.data.get('profile_img')

        }
        profile = Profile.objects.get(pk=pk)
        profile.update(bio=data["bio"], img=data["profile_img"])
        # return profile

        # prof = ProfileSerializer(data=data)
        # if prof.is_valid():
        #     return Response("profile updated")
        return Response(pk, status=status.HTTP_400_BAD_REQUEST)


class FollowUser(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        following = get_user_model().objects.get(pk=request.data.get('following'))
        followed = get_user_model().objects.get(pk=request.data.get('followed'))

        user = followedUser.objects.create(userFollowed=followed,
                                           userFollowing=following)
        user.save()
        return Response("user followed")

    def put(self, request, *args, **kwargs):
        following = get_user_model().objects.get(pk=request.data.get('following'))
        followed = get_user_model().objects.get(pk=request.data.get('followed'))

        user = followedUser.objects.get(userFollowed=followed,
                                        userFollowing=following)
        user.delete()
        return Response("user unfollowed")
