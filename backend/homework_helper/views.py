from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer,LoginSerializer,PostReadSerializer,PostWriteSerializer,ReplyReadSerializer,ReplyWriteSerializer,RatingSerialzer,CommentWriteSerializer,CommentReadSerializer,GetUserSerializer, RegisterSerializer
from .models import User, Post, Reply, Rating, Comment
from django.core.mail import send_mail
from backend.settings import EMAIL_HOST_USER, SECRET_KEY
import jwt, datetime
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response



# Create your views here.
class RegisterView(APIView): # reigsters the user
    serializer_class = RegisterSerializer
    def post(self, request):
        serializer = RegisterSerializer(data=request.data) # gets the form data 
        serializer.is_valid(raise_exception=True) # if valid
        serializer.save() # add user
        return Response({"success":True,"data":serializer.data})


class LoginView(APIView):
    serializer_class = LoginSerializer
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first() # gets the user

        if user is None: # if valid
            return Response({'success': False,"error":"Incorrect Username or Password"})
        if not user.check_password(password):
            return Response({'success': False,"error":"Incorrect Username or Password"})

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256') # creates the jwt token
        
        response = Response()

        response.set_cookie(key='jwt', value=token, httponly=False) # adds the token
        response.data = { # returns it
            'success':True,
            'jwt': token,
            'user_id':user.id
        }
        return response

class UserView(APIView):
    serializer_class=UserSerializer
    def get(self, request): # gets the user from the token
        token = request.COOKIES.get('jwt')

        user=checkToken(token)

        serializer = GetUserSerializer(user)
        return Response(serializer.data)

    def put(self, request): #updates the user
        token = request.COOKIES.get('jwt')
        user=checkToken(token)

        username = request.data["username"] # if username and email are not None
        if len(username )== 0:
            return Response({'success': False, 'error': "Username Must Be a Value"})
        email = request.data["email"]
        if len(email) == 0:
            return Response({'success': False, 'error': "Email Must Be a Value"})
        password = request.data["password"]
        if len(password) == 0:
            return Response({'success': False, 'error': "Password Must Be a Value"})
        user.username=username # update user
        user.email=email
        user.set_password(password)
        user.save()

        return Response({'success': True})
    
    def patch(self, request): #updates the user
        token = request.COOKIES.get('jwt')
        user=checkToken(token)


        if "username" in request.data:
            username = request.data["username"] # if username and email are not None
            if len(username )== 0:
                return Response({'success': False, 'error': "Username Must Be a Value"})
            user.username=username # update user
        if "email" in request.data:
            email = request.data["email"]
            if len(email) == 0:
                return Response({'success': False, 'error': "Email Must Be a Value"})
            user.email=email
        if "password" in request.data:
            password = request.data["password"]
            if len(password) == 0:
                return Response({'success': False, 'error': "Password Must Be a Value"})
            user.set_password(password)
        user.save()

        return Response({'success': True})

    def delete(self, request): # removes a user form the database
        token = request.COOKIES.get('jwt')

        user=checkToken(token)

        user.delete()

        return Response({'success': True})
    
class GetUser(APIView):
    serializer_class=GetUserSerializer
    def get(self, request,pk): # gets the user from the token
        serializer = GetUserSerializer(User.objects.get(id=pk))
        return Response(serializer.data)

class LogoutView(APIView): # logs out by delete the jwt cookie
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response

class sendActivation(APIView): # sends the activation with the jwt token embedded in the link
    def post(self, request):
        token = request.COOKIES.get('jwt')

        user=checkToken(token)

    
        # Get the email of the recipient from the request data
        recipient = user.email


        # Send an email to the recipient with the confirmation key
        return write_and_send_email("Email Verification from Email App","Click <a href='http://localhost:8000/verify_email/"+token+"'>Here</a> To Verify Your Email",recipient)


class sendPasswordReset(APIView): # sends the forgot email but getting the token from an email user lookup
    def post(self, request):


    
        # Get the email of the recipient from the request data
        recipient = request.data["email"]

        user=User.objects.filter(email=recipient).first() # get user
        payload = { # jwt data
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')  # create token

        # Send an email to the recipient with the confirmation key
        return write_and_send_email("Password Reset Request from Email App","Click <a href='http://localhost:8000/change_password/"+token+"'>Here</a> To Reset Your Password",recipient)

class verifyEmail(APIView): # sets the is_verified in each user to True
    def post(self, request,token):
        user=checkToken(token)
        user.is_verified=True
        user.save()
        return Response({'success': True})

class resetPassword(APIView): # resets password
    def post(self, request,token):
        user=checkToken(token)
        user.set_password(request.data["new_password"]) # sets the new password and hashes it
        user.save()
        return Response({'success': True})


def checkToken(token): # checks the token to make sure it is valid
    if not token:
            raise AuthenticationFailed('Unauthenticated!')

    try:
        payload = jwt.decode(token, SECRET_KEY, 'HS256')
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed('Unauthenticated!')
    return  User.objects.filter(id=payload['id']).first()

def write_and_send_email(subject,message,recipient): # write the subject and send the emaill to the recipient
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=EMAIL_HOST_USER, # the from email in settings.py
            recipient_list=[recipient],
            fail_silently=False,
        )

        return Response({'success': True})
    except Exception as e:
        return Response({'success': False, 'error': str(e)})
    





class PostList(APIView):
    serializer_class=PostWriteSerializer
    def get(self, request):
        posts = Post.objects.all()
        serializer = PostReadSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({'success': False})
        user = checkToken(token)
        request.data["user"] = user.id
        serializer = PostWriteSerializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save()
            return Response({'success': True , 'post_id':post.id})
        return Response({'success': False})

class PostDetail(APIView):
    serializer_class=PostWriteSerializer
    def get(self, request, pk):
        post = Post.objects.get(id=pk)
        serializer = PostReadSerializer(post)
        return Response(serializer.data)

    def put(self, request, pk):
        post = Post.objects.get(id=pk)
        serializer = PostWriteSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'success': False})

    def delete(self, request, pk):
        post = Post.objects.get(id=pk)
        post.delete()
        return Response({'success': True})


class PostSearch(APIView):
    def get(self,request,search_query):
        # search_query = request.query_params.get('search', None)

        queryset = Post.objects.filter(post_message__icontains=search_query)
        serializer = PostReadSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

class ReplyList(APIView):
    serializer_class = ReplyWriteSerializer
    def get(self, request):
        replies = Reply.objects.all()
        serializer = ReplyReadSerializer(replies, many=True)
        return Response(serializer.data)

    def post(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({'success': False})
        user = checkToken(token)
        request.data["user"] = user.id
        serializer = ReplyWriteSerializer(data=request.data)
        if serializer.is_valid():
            reply = serializer.save()
            reply_data = ReplyReadSerializer(reply).data
            return Response({"reply":reply_data})
        return Response({'success': False})


class ReplyDetail(APIView):
    serializer_class=ReplyWriteSerializer
    def get(self, request, pk):
        reply = Reply.objects.get(id=pk)
        serializer = ReplyReadSerializer(reply)
        return Response(serializer.data)

    def put(self, request, pk):
        reply = Reply.objects.get(id=pk)
        serializer = ReplyWriteSerializer(reply, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'success': False})
    
    def patch(self, request, pk):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({'success': False})
        user = checkToken(token)
        if "likes" in request.data:
            if pk in user.liked_replies.all().values_list('id' , flat=True):
                user.liked_replies.remove(pk)
            else:
                user.liked_replies.add(pk)
            return Response({'success': True})
        if "stars" in request.data:
            if not user.user_ratings.filter(reply=pk).exists():
                rating = Rating(user=user,reply=Reply.objects.get(id=pk),rating=request.data.get('stars'))
                rating.save()
                user.user_ratings.add(rating)
            else:
                rating = user.user_ratings.get(reply=pk)
                rating.rating=request.data.get('stars')
                rating.save()
            return Response({'success': True})
            
        reply = Reply.objects.get(id=pk)
        serializer = ReplyWriteSerializer(reply, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'success': False})

    def delete(self, request, pk):
        reply = Reply.objects.get(id=pk)
        reply.delete()
        return Response({'success': True})
    

class RatingList(APIView):
    serializer_class = RatingSerialzer
    def get(self, request):
        replies = Rating.objects.all()
        serializer = RatingSerialzer(replies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RatingSerialzer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True})
        return Response({'success': False})


class RatingDetail(APIView):
    serializer_class=RatingSerialzer
    def get(self, request, pk):
        reply = Rating.objects.get(id=pk)
        serializer = RatingSerialzer(reply)
        return Response(serializer.data)

    def put(self, request, pk):
        reply = Rating.objects.get(id=pk)
        serializer = RatingSerialzer(reply, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'success': False})
    
    # def patch(self, request, pk):
    #     token = request.COOKIES.get('jwt')
    #     if not token:
    #         return Response({'success': False})
    #     user = checkToken(token)
    #     if "likes" in request.data:
    #         if pk in user.liked_replies.all().values_list('id' , flat=True):
    #             user.liked_replies.remove(pk)
    #         else:
    #             user.liked_replies.add(pk)
    #         return Response({'success': True})
            
        # reply = Reply.objects.get(id=pk)
        # serializer = ReplyWriteSerializer(reply, data=request.data,partial=True)
        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(serializer.data)
        # return Response({'success': False})

    def delete(self, request, pk):
        reply = Rating.objects.get(id=pk)
        reply.delete()
        return Response({'success': True})
    
class CommentList(APIView):
    serializer_class=CommentWriteSerializer
    def get(self, request):
        posts = Comment.objects.all()
        serializer = CommentReadSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            return Response({'success': False})
        user = checkToken(token)
        request.data["user"] = user.id
        serializer = CommentWriteSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save()
            return Response({"id":comment.id,"comment_message":comment.comment_message,"user":{"profile_image":comment.user.profile_image.url}})
        return Response({'success': False})

class CommentDetail(APIView):
    serializer_class=CommentWriteSerializer
    def get(self, request, pk):
        post = Comment.objects.get(id=pk)
        serializer = CommentReadSerializer(post)
        return Response(serializer.data)

    def put(self, request, pk):
        post = Comment.objects.get(id=pk)
        serializer = CommentWriteSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'success': False})

    def delete(self, request, pk):
        post = Comment.objects.get(id=pk)
        post.delete()
        return Response({'success': True})