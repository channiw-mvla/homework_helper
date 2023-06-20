from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=255,unique=True)
    email = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)
    is_verified = models.BooleanField(default=False) # stored if they verified their email
    profile_image = models.ImageField(upload_to='profile_images', null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','password']

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post_message = models.TextField()
    def __str__(self):
        return f"Post: {self.post_message}"
    
class Reply(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name="answers")
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='replies')
    reply_message = models.TextField()
    likes = models.ManyToManyField(User, related_name='liked_replies', blank=True)
    def calculate_rating(self):
        total_rating = 0
        num_of_ratings = self.reply_ratings.count()
        if num_of_ratings != 0:
            for rating in self.reply_ratings.all():
                total_rating += rating.rating
            if num_of_ratings==0:
                average_rating =0 
            else:
                average_rating = total_rating / num_of_ratings
            return [round(average_rating, 1),total_rating,num_of_ratings] # rating, total_rating, num of rates
        return [0,total_rating,num_of_ratings]
    def __str__(self):
        return f"Reply: {self.reply_message}"
    

class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user_ratings')
    reply = models.ForeignKey(Reply, on_delete=models.CASCADE,related_name='reply_ratings')
    rating = models.IntegerField()

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reply = models.ForeignKey(Reply, on_delete=models.CASCADE, related_name='comments')
    comment_message = models.TextField()

    def __str__(self):
        return f"Comment: {self.comment_message}"