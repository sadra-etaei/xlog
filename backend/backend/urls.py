"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from frontend import urls
from accounts.views import UserList, UserDetail, UserPost, LoginView, LogoutView, ProfileView, FollowUser, UserFollowings, UserFollowers
from posts.views import PostList, PostDetail, DraftsList, PostCreate, PostPublish, PostUpdate, PostLike, PostSave, \
    SavedPosts, PersonalPosts, TrendingPosts
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
                  path('api/feed/<int:pk>/', PostList.as_view()),
                  path("api/post/create", PostCreate.as_view()),
                  path('api/posts/<int:pk>', PostDetail.as_view()),
                  path('api/posts/<int:pk>/publish/', PostPublish.as_view()),
                  path('api/posts/<int:pk>/update/', PostUpdate.as_view()),

                  path('api/users/', UserList.as_view()),
                  path('api/users/<int:pk>', UserDetail.as_view()),
                  path('api/users/signup', UserPost.as_view()),
                  path('api/drafts/<int:pk>/', DraftsList.as_view()),
                  path('api/login/', LoginView.as_view()),
                  path('api/logout/<int:pk>/', LogoutView.as_view()),
                  path('api/profile/<int:pk>/', ProfileView.as_view()),
                  path('api/posts/<int:pk>/like/', PostLike.as_view()),
                  path('api/users/<int:pk>/follow/', FollowUser.as_view()),
                  path('api/posts/<int:pk>/save/', PostSave.as_view()),
                  path('api/saved/<int:pk>/', SavedPosts.as_view()),
                  path('api/profile/posts/<int:pk>/', PersonalPosts.as_view()),
                  path('api/posts/trending/',TrendingPosts.as_view() ),
                  path('api/followings/<int:pk>/', UserFollowings.as_view()),
                  path('api/followers/<int:pk>/', UserFollowers.as_view()),

                  path('', include(urls))
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


