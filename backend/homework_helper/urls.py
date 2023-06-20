from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, sendActivation, verifyEmail, resetPassword, sendPasswordReset, PostList,PostDetail,PostSearch, ReplyList,ReplyDetail, RatingList, RatingDetail, CommentList, CommentDetail, GetUser

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('user/<int:pk>', GetUser.as_view()),
    path('logout', LogoutView.as_view()),
    path('send_activation', sendActivation.as_view()),
    path('verify_email/<token>', verifyEmail.as_view()),
    path('reset_password/<token>',resetPassword.as_view()),
    path('send_reset_password',sendPasswordReset.as_view()),

    path('posts/', PostList.as_view()),
    path('posts/<int:pk>/', PostDetail.as_view()),

    path('posts/search/<str:search_query>', PostSearch.as_view()),

    path('reply/', ReplyList.as_view()),
    path('reply/<int:pk>/', ReplyDetail.as_view()),

    path('rating/', RatingList.as_view()),
    path('rating/<int:pk>/', RatingDetail.as_view()),

    path('comment/', CommentList.as_view()),
    path('comment/<int:pk>/', CommentDetail.as_view()),

]


