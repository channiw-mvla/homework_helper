from rest_framework import serializers
from .models import User, Post, Reply, Rating, Comment
from django.db.models import Avg
class RatingSerialzer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email','password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    user_ratings= RatingSerialzer(many=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email','profile_image','password','liked_replies','user_ratings']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # def create(self, validated_data):
    #     password = validated_data.pop('password', None)
    #     instance = self.Meta.model(**validated_data)
    #     if password is not None:
    #         instance.set_password(password)
    #     instance.save()
    #     return instance



class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']


        
class PostWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'
        
class CommentReadSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Comment
        fields = ['id','comment_message','user','reply']
class CommentWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
class ReplyReadSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    post = PostWriteSerializer()
    average_rating = serializers.SerializerMethodField()
    comments = CommentReadSerializer(many=True)
    def get_average_rating(self, obj):
        return obj.calculate_rating()
    class Meta:
        model = Reply
        fields = ['id','user','post','reply_message','likes','average_rating','comments']
class ReplyWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields =  '__all__'
class PostReadSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    replies = serializers.SerializerMethodField() 
    def get_replies(self,obj):
        sorted_replies = obj.replies.annotate(average_rating=Avg('reply_ratings__rating')).order_by('-average_rating')
        return ReplyReadSerializer(sorted_replies, many=True).data
    class Meta:
        model = Post
        fields = ['id', 'user', 'post_message','replies']
class GetUserSerializer(serializers.ModelSerializer):
    user_ratings= RatingSerialzer(many=True)
    answers = ReplyReadSerializer(many=True)
    total_likes = serializers.SerializerMethodField()
    def get_total_likes(self, obj):
        total_likes = 0
        for answer in obj.answers.all():
            total_likes += answer.likes.count()
        return total_likes
    average_rating = serializers.SerializerMethodField()
    def get_average_rating(self, obj):
        total_rating_score = 0
        num_of_rators = 0
        for answer in obj.answers.all():
            rating_data = answer.calculate_rating()
            total_rating_score += rating_data[1]
            num_of_rators += rating_data[2]
        if num_of_rators == 0:
            return 0
        return round(total_rating_score/num_of_rators,1)
    class Meta:
        model = User 
        fields = ["id", "email","username","profile_image","answers","total_likes","average_rating","liked_replies","user_ratings"]
