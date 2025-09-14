from django.http import HttpResponse,JsonResponse
from django.shortcuts import render,redirect
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from .models import issues,CustomUser
from rest_framework.decorators import action

from rest_framework.response import Response
from rest_framework import status

# after rest frame work
from rest_framework import viewsets, parsers
from .serializers import ReportSerializer

# after adding filter for api fetching
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend





class ReportViewSet(viewsets.ModelViewSet):
    queryset = issues.objects.all()
    serializer_class = ReportSerializer
    # allow JSON + form + file uploads
    parser_classes = [parsers.JSONParser, parsers.FormParser, parsers.MultiPartParser]
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "status"]
    search_fields = ["description","address","title"]
    ordering_fields = ["created_at"]
    ordering = ["-created_at"]
    
       # custom action for updating status
    @action(detail=True, methods=['post','patch'], url_path='status')
    def set_status(self, request, pk=None):
        issue = self.get_object()

        # take the new status from the request
        new_status = request.data.get("status")
        if not new_status:
            return Response({"error": "Status field is required"}, status=status.HTTP_400_BAD_REQUEST)

        issue.status = new_status
        issue.save()

        return Response({
            "id": issue.id,
            "title": issue.title,
            "status": issue.status
        }, status=status.HTTP_200_OK)

@login_required(login_url="user_login")
def user_dashboard(request):   
    
 if request.method == "POST":
    title = request.POST.get("title")
    category = request.POST.get("category")
    description = request.POST.get("description")
    image = request.FILES.get("image")
    latitude = request.POST.get("latitude")
    longitude = request.POST.get("longitude")
    address = request.POST.get("address")      
    issues.objects.create(
            title = title,
            category = category,
            description = description,
            image=image,
            latitude=latitude,
            longitude=longitude,
            address = address,
            user = request.user,
        )
    return redirect("user_dashboard")     
     
 return render(request,'myapp/user_dashboard.html')

#@login_required(login_url="admin_login")
def admin_dashboard(request):
    if request.method == "POST":
        
        row_id = request.POST.get("row_id")
        new_status = request.POST.get("status")
        
        obj = issues.objects.get(id=row_id)
        obj.status = new_status
        obj.save()
        
     
            
    return render(request,'myapp/admin_dashboard.html')

def user_login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request,username=username,password=password)
        if user and user.role == "user":
            
            login(request,user)
            return redirect("user_dashboard") #set name in path = user_dashboard
        else:
            return HttpResponse("invalid credintials")
    return render(request,"myapp/user_login.html")        

def admin_login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request,username=username,password=password)
        if user and user.role == "admin":
            login(request,user)
            return redirect("admin_dashboard")    
    return render(request,"myapp/admin_login.html" , )    
 
 

def register(request):
    messages = 'input name and password'
      
    if request.method == "POST":
            username = request.POST["username"]
            password = request.POST["password"]
            confirm_password = request.POST["confirm_password"]
            role = request.POST["role"]
          

            if not username or not password:
                messages = "Enter valid username and password"
            elif password != confirm_password:
                messages = "Passwords do not match"
            elif CustomUser.objects.filter(username=username).exists():   # 👈 check
                 messages = "Username already taken"
            else:
                user = CustomUser(username=username, role=role)
                user.set_password(password)
                user.save()
                messages = "User registered successfully"
                
                return redirect("user_dashboard")  
   
    return render(request,'myapp/register.html',{'messages':messages})

def logout_view(request):
    logout(request)   
    return redirect("user_login")

@login_required(login_url="user_login")
def my_issues(request):
    return render(request,"myapp/myissues.html")

def community(request):
    Issues = issues.objects.all()
    
    return render(request,"myapp/community.html", {'issues':Issues})

def search_issues(request):
    query =  request.GET.get("q","")
    Issues = issues.objects.filter(address__icontains=query)

    return render(request,"myapp/issues_table.html",{"issues":Issues})