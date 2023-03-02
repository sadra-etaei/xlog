
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from accounts.models import Profile, followedUser

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    following = serializers.StringRelatedField(many=True, read_only=True)
    postsSaved = serializers.StringRelatedField(many=True, read_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

    class Meta:
        model = get_user_model()
        fields = ["username", "email", "pk", "password", "profile", 'following', 'postsSaved']


class LoginSerializer(serializers.Serializer):

    def validate(self, attrs):
        # Take username and password from request
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Try to authenticate the user using Django auth framework.
            user = authenticate(self.context.request,
                                username=username, password=password)
            if not user:
                # If we don't have a regular user, raise a ValidationError
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        # We have a valid user, put it in the serializer's validated_data.
        # It will be used in the view.
        attrs['user'] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    def post(self, data):
        profile = Profile.objects.get(user=data["id"])
        profile.update(bio=data["bio"], img=data["profile_img"])
        return profile

    class Meta:
        model = Profile
        fields = ("user", "profile_image", "bio")