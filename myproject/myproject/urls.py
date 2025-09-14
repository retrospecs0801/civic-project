"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path,include
from myapp import views

from rest_framework.routers import DefaultRouter
from myapp.views import ReportViewSet

from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r"issues",ReportViewSet,basename="issue")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.user_login,name = 'user_login'), #defaul root ASA website is visited
    path('app/',include('myapp.urls')),  # after app/ 
    path('api/',include(router.urls)) # api/reports/api/reports/<id>
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
